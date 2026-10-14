import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Language } from '../../types';
import { User, Mail, Phone, Globe, Target, Save, CheckCircle2 } from 'lucide-react';

interface ProfileProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const Profile: React.FC<ProfileProps> = ({ navigate, onShowToast }) => {
  const { isBengali, t, setLanguage } = useLanguage();
  const { currentUser, updateProfile } = useAuth();

  if (!currentUser) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-serif text-2xl text-[#153D32]">
          {isBengali ? 'লগইন প্রয়োজন' : 'Sign in Required'}
        </h2>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-full bg-[#153D32] text-white text-xs font-semibold"
        >
          {t.nav.login}
        </button>
      </div>
    );
  }

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [mobile, setMobile] = useState(currentUser.mobile);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(currentUser.preferredLanguage);
  const [wellnessGoals, setWellnessGoals] = useState(currentUser.wellnessGoals || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      preferredLanguage,
      wellnessGoals: wellnessGoals.trim()
    });
    setLanguage(preferredLanguage);
    setSaving(false);
    onShowToast(
      isBengali ? 'আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।' : 'Your profile has been updated.',
      'success'
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-1">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase">
          {isBengali ? 'সদস্য প্রোফাইল' : 'MEMBER PROFILE'}
        </span>
        <h1 className="font-serif text-3xl font-semibold text-[#153D32]">
          {isBengali ? 'ব্যক্তিগত তথ্য ও সুস্থতার রূপরেখা' : 'Personal Details & Wellness Intentions'}
        </h1>
        <p className="text-xs text-stone-500">
          {isBengali ? 'আপনার তথ্য ও অভ্যাসের লক্ষ্যমাত্রা পরিবর্তন করুন' : 'Manage your contact details, preferred language, and personal goals'}
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs">
        <form onSubmit={handleSave} className="space-y-5 text-xs text-stone-700">
          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              {isBengali ? 'পুরো নাম' : 'Full Name'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {isBengali ? 'ইমেল (স্থির)' : 'Email (Read Only)'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {isBengali ? 'মোবাইল নম্বর' : 'Mobile Number'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              {isBengali ? 'পছন্দের ভাষা' : 'Preferred Language'}
            </label>
            <div className="relative">
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
              <Globe className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              {isBengali ? 'আপনার ব্যক্তিগত সুস্থতার লক্ষ্য' : 'Personal Wellness Goals'}
            </label>
            <div className="relative">
              <textarea
                rows={4}
                value={wellnessGoals}
                onChange={(e) => setWellnessGoals(e.target.value)}
                placeholder={isBengali ? 'যেমন: প্রতিদিন সকালে ২০ মিনিট হাঁটা, নিয়মিত পানি পান এবং পর্যাপ্ত শান্তিময় ঘুম নিশ্চিত করা...' : 'Describe what small healthy habits you are focusing on...'}
                className="w-full p-3.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold text-xs shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? t.common.loading : t.common.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
