import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate, onShowToast }) => {
  const { isBengali, t } = useLanguage();
  const { login, isAdmin, isLoading } = useAuth();

  const [email, setEmail] = useState('tanmoydari4@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanPassword) {
      setErrorMsg(isBengali ? 'অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড টাইপ করুন।' : 'Please type your admin password to sign in.');
      return;
    }

    const res = await login(cleanEmail, cleanPassword);
    if (res.success) {
      onShowToast(isBengali ? 'অ্যাডমিন প্যানেলে সফলভাবে প্রবেশ করেছেন।' : 'Admin console unlocked.', 'success');
      navigate('/admin');
    } else {
      setErrorMsg(
        res.error || 
        (isBengali 
          ? 'ভুল পাসওয়ার্ড। আপনার পরিবর্তিত নতুন পাসওয়ার্ড অথবা ডিফল্ট পাসওয়ার্ড (Admin@Prana2026!) দিয়ে পুনরায় চেষ্টা করুন।' 
          : 'Invalid credentials. Please re-enter your updated password or master password.')
      );
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[#153D32] flex items-center justify-center text-[#C6A66A] shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-[#153D32]">
            {isBengali ? 'প্রশাসনিক লগইন' : 'Admin Console Access'}
          </h2>
          <p className="text-xs text-stone-500">
            {isBengali ? 'অ্যাডমিন প্যানেলে প্রবেশের জন্য পাসওয়ার্ড টাইপ করুন' : 'Type your secure password to enter the administrative panel'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-stone-700 block mb-1">
              {isBengali ? 'প্রশাসনিক ইমেল' : 'Admin Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pranawellness.org"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">
              {isBengali ? 'অ্যাডমিন পাসওয়ার্ড (টাইপ করুন)' : 'Admin Password (Type your password)'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isBengali ? 'আপনার পাসওয়ার্ড টাইপ করুন...' : 'Type your master password...'}
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-stone-400 hover:text-stone-700 absolute right-3 top-2.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#C6A66A]" />
            <span>{isLoading ? t.common.loading : (isBengali ? 'লগইন করুন' : 'Sign In as Administrator')}</span>
          </button>
        </form>

        <div className="text-center text-xs text-stone-600">
          <button
            onClick={() => navigate('/')}
            className="text-stone-500 hover:text-[#153D32] hover:underline"
          >
            ← {isBengali ? 'মূল ওয়েবসাইটে ফিরুন' : 'Return to Public Website'}
          </button>
        </div>
      </div>
    </div>
  );
};
