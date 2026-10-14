import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { Modal } from '../components/common/Modal';
import { Program, WellnessEvent } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight, 
  Sparkles, 
  Sun, 
  Apple, 
  Moon, 
  Users, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  Calendar, 
  HeartHandshake, 
  ShieldAlert,
  Compass
} from 'lucide-react';

interface HomeProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const Home: React.FC<HomeProps> = ({ navigate, onShowToast }) => {
  const { t, isBengali } = useLanguage();
  const { currentUser } = useAuth();
  const settings = storageService.getSettings();
  const programs = storageService.getPrograms().filter(p => p.published && p.featured);
  const events = storageService.getEvents().filter(e => e.status === 'upcoming');
  const articles = storageService.getArticles().filter(a => a.published).slice(0, 3);
  const testimonials = storageService.getTestimonials(true).slice(0, 3);

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const nextEvent = events.length > 0 ? events[0] : null;

  const handleEnrollClick = (program: Program) => {
    setSelectedProgram(program);
    setRegisterModalOpen(true);
  };

  const handleConfirmEnrollment = () => {
    if (!currentUser) {
      setRegisterModalOpen(false);
      onShowToast(isBengali ? 'অনুগ্রহ করে প্রথমে সদস্য হিসেবে লগইন করুন।' : 'Please log in or register to join this program.', 'info');
      navigate('/login');
      return;
    }
    if (!selectedProgram) return;

    storageService.addEnrollment({
      id: `enr-${Date.now()}`,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      programId: selectedProgram.id,
      programTitle: selectedProgram.title,
      programCategory: selectedProgram.category,
      amount: selectedProgram.price,
      paymentStatus: selectedProgram.price === 0 ? 'free_intro' : 'paid',
      paymentReference: `SIM-PRANA-${Math.floor(100000 + Math.random() * 900000)}`,
      enrolledAt: new Date().toISOString(),
      status: 'active'
    });

    setRegisterModalOpen(false);
    onShowToast(
      isBengali 
        ? `অভিনন্দন! আপনি সফলভাবে "${selectedProgram.titleBn || selectedProgram.title}" প্রোগ্রামে নিবন্ধিত হয়েছেন।` 
        : `Success! You have enrolled in "${selectedProgram.title}".`,
      'success'
    );
    navigate('/member/programs');
  };

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. Full-Width Premium Hero Section (approx 85-90vh) */}
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Editorial Nature Background with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImageUrl || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=80"}
            alt="Tranquil morning nature wellness"
            className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-pulse motion-safe:duration-[10000ms]"
          />
          {/* Multi-layered soft gradient overlays for readable luxury editorial aesthetic */}
          <div className="absolute inset-0 bg-linear-to-r from-[#153D32]/90 via-[#153D32]/65 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#F8F6F0] via-transparent to-[#153D32]/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl lg:max-w-3xl space-y-6 text-[#F8F6F0]">
            {/* Small Label Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7EFE6]/20 border border-[#A8BDA5]/40 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66A]" />
              <span className="text-xs font-semibold tracking-widest text-[#E7EFE6] uppercase">
                {t.hero.tag}
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#FDFAF5] leading-[1.15]">
              {isBengali ? settings.heroHeadlineBn || t.hero.headline : settings.heroHeadline || t.hero.headline}
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#F8F6F0]/90 leading-relaxed max-w-xl font-light">
              {isBengali ? settings.heroSubheadlineBn || t.hero.subheadline : settings.heroSubheadline || t.hero.subheadline}
            </p>

            {/* Non-Gym Assurance Pill */}
            <div className="flex items-center gap-2 py-1 text-xs text-[#A8BDA5] font-medium">
              <CheckCircle className="w-4 h-4 text-[#C6A66A] shrink-0" />
              <span>{t.hero.badgeNonGym}</span>
            </div>

            {/* Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate(currentUser ? '/dashboard' : '/register')}
                className="px-7 py-3.5 rounded-full bg-[#C6A66A] hover:bg-[#d8b87a] text-[#153D32] font-semibold text-sm shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>{currentUser ? t.nav.dashboard : t.hero.startCta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/programs')}
                className="px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-[#FDFAF5] border border-white/30 backdrop-blur-xs font-medium text-sm transition-all duration-300"
              >
                {t.hero.exploreCta}
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/70 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase font-medium">{t.hero.scrollDown}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* 2. Upcoming Live Session Ticker / Countdown Feature */}
      {nextEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-[#E7EFE6] text-[#153D32] shrink-0 mt-1">
                <Sun className="w-6 h-6 text-[#153D32]" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#153D32] text-white">
                    {isBengali ? 'পরবর্তী লাইভ সেশন' : 'Next Live Session'}
                  </span>
                  <span className="text-xs text-stone-500">
                    {nextEvent.formatBn || (nextEvent.format === 'online' ? 'Online' : 'In-Person')}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#153D32]">
                  {isBengali && nextEvent.titleBn ? nextEvent.titleBn : nextEvent.title}
                </h3>
                <p className="text-xs text-stone-600">
                  {nextEvent.hostRole} • {nextEvent.hostName}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex flex-col items-center sm:items-end">
                <span className="text-xs font-semibold text-[#153D32] mb-1">
                  {t.events.countdownLabel}
                </span>
                <CountdownTimer targetDate={nextEvent.startAt} />
              </div>
              <button
                onClick={() => navigate('/events')}
                className="px-5 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold transition-colors shrink-0"
              >
                {t.events.registerEvent}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. The 4 Gentle Wellness Pillars (Anti-Gym, Whole-Living Philosophy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/20 px-3 py-1 rounded-full">
            {isBengali ? 'সুস্থ জীবনের মূল স্তম্ভ' : 'CORE WELLNESS PILLARS'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#153D32] font-semibold">
            {isBengali ? 'কঠিন জিম নয়—প্রতিদিনের শান্তিময় সুষম জীবন' : 'A Gentle Path Built for Real Life'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {isBengali 
              ? 'ভারী ওয়ার্কআউট বা কৃত্রিম ডায়েটের ক্ষতিকর চক্র থেকে বেরিয়ে আসুন। আমাদের পদ্ধতি মনোনিবেশ করে ছোট ছোট আনন্দময় দৈনন্দিন অভ্যাসে।'
              : 'True health is cultivated not through exhausting physical punishment, but through everyday mindfulness, nutritious meals, refreshing sleep, and compassionate support.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Pillar 1 */}
          <div className="p-7 rounded-2xl bg-white border border-[#A8BDA5]/25 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E7EFE6] flex items-center justify-center text-[#153D32] group-hover:bg-[#153D32] group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#153D32]">
                {t.highlights.gentleMovement}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t.highlights.gentleMovementDesc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#A8BDA5]/20 text-xs font-semibold text-[#153D32] flex items-center gap-1">
              <span>{isBengali ? 'প্রাকৃতিক হাঁটা ও নমনীয়তা' : 'No equipment needed'}</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-7 rounded-2xl bg-white border border-[#A8BDA5]/25 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E7EFE6] flex items-center justify-center text-[#153D32] group-hover:bg-[#153D32] group-hover:text-white transition-colors">
                <Apple className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#153D32]">
                {t.highlights.balancedNutrition}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t.highlights.balancedNutritionDesc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#A8BDA5]/20 text-xs font-semibold text-[#153D32] flex items-center gap-1">
              <span>{isBengali ? 'রঙিন প্রাকৃতিক পুষ্টি' : 'Zero crash diets'}</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-7 rounded-2xl bg-white border border-[#A8BDA5]/25 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E7EFE6] flex items-center justify-center text-[#153D32] group-hover:bg-[#153D32] group-hover:text-white transition-colors">
                <Moon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#153D32]">
                {t.highlights.mindfulRest}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t.highlights.mindfulRestDesc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#A8BDA5]/20 text-xs font-semibold text-[#153D32] flex items-center gap-1">
              <span>{isBengali ? 'গভীর ও শান্ত ঘুম' : 'Natural circadian rhythms'}</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-7 rounded-2xl bg-white border border-[#A8BDA5]/25 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E7EFE6] flex items-center justify-center text-[#153D32] group-hover:bg-[#153D32] group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#153D32]">
                {t.highlights.communityCare}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {t.highlights.communityCareDesc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#A8BDA5]/20 text-xs font-semibold text-[#153D32] flex items-center gap-1">
              <span>{isBengali ? 'আন্তরিক বন্ধুদের সঙ্গ' : 'Continuous accountability'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Programs Showcase */}
      <section className="bg-[#E7EFE6]/50 py-20 border-y border-[#A8BDA5]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase">
                {t.programs.badge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#153D32] font-semibold mt-1">
                {t.programs.title}
              </h2>
              <p className="text-sm text-stone-600 mt-2 max-w-xl">
                {t.programs.subtitle}
              </p>
            </div>
            <button
              onClick={() => navigate('/programs')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#153D32] hover:text-[#C6A66A] transition-colors"
            >
              <span>{isBengali ? 'সকল প্রোগ্রাম দেখুন' : 'View all 6 programs'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.slice(0, 3).map((program) => (
              <div
                key={program.id}
                className="rounded-2xl bg-white border border-[#A8BDA5]/30 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#153D32]/90 text-[#F8F6F0] backdrop-blur-xs">
                      {isBengali && program.categoryNameBn ? program.categoryNameBn : program.categoryName}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C6A66A] text-[#153D32] shadow-sm">
                      {settings.currencySymbol}{program.price}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-[#153D32]" />
                      <span>{isBengali && program.durationBn ? program.durationBn : program.duration}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#153D32] leading-snug">
                      {isBengali && program.titleBn ? program.titleBn : program.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {isBengali && program.descriptionBn ? program.descriptionBn : program.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#A8BDA5]/20 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSelectedProgram(program);
                        navigate(`/programs?selected=${program.id}`);
                      }}
                      className="text-xs font-semibold text-stone-700 hover:text-[#153D32] transition-colors"
                    >
                      {t.programs.viewDetails}
                    </button>
                    <button
                      onClick={() => handleEnrollClick(program)}
                      className="px-4 py-2 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold shadow-xs transition-colors"
                    >
                      {t.programs.registerNow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Nutrition & Wholesome Meal Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
              {t.nutrition.badge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#153D32] font-semibold leading-tight">
              {t.nutrition.title}
            </h2>
            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              {t.nutrition.subtitle}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#E7EFE6] text-[#153D32] shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[#153D32]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#153D32]">{t.nutrition.pillar1Title}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">{t.nutrition.pillar1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#E7EFE6] text-[#153D32] shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[#153D32]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#153D32]">{t.nutrition.pillar2Title}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">{t.nutrition.pillar2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#E7EFE6] text-[#153D32] shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[#153D32]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#153D32]">{t.nutrition.pillar3Title}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">{t.nutrition.pillar3Desc}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/nutrition')}
                className="px-6 py-3 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
              >
                <span>{isBengali ? 'পুষ্টি ও রেসিপি গাইড দেখুন' : 'Explore Nutrition Wisdom'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80"
                alt="Colorful fresh natural food"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 max-w-xs p-5 rounded-2xl bg-[#153D32] text-white shadow-xl border border-[#C6A66A]/30">
              <span className="text-[#C6A66A] text-xs font-bold uppercase tracking-wider block mb-1">
                {isBengali ? 'প্রাকৃতিক পুষ্টি নীতি' : 'Wholesome Simplicity'}
              </span>
              <p className="text-xs text-[#F8F6F0]/90 leading-relaxed">
                {isBengali 
                  ? 'কোনো জটিল ক্যালোরি হিসাব নয়—খাবারে কেবল রঙিন বৈচিত্র্য ও পর্যাপ্ত বিশুদ্ধ পানির স্পর্শ রাখুন।'
                  : 'Add joyful color and fresh hydration to your plate every day rather than subtracting meals.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Authentic Community Voices & Testimonials */}
      <section className="bg-[#153D32] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold tracking-widest text-[#C6A66A] uppercase">
              {t.community.badge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FDFAF5]">
              {t.community.title}
            </h2>
            <p className="text-sm text-[#A8BDA5]">
              {t.community.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-8 rounded-2xl bg-[#0E2922] border border-[#A8BDA5]/20 shadow-lg flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#C6A66A]">
                    {[...Array(test.rating)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#F8F6F0]/90 italic leading-relaxed">
                    "{isBengali && test.quoteBn ? test.quoteBn : test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#A8BDA5]/20">
                  <img
                    src={test.avatarUrl}
                    alt={test.authorName}
                    className="w-11 h-11 rounded-full object-cover border border-[#C6A66A]/40"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{test.authorName}</h4>
                    <p className="text-xs text-[#A8BDA5]">{test.authorLocation}</p>
                    <p className="text-[10px] text-[#C6A66A] mt-0.5">{test.programTaken}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/community')}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-[#F8F6F0] text-xs font-semibold transition-colors"
            >
              {isBengali ? 'কমিউনিটি ফোরাম ও অভিজ্ঞতা দেখুন' : 'Explore Community Stories & Join Challenge'}
            </button>
          </div>
        </div>
      </section>

      {/* 7. Latest Nutrition & Lifestyle Articles Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase">
              {isBengali ? 'তথ্যবহুল জ্ঞান ও অভ্যাস' : 'HEALTH LITERACY'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#153D32] font-semibold mt-1">
              {t.nutrition.articlesTitle}
            </h2>
          </div>
          <button
            onClick={() => navigate('/nutrition')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#153D32] hover:text-[#C6A66A] transition-colors"
          >
            <span>{isBengali ? 'সকল আর্টিকেল দেখুন' : 'Read all wellness articles'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <div
              key={art.id}
              className="rounded-2xl bg-white border border-[#A8BDA5]/25 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group cursor-pointer"
              onClick={() => navigate(`/nutrition?article=${art.slug}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E7EFE6] text-[#153D32] font-semibold">
                      {isBengali && art.categoryBn ? art.categoryBn : art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#153D32] leading-snug group-hover:text-[#C6A66A] transition-colors">
                    {isBengali && art.titleBn ? art.titleBn : art.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {isBengali && art.summaryBn ? art.summaryBn : art.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#A8BDA5]/20 flex items-center justify-between text-xs text-[#153D32] font-semibold">
                  <span>{t.nutrition.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Welcoming CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-linear-to-r from-[#153D32] to-[#1D5344] text-[#F8F6F0] p-8 sm:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-[#C6A66A]/30">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C6A66A]/20 text-[#C6A66A] border border-[#C6A66A]/30 inline-block">
              {isBengali ? 'আজ থেকেই আপনার সুস্থ যাত্রা শুরু করুন' : 'Take The First Gentle Step'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FDFAF5]">
              {isBengali ? 'ছোট অভ্যাসে আনুন জীবনের সুস্থ পরিবর্তন।' : 'Ready to Experience Sustainable Daily Vitality?'}
            </h2>
            <p className="text-sm text-[#A8BDA5] leading-relaxed">
              {isBengali
                ? 'আমাদের বন্ধুত্বপূর্ণ কমিউনিটিতে যোগ দিন। সকালের হালকা স্ট্রেচিং, পুষ্টিকর খাবার ও মানসিক শান্তির এক নতুন সূচনা হোক।'
                : 'Join our welcoming community today. Access morning breathwork circles, practical grocery wisdom, and supportive peers.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 rounded-full bg-[#C6A66A] hover:bg-[#d8b87a] text-[#153D32] font-semibold text-sm shadow-md transition-all transform hover:scale-105"
            >
              {t.nav.join}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FDFAF5] font-medium text-sm transition-colors"
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      </section>

      {/* Program Registration Confirmation Modal */}
      {selectedProgram && (
        <Modal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          title={isBengali && selectedProgram.titleBn ? selectedProgram.titleBn : selectedProgram.title}
          maxWidth="md"
        >
          <div className="space-y-4 text-sm text-[#252A27]">
            <div className="p-3.5 rounded-xl bg-[#E7EFE6] border border-[#A8BDA5]/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-stone-600">{t.programs.duration}:</span>
                <span className="text-xs font-semibold text-[#153D32]">
                  {isBengali && selectedProgram.durationBn ? selectedProgram.durationBn : selectedProgram.duration}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-600">{t.programs.price}:</span>
                <span className="text-sm font-bold text-[#153D32]">
                  {settings.currencySymbol}{selectedProgram.price}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {isBengali && selectedProgram.descriptionBn ? selectedProgram.descriptionBn : selectedProgram.description}
            </p>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-[#153D32] block">
                {t.programs.includes}:
              </span>
              {(isBengali && selectedProgram.featuresBn ? selectedProgram.featuresBn : selectedProgram.features).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                  <CheckCircle className="w-3.5 h-3.5 text-[#153D32] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-normal">
              {t.programs.disclaimer}
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#A8BDA5]/20">
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmEnrollment}
                className="px-5 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold shadow-xs transition-colors"
              >
                {t.programs.confirmEnrollment}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
