import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Heart, 
  Target, 
  Eye, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Coffee,
  SunMedium
} from 'lucide-react';

interface AboutProps {
  navigate: (path: string) => void;
}

export const About: React.FC<AboutProps> = ({ navigate }) => {
  const { t, isBengali } = useLanguage();

  return (
    <div className="space-y-20 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {isBengali ? 'আমাদের পরিচিতি ও দর্শন' : 'OUR ETHOS & PURPOSE'}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#153D32] font-semibold leading-tight">
          {t.about.title}
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light">
          {t.about.subtitle}
        </p>
      </div>

      {/* 2. Philosophy & Gentle Image Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80"
            alt="Person enjoying mindful movement in serene morning light"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#153D32]/80 via-transparent to-transparent flex items-end p-8">
            <p className="text-sm text-white italic font-serif">
              "{isBengali ? 'ছোট ছোট দৈনন্দিন অভ্যাস। উন্নত জীবনধারা। একটি সুস্থ আগামী।' : 'Small daily habits. Better lifestyle. A healthier future.'}"
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C6A66A] uppercase tracking-wider">
            <SunMedium className="w-4 h-4" />
            <span>{t.about.philosophyTitle}</span>
          </div>
          <h2 className="font-serif text-3xl text-[#153D32] font-semibold">
            {isBengali ? 'স্বাস্থ্য কোনো সাময়িক পরীক্ষা নয়, এটি জীবনের প্রতিদিনের যত্ন' : 'Health as a Daily Sanctuary, Not a Grueling Task'}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            {t.about.philosophyText}
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            {isBengali 
              ? 'আমাদের সমাজে ফিটনেসকে প্রায়শই ভারী ওজন তোলা, ক্লান্তিকর ওয়ার্কআউট এবং নিজেকে না খেয়ে রাখার মতো কষ্টকর অভ্যাসের সাথে মিলিয়ে ফেলা হয়। কিন্তু বাস্তব জীবনে সবচেয়ে দীর্ঘস্থায়ী সুফল আসে স্বাভাবিক চলাফেরা, পর্যাপ্ত ঘুম, পুষ্টিকর খাবার এবং একটি মানসিক শান্তির আবহাওয়া থেকে।'
              : 'In conventional fitness culture, health is often commodified through punishing workouts, intense gym equipment, and restrictive eating regimes that alienate everyday people. Prāna Wellness was born out of a desire for a gentler, more compassionate sanctuary where everyone feels safe, welcomed, and supported.'}
          </p>
        </div>
      </div>

      {/* 3. Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#E7EFE6] text-[#153D32] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-[#153D32]">
            {t.about.missionTitle}
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            {t.about.missionText}
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#E7EFE6] text-[#153D32] flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-[#153D32]">
            {t.about.visionTitle}
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            {t.about.visionText}
          </p>
        </div>
      </div>

      {/* 4. Our Gentle Approach */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#153D32] text-[#F8F6F0] space-y-8">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#C6A66A] uppercase">
            {isBengali ? 'আমাদের কর্মপদ্ধতি' : 'METHODOLOGY'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FDFAF5]">
            {t.about.approachTitle}
          </h2>
          <p className="text-sm text-[#A8BDA5] leading-relaxed">
            {t.about.approachText}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-[#0E2922] border border-[#A8BDA5]/20 space-y-2">
            <div className="text-xs font-bold text-[#C6A66A]">01</div>
            <h4 className="font-serif text-lg font-medium text-white">
              {isBengali ? 'সহজ অভ্যাস' : 'Micro-Habits'}
            </h4>
            <p className="text-xs text-[#A8BDA5] leading-relaxed">
              {isBengali ? 'প্রতিদিন ২-৫ মিনিটের ছোট ছোট পরিবর্তন যা সহজেই বজায় রাখা সম্ভব।' : 'Tiny, non-intimidating rituals anchored into your existing daily routine.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E2922] border border-[#A8BDA5]/20 space-y-2">
            <div className="text-xs font-bold text-[#C6A66A]">02</div>
            <h4 className="font-serif text-lg font-medium text-white">
              {isBengali ? 'সুষম খাদ্যশিক্ষা' : 'Nutritional Wisdom'}
            </h4>
            <p className="text-xs text-[#A8BDA5] leading-relaxed">
              {isBengali ? 'কোনো ক্র্যাশ ডায়েট নয়, বরং সহজ ঘরোয়া উপাদানের সুষম ও রঙিন সমাহার।' : 'Understanding whole food variety, seasonal vegetables, and intuitive digestion.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E2922] border border-[#A8BDA5]/20 space-y-2">
            <div className="text-xs font-bold text-[#C6A66A]">03</div>
            <h4 className="font-serif text-lg font-medium text-white">
              {isBengali ? 'স্নিগ্ধ নমনীয়তা' : 'Gentle Movement'}
            </h4>
            <p className="text-xs text-[#A8BDA5] leading-relaxed">
              {isBengali ? 'ভারী ওজন ছাড়াই স্বাভাবিক হাঁটাচলা ও সকালের হালকা স্ট্রেচিং।' : 'Daily outdoor walking, joint freedom, and peaceful bed-to-mat mobility.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E2922] border border-[#A8BDA5]/20 space-y-2">
            <div className="text-xs font-bold text-[#C6A66A]">04</div>
            <h4 className="font-serif text-lg font-medium text-white">
              {isBengali ? 'আন্তরিক সঙ্গ' : 'Peer Companionship'}
            </h4>
            <p className="text-xs text-[#A8BDA5] leading-relaxed">
              {isBengali ? 'একাকী নয়, বরং উৎসাহী ও বন্ধুবৎসল কমিউনিটির নিয়মিত উপস্থিতি।' : 'Sharing milestones and challenges in a supportive group circle free from judgment.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Why Choose Us */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#153D32] font-semibold">
            {t.about.whyChooseTitle}
          </h2>
          <p className="text-sm text-stone-600">
            {isBengali 
              ? 'আমাদের অগ্রাধিকার হলো আপনার মানসিক স্বস্তি, শারীরিক দীর্ঘায়ু এবং পরিবারের সাথে আনন্দময় সময় কাটানো।' 
              : 'Our highest commitment is your enduring vitality, calm mind, and joy in daily living.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#E7EFE6] text-[#153D32] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#153D32]">{t.about.why1}</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{t.about.why1Desc}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#E7EFE6] text-[#153D32] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#153D32]">{t.about.why2}</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{t.about.why2Desc}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#E7EFE6] text-[#153D32] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#153D32]">{t.about.why3}</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{t.about.why3Desc}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#E7EFE6] text-[#153D32] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#153D32]">{t.about.why4}</h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{t.about.why4Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Navigation CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => navigate('/programs')}
          className="px-8 py-3.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>{isBengali ? 'আমাদের প্রোগ্রামগুলো দেখুন' : 'Explore Our Wellness Programs'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
