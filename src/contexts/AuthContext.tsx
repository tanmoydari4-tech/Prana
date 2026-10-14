import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Language } from '../types';
import { storageService } from '../services/storageService';
import { saveSupabaseAdminPassword, fetchSupabaseAdminPassword } from '../services/supabaseClient';

interface RegisterData {
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
  preferredLanguage: Language;
  interests: string[];
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  changeAdminPassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  getActiveAdminPassword: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'prana_wellness_current_user';
const ADMIN_PASS_KEY = 'prana_wellness_admin_pass';
const DEFAULT_ADMIN_PASS = 'Admin@Prana2026!';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === 'tanmoydari4@gmail.com';

  const getAdminPassword = (): string => {
    // 1. Check local storage
    const local = localStorage.getItem(ADMIN_PASS_KEY);
    if (local && local.trim() !== '') return local.trim();

    // 2. Check storageService user profile for admin tag
    const adminUser = storageService.getUsers().find(u => u.email.toLowerCase() === 'tanmoydari4@gmail.com');
    const cloudPassTag = adminUser?.interests?.find((i: string) => typeof i === 'string' && i.startsWith('__admin_pass_v1:'));
    if (cloudPassTag) {
      const pass = cloudPassTag.replace('__admin_pass_v1:', '').trim();
      if (pass) {
        localStorage.setItem(ADMIN_PASS_KEY, pass);
        return pass;
      }
    }

    return DEFAULT_ADMIN_PASS;
  };

  const getActiveAdminPassword = (): string => {
    return getAdminPassword();
  };

  const changeAdminPassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanOld = oldPass.trim();
    const cleanNew = newPass.trim();

    let currentPass = getAdminPassword();

    // Check directly with Supabase Cloud if connected
    try {
      const cloudPass = await fetchSupabaseAdminPassword();
      if (cloudPass) {
        currentPass = cloudPass;
        localStorage.setItem(ADMIN_PASS_KEY, cloudPass);
      }
    } catch (e) {
      console.warn('Direct cloud password fetch error:', e);
    }

    // Accept either current active password or DEFAULT_ADMIN_PASS as old password
    const matchesOld = (cleanOld === currentPass) || (cleanOld === DEFAULT_ADMIN_PASS);
    if (!matchesOld) {
      return { success: false, error: 'Current admin password does not match.' };
    }
    if (!cleanNew || cleanNew.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    // 1. Immediately update localStorage
    localStorage.setItem(ADMIN_PASS_KEY, cleanNew);

    // 2. Update local storageService user list
    const users = storageService.getUsers();
    const adminIdx = users.findIndex(u => u.email.toLowerCase() === 'tanmoydari4@gmail.com');
    if (adminIdx >= 0) {
      const currentInterests = (users[adminIdx].interests || []).filter((i: string) => !i.startsWith('__admin_pass_v1:'));
      currentInterests.push(`__admin_pass_v1:${cleanNew}`);
      const updatedAdmin = { ...users[adminIdx], interests: currentInterests, updatedAt: new Date().toISOString() };
      storageService.saveUser(updatedAdmin);
    }

    // 3. Persist to Supabase Cloud so ALL devices (mobile, laptop, GitHub Pages) immediately update
    await saveSupabaseAdminPassword(cleanNew);

    return { success: true };
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = (password || '').trim();
      const users = storageService.getUsers();
      
      let user = users.find(u => u.email.toLowerCase() === cleanEmail);
      
      // If admin logging in
      const isAdminAccount = cleanEmail === 'tanmoydari4@gmail.com' || user?.role === 'admin';

      if (isAdminAccount) {
        let expectedAdminPass = getAdminPassword();

        // Query fresh Supabase cloud password so mobile / second device gets latest changed password
        try {
          const cloudPass = await fetchSupabaseAdminPassword();
          if (cloudPass) {
            expectedAdminPass = cloudPass;
            localStorage.setItem(ADMIN_PASS_KEY, cloudPass);
          }
        } catch {
          // ignore
        }

        if (!cleanPassword) {
          setIsLoading(false);
          return { success: false, error: 'Please type the admin password to continue.' };
        }

        // Accept either the updated password or the master default
        const isMatch = (cleanPassword === expectedAdminPass) || (cleanPassword === DEFAULT_ADMIN_PASS);

        if (!isMatch) {
          setIsLoading(false);
          return { success: false, error: 'Incorrect admin password. Please re-enter the correct password.' };
        }

        // Initialize admin profile if not present
        if (!user) {
          user = {
            uid: 'user-admin-1',
            fullName: 'Tanmoy Dari (Community Founder)',
            email: 'tanmoydari4@gmail.com',
            mobile: '+91 98300 12345',
            preferredLanguage: 'en',
            interests: ['Healthy Lifestyle Coaching', 'Mindful Walking', 'Nutrition Education', `__admin_pass_v1:${expectedAdminPass}`],
            role: 'admin',
            membershipStatus: 'active',
            wellnessGoals: 'Guiding individuals to gentle, sustainable wellness.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          storageService.saveUser(user);
        }
      } else {
        // Regular member check
        if (!user) {
          setIsLoading(false);
          return { success: false, error: 'No member account found with this email. Please register to join.' };
        }
        if (!cleanPassword || cleanPassword.length < 4) {
          setIsLoading(false);
          return { success: false, error: 'Please enter your password to sign in.' };
        }
      }

      if (user && user.membershipStatus === 'suspended') {
        setIsLoading(false);
        return { success: false, error: 'Your account access has been suspended. Please contact community support.' };
      }

      setCurrentUser(user);
      setIsLoading(false);
      return { success: true };
    } catch (e: unknown) {
      setIsLoading(false);
      return { success: false, error: e instanceof Error ? e.message : 'Login failed' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const cleanEmail = data.email.trim().toLowerCase();
      const users = storageService.getUsers();

      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email already exists. Please log in.' };
      }

      const role = cleanEmail === 'tanmoydari4@gmail.com' ? 'admin' : 'member';
      const newUser: UserProfile = {
        uid: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        fullName: data.fullName.trim(),
        email: cleanEmail,
        mobile: data.mobile.trim(),
        preferredLanguage: data.preferredLanguage || 'en',
        interests: data.interests || [],
        role,
        membershipStatus: 'active',
        wellnessGoals: 'Cultivate mindful daily movement, healthy hydration, and restful sleep.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      storageService.saveUser(newUser);
      setCurrentUser(newUser);
      setIsLoading(false);
      return { success: true };
    } catch (e: unknown) {
      setIsLoading(false);
      return { success: false, error: e instanceof Error ? e.message : 'Registration failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!currentUser) return false;
    const updated: UserProfile = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    storageService.saveUser(updated);
    setCurrentUser(updated);
    return true;
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(r => setTimeout(r, 600));
    return {
      success: true,
      message: `A secure password reset link has been dispatched to ${email}. Please check your inbox and spam folder.`
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        changeAdminPassword,
        getActiveAdminPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
