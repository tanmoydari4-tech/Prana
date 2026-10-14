import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { HabitLog, WellnessEvent, ProgramEnrollment } from '../../types';
import { Modal } from '../../components/common/Modal';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Footprints, 
  Apple, 
  Moon, 
  Sparkles, 
  Droplet, 
  Calendar, 
  Video, 
  ExternalLink, 
  MessageSquare, 
  ArrowRight, 
  Target, 
  Flame, 
  Send,
  BookOpen
} from 'lucide-react';

interface MemberDashboardProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ navigate, onShowToast }) => {
  const { t, isBengali } = useLanguage();
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-serif text-2xl text-[#153D32]">
          {isBengali ? 'লগইন প্রয়োজন' : 'Authentication Required'}
        </h2>
        <p className="text-xs text-stone-600">
          {isBengali ? 'ড্যাশবোর্ড দেখতে অনুগ্রহ করে লগইন করুন।' : 'Please sign in to access your personal dashboard.'}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-full bg-[#153D32] text-white text-xs font-semibold"
        >
          {t.nav.login}
        </button>
      </div>
    );
  }

  const [todayHabit, setTodayHabit] = useState<HabitLog>(() => 
    storageService.getTodayHabitLog(currentUser.uid)
  );
  const [coachModalOpen, setCoachModalOpen] = useState(false);
  const [coachMessage, setCoachMessage] = useState('');
  const [announcements] = useState(() => storageService.getAnnouncements());
  
  const enrollments = storageService.getEnrollments(currentUser.uid);
  const userEventRegistrations = storageService.getEventRegistrations(currentUser.uid);
  const allEvents = storageService.getEvents();
  const registeredEvents = allEvents.filter(e => 
    userEventRegistrations.some(r => r.eventId === e.id)
  );

