import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyProps {
  navigate: (path: string) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ navigate }) => {
  const { isBengali } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {isBengali ? 'আইনি ও গোপনীয়তা' : 'LEGAL & PRIVACY'}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#153D32]">
          {isBengali ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
        </h1>
        <p className="text-xs text-stone-500">
          Last Updated: October 2026 • Prāna Wellness & Living Community
        </p>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <div className="p-4 rounded-2xl bg-[#E7EFE6] border border-[#A8BDA5]/30 text-[#153D32] space-y-1">
          <span className="font-semibold block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C6A66A]" />
            {isBengali ? 'আমাদের মূল গোপনীয়তা নীতি সংক্ষেপ:' : 'Our Core Commitment:'}
          </span>
          <p className="text-xs text-stone-700">
            {isBengali 
              ? 'আমরা আপনার ব্যক্তিগত ডেটা কখনোই কোনো তৃতীয় পক্ষের কাছে বিক্রি বা অপব্যবহার করি না। আমরা আধার নম্বর বা কোনো অপ্রয়োজনীয় সংবেদনশীল মেডিকেল তথ্য সংগ্রহ করি না।'
              : 'We strictly protect member privacy. We never sell your personal information or harvest sensitive clinical diagnostic data. Your wellness reflections are your own.'}
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#153D32]">
            {isBengali ? '১. আমরা যে তথ্য সংগ্রহ করি' : '1. Information We Collect'}
          </h2>
          <p>
            {isBengali
              ? 'আমাদের কমিউনিটি প্ল্যাটফর্মে নিবন্ধনের সময় আমরা কেবল প্রয়োজনীয় তথ্য যেমন আপনার পুরো নাম, ইমেল ঠিকানা, মোবাইল নম্বর এবং সাধারণ সুস্থতার আগ্রহ (যেমন: মর্নিং স্ট্রেচিং বা পুষ্টি শিক্ষা) সংগ্রহ করি।'
              : 'When you register as a member or submit an enquiry, we collect only the minimal data necessary to provide supportive wellness guidance: your name, contact email, phone number, and preferred language and habit interests.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#153D32]">
            {isBengali ? '২. আপনার তথ্যের ব্যবহার' : '2. How Your Information is Used'}
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-stone-600">
            <li>{isBengali ? 'আপনার ড্যাশবোর্ডে ব্যক্তিগত অভ্যাস ট্র্যাক করার সুবিধা প্রদান।' : 'Personalizing your member dashboard and daily habit checklist.'}</li>
            <li>{isBengali ? 'লাইভ সকাল ও সন্ধ্যার সেশনের গুগল মিট / জুম লিংক পাঠানো।' : 'Providing direct meeting links for registered online sessions.'}</li>
            <li>{isBengali ? 'গুরুত্বপূর্ণ সেশন ঘোষণা বা মেন্টর ফিডব্যাক প্রদান।' : 'Sending live circle notifications or responder follow-ups.'}</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#153D32]">
            {isBengali ? '৩. কোনো বিজ্ঞাপনদাতা বা ডাটা বিক্রি নয়' : '3. Zero Data Sale Policy'}
          </h2>
          <p>
            {isBengali
              ? 'আমরা কোনো বাণিজ্যিক বিজ্ঞাপনদাতা বা ফার্মাসিউটিক্যাল কোম্পানির সাথে আপনার তথ্য শেয়ার করি না।'
              : 'We do not sell, rent, or trade member details with marketing brokers, pharmaceutical entities, or outside fitness agencies.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#153D32]">
            {isBengali ? '৪. আপনার অধিকার ও ডেটা মোছা' : '4. Your Rights & Data Deletion'}
          </h2>
          <p>
            {isBengali
              ? 'যেকোনো সময় আপনি আপনার প্রোফাইল আপডেট বা আপনার অ্যাকাউন্ট মুছে ফেলার অনুরোধ করতে পারেন।'
              : 'You have full ownership of your habit records. You may request account deletion or export of your personal information at any time by contacting our community desk.'}
          </p>
        </section>
      </div>
    </div>
  );
};
