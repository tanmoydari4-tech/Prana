import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { Program, ProgramCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/common/Modal';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  ShieldAlert,
  CalendarCheck,
  CreditCard
} from 'lucide-react';

interface ProgramsProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  initialSelectedId?: string | null;
}

export const Programs: React.FC<ProgramsProps> = ({ navigate, onShowToast, initialSelectedId }) => {
  const { t, isBengali } = useLanguage();
  const { currentUser } = useAuth();
  const settings = storageService.getSettings();
  const allPrograms = storageService.getPrograms().filter(p => p.published);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    if (initialSelectedId) {
      const match = allPrograms.find(p => p.id === initialSelectedId);
      if (match) {
        setActiveProgram(match);
        setDetailModalOpen(true);
      }
    }
  }, [initialSelectedId, allPrograms]);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: t.programs.filterAll },
    { key: 'lifestyle_coaching', label: t.programs.categoryLifestyle },
    { key: 'nutrition_education', label: t.programs.categoryNutrition },
    { key: 'morning_sessions', label: t.programs.categoryMorning },
    { key: 'evening_sessions', label: t.programs.categoryEvening },
    { key: 'personal_consultation', label: t.programs.categoryConsultation },
    { key: 'wellness_community', label: t.programs.categoryCommunity },
  ];

  const filteredPrograms = selectedCategory === 'all'
    ? allPrograms
    : allPrograms.filter(p => p.category === selectedCategory);

  const handleRegister = (prog: Program) => {
    setActiveProgram(prog);
    setEnrollModalOpen(true);
  };

  const handleViewDetails = (prog: Program) => {
    setActiveProgram(prog);
    setDetailModalOpen(true);
  };

  const handleConfirmEnrollment = () => {
    if (!currentUser) {
      setEnrollModalOpen(false);
      onShowToast(isBengali ? 'অনুগ্রহ করে প্রথমে সদস্য হিসেবে লগইন বা নিবন্ধন করুন।' : 'Please log in or register to join this program.', 'info');
      navigate('/login');
      return;
    }
    if (!activeProgram) return;

    // Record enrollment
    storageService.addEnrollment({
      id: `enr-${Date.now()}`,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      programId: activeProgram.id,
      programTitle: activeProgram.title,
      programCategory: activeProgram.category,
      amount: activeProgram.price,
      paymentStatus: activeProgram.price === 0 ? 'free_intro' : 'paid',
      paymentReference: `SIM-PRANA-${Math.floor(100000 + Math.random() * 900000)}`,
      enrolledAt: new Date().toISOString(),
      status: 'active'
    });

    // Also record simulated payment
    storageService.addPayment({
      id: `pay-${Date.now()}`,
      userId: currentUser.uid,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      itemType: 'program',
      itemId: activeProgram.id,
      itemTitle: activeProgram.title,
      amount: activeProgram.price,
      currency: 'INR',
      transactionRef: `SIM-${Date.now()}`,
      paymentMethod: 'simulated',
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    setEnrollModalOpen(false);
    onShowToast(
      isBengali 
        ? `অভিনন্দন! আপনি "${activeProgram.titleBn || activeProgram.title}" প্রোগ্রামে সফলভাবে যুক্ত হয়েছেন।`
        : `Success! You have enrolled in "${activeProgram.title}".`,
      'success'
    );
    navigate('/member/programs');
  };

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {t.programs.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#153D32] font-semibold leading-tight">
          {t.programs.title}
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-light">
          {t.programs.subtitle}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat.key
                ? 'bg-[#153D32] text-[#F8F6F0] shadow-sm font-semibold'
                : 'bg-white text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            className="rounded-2xl bg-white border border-[#A8BDA5]/30 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-60 overflow-hidden">
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
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#C6A66A] text-[#153D32] shadow-sm">
                    {settings.currencySymbol}{program.price}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
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

                <div className="pt-2 flex items-start gap-2 text-xs text-stone-600">
                  <Users className="w-3.5 h-3.5 text-[#C6A66A] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    <strong className="text-stone-800">{isBengali ? 'উপযোগী: ' : 'Audience: '}</strong>
                    {isBengali && program.audienceBn ? program.audienceBn : program.audience}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-[#A8BDA5]/20 mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => handleViewDetails(program)}
                className="text-xs font-semibold text-stone-700 hover:text-[#153D32] py-2 transition-colors"
              >
                {t.programs.viewDetails}
              </button>
              <button
                onClick={() => handleRegister(program)}
                className="px-4 py-2 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold shadow-xs transition-colors"
              >
                {t.programs.registerNow}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Program Details Modal */}
      {activeProgram && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={isBengali && activeProgram.titleBn ? activeProgram.titleBn : activeProgram.title}
          maxWidth="xl"
        >
          <div className="space-y-6 text-sm text-[#252A27]">
            <div className="h-56 rounded-xl overflow-hidden relative">
              <img
                src={activeProgram.imageUrl}
                alt={activeProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#153D32] text-white text-xs font-bold rounded-lg">
                {settings.currencySymbol}{activeProgram.price}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-[#E7EFE6] text-xs">
              <div>
                <span className="text-stone-500 block">{t.programs.duration}:</span>
                <span className="font-semibold text-[#153D32]">
                  {isBengali && activeProgram.durationBn ? activeProgram.durationBn : activeProgram.duration}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">{t.programs.audience}:</span>
                <span className="font-semibold text-[#153D32]">
                  {isBengali && activeProgram.audienceBn ? activeProgram.audienceBn : activeProgram.audience}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold text-[#153D32] mb-2">
                {isBengali ? 'প্রোগ্রাম সম্পর্কে' : 'About This Program'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                {isBengali && activeProgram.descriptionBn ? activeProgram.descriptionBn : activeProgram.description}
              </p>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold text-[#153D32] mb-2">
                {t.programs.includes}
              </h4>
              <div className="space-y-2">
                {(isBengali && activeProgram.featuresBn ? activeProgram.featuresBn : activeProgram.features).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle className="w-4 h-4 text-[#153D32] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-normal">
              {t.programs.disclaimer}
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#A8BDA5]/20">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                {t.common.close}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetailModalOpen(false);
                  setEnrollModalOpen(true);
                }}
                className="px-6 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold shadow-xs"
              >
                {t.programs.registerNow}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Program Registration Checkout Modal */}
      {activeProgram && (
        <Modal
          isOpen={enrollModalOpen}
          onClose={() => setEnrollModalOpen(false)}
          title={isBengali ? 'প্রোগ্রাম নিবন্ধন ও চেকআউট' : 'Program Registration Checkout'}
          maxWidth="md"
        >
          <div className="space-y-5 text-sm text-[#252A27]">
            <div className="p-4 rounded-xl bg-[#E7EFE6] border border-[#A8BDA5]/30 space-y-2">
              <h4 className="font-serif text-base font-semibold text-[#153D32]">
                {isBengali && activeProgram.titleBn ? activeProgram.titleBn : activeProgram.title}
              </h4>
              <div className="flex justify-between items-center text-xs text-stone-600 pt-1 border-t border-[#A8BDA5]/20">
                <span>{t.programs.price}:</span>
                <span className="text-base font-bold text-[#153D32]">
                  {settings.currencySymbol}{activeProgram.price}
                </span>
              </div>
            </div>

            {currentUser ? (
              <div className="p-3 rounded-xl bg-white border border-[#A8BDA5]/25 space-y-1 text-xs">
                <p className="text-stone-500">{isBengali ? 'নিবন্ধনকারী সদস্য:' : 'Enrolling Member:'}</p>
                <p className="font-semibold text-[#153D32]">{currentUser.fullName}</p>
                <p className="text-stone-600">{currentUser.email}</p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {isBengali ? 'নিবন্ধন সম্পন্ন করতে প্রথমে লগইন বা রেজিস্টার প্রয়োজন।' : 'Please sign in or register to complete enrollment.'}
              </div>
            )}

            <div className="p-3 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#153D32] shrink-0" />
              <span>
                {settings.paymentMode === 'test_simulation'
                  ? (isBengali ? 'সিমুলেটেড সুরক্ষিত পেমেন্ট মোড (কোনো কার্ড চার্জ হবে না)' : 'Instant Secure Test Simulation Mode (No charge)')
                  : 'Razorpay Payment Gateway'}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEnrollModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmEnrollment}
                className="px-5 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold shadow-xs"
              >
                {currentUser ? t.programs.confirmEnrollment : (isBengali ? 'লগইন করে নিবন্ধন করুন' : 'Sign In to Register')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
