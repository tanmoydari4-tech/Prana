import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { Sparkles, ArrowRight, CheckCircle2, Clock, BookOpen } from 'lucide-react';

interface MyProgramsProps {
  navigate: (path: string) => void;
}

export const MyPrograms: React.FC<MyProgramsProps> = ({ navigate }) => {
  const { isBengali, t } = useLanguage();
  const { currentUser } = useAuth();
  const settings = storageService.getSettings();

  if (!currentUser) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-serif text-2xl text-[#153D32]">{isBengali ? 'লগইন প্রয়োজন' : 'Sign in Required'}</h2>
        <button onClick={() => navigate('/login')} className="px-6 py-2.5 rounded-full bg-[#153D32] text-white text-xs font-semibold">
          {t.nav.login}
        </button>
      </div>
    );
  }

  const enrollments = storageService.getEnrollments(currentUser.uid);
  const allPrograms = storageService.getPrograms();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase">
            {isBengali ? 'আমার তালিকা' : 'MY ACTIVE PROGRAMS'}
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#153D32]">
            {isBengali ? 'আমার নিবন্ধিত ওয়েলনেস কোর্স' : 'Enrolled Wellness Programs'}
          </h1>
        </div>

        <button
          onClick={() => navigate('/programs')}
          className="px-5 py-2.5 rounded-full bg-[#153D32] text-[#F8F6F0] text-xs font-semibold hover:bg-[#0E2922] transition-colors self-start sm:self-auto"
        >
          {isBengali ? '+ নতুন প্রোগ্রামে যোগ দিন' : '+ Explore More Programs'}
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#A8BDA5]/30 space-y-4">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-serif text-xl font-medium text-[#153D32]">
            {isBengali ? 'আপনি এখনো কোনো প্রোগ্রামে নিবন্ধিত হননি।' : 'No active program enrollments yet.'}
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {isBengali 
              ? 'আমাদের সকালের সেশন, পুষ্টি শিক্ষা বা জীবনধারা কোচিং প্রোগ্রামে যুক্ত হয়ে আপনার সুস্থ যাত্রা শুরু করুন।'
              : 'Browse our nourishing programs and begin your journey toward sustainable lifestyle balance.'}
          </p>
          <button
            onClick={() => navigate('/programs')}
            className="px-6 py-2.5 rounded-full bg-[#153D32] text-white text-xs font-semibold"
          >
            {t.programs.badge}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enr) => {
            const prog = allPrograms.find(p => p.id === enr.programId);
            return (
              <div
                key={enr.id}
                className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E7EFE6] text-[#153D32] uppercase">
                      {enr.status}
                    </span>
                    <span className="text-xs text-stone-500">
                      {isBengali ? 'নিবন্ধন তারিখ:' : 'Enrolled:'} {new Date(enr.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#153D32]">
                    {prog ? (isBengali && prog.titleBn ? prog.titleBn : prog.title) : enr.programTitle}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-stone-600">
                    <span>
                      <strong>{isBengali ? 'পেমেন্ট স্ট্যাটাস:' : 'Payment:'}</strong>{' '}
                      <span className="text-emerald-700 font-semibold">{enr.paymentStatus.toUpperCase()}</span>
                    </span>
                    {enr.paymentReference && (
                      <span className="font-mono text-stone-400 text-[11px]">Ref: {enr.paymentReference}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold hover:bg-[#0E2922]"
                  >
                    {isBengali ? 'ড্যাশবোর্ডে ট্র্যাক করুন' : 'Track in Dashboard'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
