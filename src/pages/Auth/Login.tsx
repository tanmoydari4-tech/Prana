import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const Login: React.FC<LoginProps> = ({ navigate, onShowToast }) => {
  const { t, isBengali } = useLanguage();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const res = await login(cleanEmail, cleanPassword);
    if (res.success) {
      if (cleanEmail === 'tanmoydari4@gmail.com') {
        onShowToast(isBengali ? 'অ্যাডমিন হিসেবে লগইন সফল হয়েছে!' : 'Admin access granted!', 'success');
        navigate('/admin');
      } else {
        onShowToast(isBengali ? 'লগইন সফল হয়েছে! স্বাগতম।' : 'Welcome back to your wellness sanctuary!', 'success');
        navigate('/dashboard');
      }
    } else {
      setErrorMsg(res.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size="md" />
          </div>
          <h2 className="font-serif text-3xl font-semibold text-[#153D32]">
            {isBengali ? 'সদস্য অ্যাকাউন্টে লগইন' : 'Member Sanctuary Login'}
          </h2>
          <p className="text-xs text-stone-500">
            {isBengali ? 'আপনার দৈনিক সুস্থ অভ্যাস ও ক্লাসে যুক্ত হতে লগইন করুন' : 'Sign in to access your habit tracker and live online sessions'}
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
              {isBengali ? 'ইমেল ঠিকানা' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium text-stone-700">
                {isBengali ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-stone-500 hover:text-[#153D32] hover:underline"
              >
                {isBengali ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-[#153D32] hover:bg-[#0E2922] disabled:opacity-60 text-[#F8F6F0] font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? t.common.loading : t.nav.login}</span>
            <ArrowRight className="w-4 h-4 text-[#C6A66A]" />
          </button>
        </form>



        <div className="text-center text-xs text-stone-600 space-y-2 pt-2 border-t border-[#A8BDA5]/20">
          <div>
            <span>{isBengali ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account yet? "}</span>
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-[#153D32] hover:underline"
            >
              {t.nav.join}
            </button>
          </div>
          <div>
            <button
              onClick={() => navigate('/admin-login')}
              className="text-[11px] text-stone-500 hover:text-[#153D32] hover:underline inline-flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66A]" />
              <span>{isBengali ? 'অ্যাডমিন কনসোল লগইন' : 'Admin Console Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
