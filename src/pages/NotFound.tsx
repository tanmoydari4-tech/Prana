import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Compass, ArrowRight } from 'lucide-react';

interface NotFoundProps {
  navigate: (path: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ navigate }) => {
  const { isBengali } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md w-full p-8 sm:p-12 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#E7EFE6] text-[#153D32] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-[#C6A66A]" />
        </div>
        <span className="text-4xl font-serif font-bold text-[#153D32]">404</span>
        <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
          {isBengali ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          {isBengali 
            ? 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা লিঙ্কটি ভুল।'
            : 'The page you are looking for may have been moved or the sanctuary link has changed.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full bg-[#153D32] text-white text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#0E2922] transition-colors"
        >
          <span>{isBengali ? 'হোম পেজে ফিরুন' : 'Return Home'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