  // Toggle single habit
  const handleToggleHabit = (key: keyof HabitLog) => {
    const updated = {
      ...todayHabit,
      [key]: !todayHabit[key],
      updatedAt: new Date().toISOString()
    };
    setTodayHabit(updated);
    storageService.saveHabitLog(updated);

    // If turned true, trigger gentle celebration confetti
    if (!todayHabit[key]) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#A8BDA5', '#C6A66A', '#153D32']
      });
      onShowToast(
        isBengali ? 'অসাধারণ! ছোট অভ্যাসে সুস্থতার দিকে আরেকটি পদক্ষেপ।' : 'Wonderful! Another small step toward daily vitality.',
        'success'
      );
    }
  };

  const completedCount = [
    todayHabit.walkCompleted,
    todayHabit.routineFollowed,
    todayHabit.mindfulnessDone,
    todayHabit.sleepScheduleFollowed,
    todayHabit.hydrationGoalMet,
  ].filter(Boolean).length;

  const handleSendCoachNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachMessage.trim()) return;

    // Record as enquiry for admin
    storageService.addEnquiry({
      id: `enq-${Date.now()}`,
      fullName: currentUser.fullName,
      email: currentUser.email,
      mobile: currentUser.mobile,
      category: 'consultation',
      message: `[Member Dashboard Note from ${currentUser.fullName}]: ${coachMessage}`,
      privacyAgreed: true,
      status: 'unread',
      createdAt: new Date().toISOString()
    });

    setCoachModalOpen(false);
    setCoachMessage('');
    onShowToast(
      isBengali ? 'আপনার বার্তাটি মেন্টরের কাছে পাঠানো হয়েছে। ধন্যবাদ!' : 'Your message has been dispatched to your wellness mentor.',
      'success'
    );
  };

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Member Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-r from-[#153D32] to-[#1D5344] text-[#F8F6F0] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#C6A66A]/30">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold tracking-widest text-[#C6A66A] uppercase">
            {isBengali ? 'ব্যক্তিগত ওয়েলনেস ড্যাশবোর্ড' : 'MEMBER SANCTUARY'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FDFAF5]">
            {t.dashboard.welcome} {currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-[#A8BDA5] max-w-xl">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCoachModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#C6A66A] hover:bg-[#d8b87a] text-[#153D32] text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.dashboard.contactCoach}</span>
          </button>
          <button
            onClick={() => navigate('/member/profile')}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#F8F6F0] text-xs font-medium transition-colors"
          >
            {t.nav.profile}
          </button>
        </div>
      </div>

      {/* 2. Announcements Ticker if available */}
      {announcements.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#E7EFE6] border border-[#A8BDA5]/40 flex items-start gap-3 text-xs text-[#153D32]">
          <Sparkles className="w-4 h-4 text-[#C6A66A] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">
              {isBengali && announcements[0].titleBn ? announcements[0].titleBn : announcements[0].title}
            </span>
            <p className="text-stone-700">
              {isBengali && announcements[0].contentBn ? announcements[0].contentBn : announcements[0].content}
            </p>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Grid (Habit Checklist + Goals & Consistency) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Daily Habit Checklist (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#A8BDA5]/20 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
                {t.dashboard.habitToday}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {t.dashboard.habitSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E7EFE6] text-[#153D32] text-xs font-bold">
              <Flame className="w-4 h-4 text-[#C6A66A]" />
              <span>{completedCount}/5</span>
            </div>
          </div>

          {/* Interactive Habit List */}
          <div className="space-y-3">
            {/* Habit 1: Gentle Walk */}
            <div
              onClick={() => handleToggleHabit('walkCompleted')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                todayHabit.walkCompleted
                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                  : 'bg-[#F8F6F0]/60 hover:bg-[#F8F6F0] border-[#A8BDA5]/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl ${todayHabit.walkCompleted ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold ${todayHabit.walkCompleted ? 'text-emerald-900 line-through' : 'text-stone-800'}`}>
                    {t.dashboard.habits.walk}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {isBengali ? 'খাবারের পর হালকা ২০ মিনিট হাঁটা' : 'Light post-meal fresh air walk'}
                  </p>
                </div>
              </div>
              <div>
                {todayHabit.walkCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300" />
                )}
              </div>
            </div>

            {/* Habit 2: Healthy Meal Routine */}
            <div
              onClick={() => handleToggleHabit('routineFollowed')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                todayHabit.routineFollowed
                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                  : 'bg-[#F8F6F0]/60 hover:bg-[#F8F6F0] border-[#A8BDA5]/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl ${todayHabit.routineFollowed ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  <Apple className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold ${todayHabit.routineFollowed ? 'text-emerald-900 line-through' : 'text-stone-800'}`}>
                    {t.dashboard.habits.routine}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {isBengali ? 'থালায় রঙিন সবজি ও ফল রাখা' : 'Colorful wholesome seasonal plate'}
                  </p>
                </div>
              </div>
              <div>
                {todayHabit.routineFollowed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300" />
                )}
              </div>
            </div>

            {/* Habit 3: Mindfulness & Breathwork */}
            <div
              onClick={() => handleToggleHabit('mindfulnessDone')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                todayHabit.mindfulnessDone
                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                  : 'bg-[#F8F6F0]/60 hover:bg-[#F8F6F0] border-[#A8BDA5]/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl ${todayHabit.mindfulnessDone ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold ${todayHabit.mindfulnessDone ? 'text-emerald-900 line-through' : 'text-stone-800'}`}>
                    {t.dashboard.habits.mindfulness}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {isBengali ? 'সকাল বা সন্ধ্যার ৫-১০ মিনিট গভীর শ্বাস' : '5-10 min diaphragmatic calm breath'}
                  </p>
                </div>
              </div>
              <div>
                {todayHabit.mindfulnessDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300" />
                )}
              </div>
            </div>

            {/* Habit 4: Sleep Wind-Down */}
            <div
              onClick={() => handleToggleHabit('sleepScheduleFollowed')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                todayHabit.sleepScheduleFollowed
                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                  : 'bg-[#F8F6F0]/60 hover:bg-[#F8F6F0] border-[#A8BDA5]/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl ${todayHabit.sleepScheduleFollowed ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold ${todayHabit.sleepScheduleFollowed ? 'text-emerald-900 line-through' : 'text-stone-800'}`}>
                    {t.dashboard.habits.sleep}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {isBengali ? 'ঘুমের ১ ঘণ্টা আগে মোবাইল স্ক্রিনমুক্ত থাকা' : 'Screen-free restful evening wind-down'}
                  </p>
                </div>
              </div>
              <div>
                {todayHabit.sleepScheduleFollowed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300" />
                )}
              </div>
            </div>

            {/* Habit 5: Hydration */}
            <div
              onClick={() => handleToggleHabit('hydrationGoalMet')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                todayHabit.hydrationGoalMet
                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                  : 'bg-[#F8F6F0]/60 hover:bg-[#F8F6F0] border-[#A8BDA5]/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl ${todayHabit.hydrationGoalMet ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold ${todayHabit.hydrationGoalMet ? 'text-emerald-900 line-through' : 'text-stone-800'}`}>
                    {t.dashboard.habits.hydration}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {isBengali ? 'পর্যাপ্ত পানি ও ভেষজ তরল গ্রহণ' : 'Regular water and warm herbal infusions'}
                  </p>
                </div>
              </div>
              <div>
                {todayHabit.hydrationGoalMet ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-300" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Goals & Consistency Chart (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Wellness Goals Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#C6A66A]" />
              <h3 className="font-serif text-lg font-semibold text-[#153D32]">
                {t.dashboard.quickGoals}
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic bg-[#F8F6F0] p-3 rounded-xl border border-[#A8BDA5]/20">
              "{currentUser.wellnessGoals || (isBengali ? 'নিয়মিত সকালের মৃদু স্ট্রেচিং এবং পর্যাপ্ত পানি পানের অভ্যাস বজায় রাখা।' : 'Establish a calm morning mobility routine and drink water with mindfulness.')}"
            </p>
            <button
              onClick={() => navigate('/member/profile')}
              className="text-xs text-[#153D32] font-semibold hover:underline"
            >
              {isBengali ? 'লক্ষ্য সম্পাদনা করুন →' : 'Edit Personal Wellness Goals →'}
            </button>
          </div>

          {/* 7-Day Consistency Tracker */}
          <div className="p-6 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-semibold text-[#153D32]">
                {t.dashboard.weeklyOverview}
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {t.dashboard.streak}: 4 {t.dashboard.days}
              </span>
            </div>

            {/* 7-Day Dots Simulation */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                const isComplete = idx <= 4;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] text-stone-400 font-semibold">{day}</span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] transition-colors ${
                        isComplete
                          ? 'bg-[#153D32] text-[#F8F6F0]'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {isComplete ? '✓' : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Enrolled Programs / Events Teaser */}
          <div className="p-6 rounded-3xl bg-[#E7EFE6] border border-[#A8BDA5]/30 space-y-3">
            <h3 className="font-serif text-lg font-semibold text-[#153D32]">
              {t.dashboard.myEvents}
            </h3>
            {registeredEvents.length === 0 ? (
              <p className="text-xs text-stone-600">
                {isBengali ? 'এখনো কোনো সেশনে নিবন্ধন করেননি।' : 'You have not registered for any upcoming sessions.'}
              </p>
            ) : (
              <div className="space-y-2">
                {registeredEvents.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="p-3 bg-white rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-[#153D32] block">
                      {isBengali && ev.titleBn ? ev.titleBn : ev.title}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {new Date(ev.startAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    {ev.meetingUrl && (
                      <a
                        href={ev.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 pt-0.5"
                      >
                        <Video className="w-3 h-3" />
                        <span>{t.events.joinMeeting}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/member/events')}
              className="text-xs font-semibold text-[#153D32] hover:underline block pt-1"
            >
              {isBengali ? 'সকল সেশন দেখুন →' : 'View all my sessions →'}
            </button>
          </div>
        </div>
      </div>

      {/* Ask Coach Modal */}
      <Modal
        isOpen={coachModalOpen}
        onClose={() => setCoachModalOpen(false)}
        title={t.dashboard.coachModalTitle}
        maxWidth="md"
      >
        <form onSubmit={handleSendCoachNote} className="space-y-4 text-xs">
          <p className="text-stone-600 leading-relaxed">
            {t.dashboard.coachModalText}
          </p>
          <div>
            <label className="font-medium text-stone-700 block mb-1">
              {isBengali ? 'আপনার প্রশ্ন বা বার্তা' : 'Your Note / Question'}
            </label>
            <textarea
              required
              rows={4}
              value={coachMessage}
              onChange={(e) => setCoachMessage(e.target.value)}
              placeholder={isBengali ? 'যেমন: সকালের হাঁটার পর কী ধরণের হালকা খাবার খেলে সারাদিন সতেজ থাকা যায়?' : 'e.g. Guidance on balancing work stress and keeping up with the 20-min evening walk routine...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
            />
          </div>
          <div className="pt-2 flex justify-end gap-3 border-t border-[#A8BDA5]/20">
            <button
              type="button"
              onClick={() => setCoachModalOpen(false)}
              className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.dashboard.sendMessage}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
