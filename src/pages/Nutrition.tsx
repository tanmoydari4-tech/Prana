import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { NutritionArticle } from '../types';
import { Modal } from '../components/common/Modal';
import { 
  Apple, 
  Droplet, 
  Footprints, 
  Moon, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  User, 
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface NutritionProps {
  navigate: (path: string) => void;
  initialArticleSlug?: string | null;
}

export const Nutrition: React.FC<NutritionProps> = ({ navigate, initialArticleSlug }) => {
  const { t, isBengali } = useLanguage();
  const articles = storageService.getArticles().filter(a => a.published);

  const [activeArticle, setActiveArticle] = useState<NutritionArticle | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (initialArticleSlug) {
      const found = articles.find(a => a.slug === initialArticleSlug);
      if (found) setActiveArticle(found);
    }
  }, [initialArticleSlug, articles]);

  const categories = [
    { key: 'all', label: isBengali ? 'সকল আর্টিকেল' : 'All Topics' },
    { key: 'nutrition', label: isBengali ? 'পুষ্টি ও খাবার' : 'Nutrition' },
    { key: 'movement', label: isBengali ? 'হাঁটা ও সক্রিয়তা' : 'Gentle Movement' },
    { key: 'mindfulness', label: isBengali ? 'ঘুম ও মানসিক প্রশান্তি' : 'Mindfulness & Sleep' },
    { key: 'habits', label: isBengali ? 'দৈনন্দিন অভ্যাস' : 'Daily Habits' },
  ];

  const filteredArticles = filterCategory === 'all'
    ? articles
    : articles.filter(a => a.category === filterCategory);

  return (
    <div className="space-y-20 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {t.nutrition.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#153D32] font-semibold leading-tight">
          {t.nutrition.title}
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-light">
          {t.nutrition.subtitle}
        </p>
      </div>

      {/* 2. Visual Wholesome Plate Guide (Interactive 4-Card Hero Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Apple className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#153D32]">
            {t.nutrition.pillar1Title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {t.nutrition.pillar1Desc}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
            <Droplet className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#153D32]">
            {t.nutrition.pillar2Title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {t.nutrition.pillar2Desc}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Footprints className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#153D32]">
            {t.nutrition.pillar3Title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {t.nutrition.pillar3Desc}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
            <Moon className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#153D32]">
            {t.nutrition.pillar4Title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {t.nutrition.pillar4Desc}
          </p>
        </div>
      </div>

      {/* 3. Daily Hydration & Natural Nourishment Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#153D32] text-[#F8F6F0] flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="text-xs font-bold tracking-widest text-[#C6A66A] uppercase">
            {isBengali ? 'দৈনিক সুস্থ রুটিন' : 'GENTLE HABIT FORMULA'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FDFAF5]">
            {isBengali ? 'পানীয়, পুষ্টি ও হাঁটার সহজ সমন্বয়' : 'The 8-Glass Water & Post-Meal Walk Rhythm'}
          </h2>
          <p className="text-xs sm:text-sm text-[#A8BDA5] leading-relaxed">
            {isBengali
              ? 'সকালে ঘুম থেকে উঠে ১ গ্লাস হালকা গরম পানি, খাবারের ২০ মিনিট পর আলতো হাঁটা এবং সূর্যাস্তের পর হালকা খাবার গ্রহণ—এই তিনটি সাধারণ নিয়মেই শরীরে ফিরে আসে অভাবনীয় প্রাণচাঞ্চল্য।'
              : 'Begin each morning with a calm glass of room-temperature water. Honor a gentle 15-minute stroll after lunch and dinner. Simplicity outlives complexity every single time.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 rounded-full bg-[#C6A66A] hover:bg-[#d8b87a] text-[#153D32] text-xs font-semibold shadow-xs transition-colors"
          >
            {isBengali ? 'পুষ্টি কর্মশালায় অংশ নিন' : 'Join a Nutrition Workshop'}
          </button>
        </div>
      </div>

      {/* 4. Article Section with Category Filters */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-[#153D32] font-semibold">
              {t.nutrition.articlesTitle}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {isBengali ? 'বিজ্ঞানসম্মত ও প্রাকৃতিক সহজ পথনির্দেশনা' : 'Evidence-informed lifestyle and nutrition articles'}
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilterCategory(c.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterCategory === c.key
                    ? 'bg-[#153D32] text-[#F8F6F0] font-semibold'
                    : 'bg-white text-stone-600 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="rounded-2xl bg-white border border-[#A8BDA5]/25 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col sm:flex-row group cursor-pointer"
              onClick={() => setActiveArticle(article)}
            >
              <div className="sm:w-5/12 h-52 sm:h-auto overflow-hidden relative">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="sm:w-7/12 p-6 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E7EFE6] text-[#153D32] font-semibold text-[11px]">
                      {isBengali && article.categoryBn ? article.categoryBn : article.category}
                    </span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-[#153D32] leading-snug group-hover:text-[#C6A66A] transition-colors">
                    {isBengali && article.titleBn ? article.titleBn : article.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {isBengali && article.summaryBn ? article.summaryBn : article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#A8BDA5]/20 flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    {t.nutrition.author} {article.author}
                  </span>
                  <div className="flex items-center gap-1 font-semibold text-[#153D32] group-hover:translate-x-0.5 transition-transform">
                    <span>{t.nutrition.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle && (
        <Modal
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          title={isBengali && activeArticle.titleBn ? activeArticle.titleBn : activeArticle.title}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-sm text-[#252A27]">
            <div className="h-64 rounded-xl overflow-hidden">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pb-3 border-b border-[#A8BDA5]/20">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#153D32]" />
                <span>{activeArticle.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#153D32]" />
                <span>{activeArticle.readTime}</span>
              </div>
            </div>

            <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {isBengali && activeArticle.contentBn ? activeArticle.contentBn : activeArticle.content}
            </div>

            <div className="p-3.5 rounded-xl bg-[#E7EFE6] border border-[#A8BDA5]/30 text-xs text-[#153D32]">
              <span className="font-semibold block mb-0.5">
                {isBengali ? '💡 সুস্থ অভ্যাসের সারসংক্ষেপ:' : '💡 Sustainable Takeaway:'}
              </span>
              {isBengali 
                ? 'কঠিন নিয়ম বা ডায়েটের প্রয়োজন নেই। প্রতিদিন একটি রঙিন শাকসবজি বা ফল যোগ করুন এবং খাওয়ার পর অল্প কিছুক্ষণ স্বস্তিতে হাঁটুন।'
                : 'Prioritize joyful additions of colorful whole foods and gentle movement over deprivation.'}
            </div>

            <div className="pt-4 flex justify-end border-t border-[#A8BDA5]/20">
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold hover:bg-[#0E2922]"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
