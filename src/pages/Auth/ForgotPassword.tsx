import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordProps {
  navigate: (path: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigate }) => {
  const { t, isBengali } = useLanguage();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    const res = await resetPassword(email);
    setSubmitting(false);
    setSentMessage(res.message);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size="md" />
          </div>
          <h2 className="font-serif text-3xl font-semibold text-[#153D32]">
            {isBengali ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-stone-500">
            {isBengali 
              ? 'আপনার নিবন্ধিত ইমেল ঠিকানা লিখুন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাব'
              : 'Enter your registered email address and we will dispatch a secure reset link.'}
          </p>
        </div>

        {sentMessage ? (
          <div className="p-6 rounded-2xl bg-[#E7EFE6] border border-[#A8BDA5]/40 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#153D32] mx-auto" />
            <h4 className="font-serif text-lg font-semibold text-[#153D32]">
              {isBengali ? 'ইমেল পাঠানো হয়েছে' : 'Reset Link Sent'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {sentMessage}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-2 px-5 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold"
            >
              {isBengali ? 'লগইন পেজে ফিরে যান' : 'Return to Login'}
            </button>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{submitting ? t.common.loading : (isBengali ? 'রিসেট লিংক পাঠান' : 'Send Reset Link')}</span>
              <ArrowRight className="w-4 h-4 text-[#C6A66A]" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-stone-600">
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-[#153D32] hover:underline"
          >
            {isBengali ? 'লগইন পেজে ফিরুন' : 'Back to Member Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
