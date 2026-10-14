import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import { Language } from '../../types';
import { Mail, Lock, User, Phone, Globe, ArrowRight, Sparkles } from 'lucide-react';

interface RegisterProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const Register: React.FC<RegisterProps> = ({ navigate, onShowToast }) => {
  const { t, isBengali } = useLanguage();
  const { register, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(isBengali ? 'bn' : 'en');
  const [interests, setInterests] = useState<string[]>(['Morning Sessions', 'Nutrition Education']);
  const [errorMsg, setErrorMsg] = useState('');

  const interestOptions = [
    { key: 'lifestyle_coaching', label: isBengali ? 'সুস্থ জীবনধারা কোচিং' : 'Lifestyle Coaching' },
    { key: 'nutrition', label: isBengali ? 'সুষম পুষ্টি শিক্ষা' : 'Nutrition Education' },
    { key: 'morning_sessions', label: isBengali ? 'সকালের স্ট্রেচিং ও শ্বাস' : 'Morning Breath & Mobility' },
    { key: 'evening_sessions', label: isBengali ? 'সন্ধ্যার মেডিটেশন ও ঘুম' : 'Evening De-Stress' },
    { key: 'mindful_walks', label: isBengali ? 'প্রকৃতিতে হাঁটাচলা' : 'Mindful Walking' },
  ];

  const toggleInterest = (label: string) => {
    if (interests.includes(label)) {
      setInterests(interests.filter(i => i !== label));
    } else {
      setInterests([...interests, label]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg(isBengali ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    const res = await register({
      fullName,
      email,
      mobile,
      password,
      preferredLanguage,
      interests
    });

    if (res.success) {
      onShowToast(
        isBengali 
          ? 'অভিনন্দন! প্রাণ ওয়েলনেস কমিউনিটিতে আপনাকে সাদর স্বাগতম।' 
          : 'Welcome to the Prāna Wellness community! Your membership is active.',
        'success'
      );
      navigate('/dashboard');
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size="md" />
          </div>
          <h2 className="font-serif text-3xl font-semibold text-[#153D32]">
            {isBengali ? 'কমিউনিটিতে যোগ দিন' : 'Join Our Wellness Sanctuary'}
          </h2>
          <p className="text-xs text-stone-500">
            {isBengali ? 'দৈনিক সুস্থ অভ্যাস, পুষ্টি পরামর্শ ও লাইভ সেশনের জন্য বিনামূল্যে নিবন্ধন করুন' : 'Begin your journey towards mindful daily movement and wholesome nourishment'}
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
              {isBengali ? 'আপনার পুরো নাম *' : 'Full Name *'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isBengali ? 'যেমন: শুভ্রা ব্যানার্জী' : 'e.g. Maya Sharma'}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-stone-700 block mb-1">
                {isBengali ? 'ইমেল ঠিকানা *' : 'Email Address *'}
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
              <label className="font-medium text-stone-700 block mb-1">
                {isBengali ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98300 00000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-stone-700 block mb-1">
                {isBengali ? 'পাসওয়ার্ড *' : 'Password *'}
              </label>
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

            <div>
              <label className="font-medium text-stone-700 block mb-1">
                {isBengali ? 'পছন্দের ভাষা' : 'Preferred Language'}
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1.5">
              {isBengali ? 'আপনার প্রধান সুস্থতা আগ্রহ (নির্বাচন করুন)' : 'Wellness Interests (Select topics)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => {
                const selected = interests.includes(opt.label);
                return (
                  <button
                    type="button"
                    key={opt.key}
                    onClick={() => toggleInterest(opt.label)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                      selected
                        ? 'bg-[#153D32] text-[#F8F6F0] font-semibold'
                        : 'bg-[#F8F6F0] text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#E7EFE6]/60 border border-[#A8BDA5]/30 text-[11px] text-stone-600 leading-normal">
            {isBengali
              ? 'নিবন্ধন করার মাধ্যমে আপনি আমাদের গোপনীয়তা নীতি ও কমিউনিটি নির্দেশিকায় সম্মতি দিচ্ছেন। আমরা কোনো সংবেদনশীল ডেটা সংগ্রহ করি না।'
              : 'By joining, you agree to our peaceful community guidelines and privacy policy. We never spam.'}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] disabled:opacity-60 text-[#F8F6F0] font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? t.common.loading : t.nav.join}</span>
            <ArrowRight className="w-4 h-4 text-[#C6A66A]" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-600">
          <span>{isBengali ? 'ইতিমধ্যে সদস্য? ' : 'Already a registered member? '}</span>
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-[#153D32] hover:underline"
          >
            {t.nav.login}
          </button>
        </div>
      </div>
    </div>
  );
};
