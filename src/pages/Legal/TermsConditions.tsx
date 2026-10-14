import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface TermsConditionsProps {
  navigate: (path: string) => void;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({ navigate }) => {
  const { isBengali } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {isBengali ? 'কমিউনিটি নিয়ম' : 'COMMUNITY GUIDELINES'}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#153D32]">
          {isBengali ? 'শর্তাবলি ও নিয়ম (Terms & Conditions)' : 'Terms & Conditions'}
        </h1>
        <p className="text-xs text-stone-500">
          Last Updated: October 2026 • Prāna Wellness
        </p>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
        {/* Critical Non-Medical Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>{isBengali ? 'স্বাস্থ্য ও চিকিৎসা সংক্রান্ত সুস্পষ্ট ঘোষণা:' : 'Non-Medical Wellness Declaration:'}</span>
          </div>
          <p className="text-xs text-amber-900 leading-normal">
            {isBengali
              ? 'প্রাণ ওয়েলনেস একটি জীবনধারা শিক্ষা ও সুস্থ অভ্যাস গঠন প্ল্যাটফর্ম। আমাদের কোনো সেশন, পরামর্শ বা আর্টিকেল ডাক্তারি প্রেসক্রিপশন বা রোগের চিকিৎসার বিকল্প নয়। যেকোনো গুরুতর শারীরিক বা মানসিক পরিবর্তনের ক্ষেত্রে আপনার চিকিৎসকের পরামর্শ নিন।'
              : 'Prāna Wellness is an educational community dedicated to gentle lifestyle coaching, balanced natural nutrition, and mindful habit building. Nothing on this website or in our live sessions constitutes medical diagnosis, treatment, or clinical healthcare advice.'}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#153D32]">
            {isBengali ? '১. সম্মানজনক কমিউনিটি আচরণ' : '1. Compassionate Community Conduct'}
          </h2>
          <p>
            {isBengali
              ? 'আমাদের কমিউনিটি পারস্পরিক শ্রদ্ধা ও অনুপ্রেরণার স্থান। কোনো সদস্যের প্রতি বডি-শেমিং, অপমানজনক মন্তব্য বা আক্রমণাত্মক আচরণ সম্পূর্ণ নিষিদ্ধ।'
              : 'Our forums and live circles are safe, uplifting sanctuaries. Body-shaming, unsolicited commercial sales, and hostile behavior result in immediate revocation of community privileges.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#153D32]">
            {isBengali ? '২. প্রোগ্রাম নিবন্ধন ও বাতিল নীতি' : '2. Program Enrollment & Refund Policy'}
          </h2>
          <p>
            {isBengali
              ? 'আমাদের অধিকাংশ কমিউনিটি সেশন উন্মুক্ত ও বিনামূল্যে। পেইড কোর্সের ক্ষেত্রে প্রথম ৭ দিনের মধ্যে সন্তুষ্ট না হলে ১০০% ফি ফেরত দেওয়া হয়।'
              : 'Many community challenges are completely complimentary. For structured paid workshops, we offer a 100% money-back refund within 7 days of course start if you feel the cadence does not serve your lifestyle.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#153D32]">
            {isBengali ? '৩. মেধা স্বত্ব ও কন্টেন্ট' : '3. Content & Materials'}
          </h2>
          <p>
            {isBengali
              ? 'আমাদের সকল পুষ্টি গাইড, আর্টিকেল ও ভিডিও উপাদান কেবল ব্যক্তিগত সুস্থতার জন্য ব্যবহার্য।'
              : 'All wellness blueprints, recipe cards, and mindfulness audio recordings provided to members are for personal non-commercial lifestyle practice only.'}
          </p>
        </section>
      </div>
    </div>
  );
};
