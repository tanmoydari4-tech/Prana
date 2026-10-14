import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = '' }) => {
  const { isBengali, t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculate = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-medium ${className}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        {isBengali ? 'সেশন লাইভ বা সমাপ্ত' : 'Live Now / Concluded'}
      </div>
    );
  }

  const formatNum = (num: number) => {
    const str = String(num).padStart(2, '0');
    if (!isBengali) return str;
    const bDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return str.split('').map(c => bDigits[parseInt(c, 10)] ?? c).join('');
  };

  return (
    <div className={`flex items-center gap-2 text-center select-none ${className}`}>
      <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-lg bg-[#153D32] text-[#F8F6F0] shadow-xs">
        <span className="text-sm font-semibold tracking-wider">{formatNum(timeLeft.days)}</span>
        <span className="text-[9px] text-[#A8BDA5] uppercase">{isBengali ? 'দিন' : 'Days'}</span>
      </div>
      <span className="text-[#153D32] font-semibold">:</span>
      <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-lg bg-[#153D32] text-[#F8F6F0] shadow-xs">
        <span className="text-sm font-semibold tracking-wider">{formatNum(timeLeft.hours)}</span>
        <span className="text-[9px] text-[#A8BDA5] uppercase">{isBengali ? 'ঘণ্টা' : 'Hrs'}</span>
      </div>
      <span className="text-[#153D32] font-semibold">:</span>
      <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-lg bg-[#153D32] text-[#F8F6F0] shadow-xs">
        <span className="text-sm font-semibold tracking-wider">{formatNum(timeLeft.minutes)}</span>
        <span className="text-[9px] text-[#A8BDA5] uppercase">{isBengali ? 'মিনিট' : 'Min'}</span>
      </div>
      <span className="text-[#153D32] font-semibold">:</span>
      <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-lg bg-[#153D32] text-[#F8F6F0] shadow-xs">
        <span className="text-sm font-semibold tracking-wider">{formatNum(timeLeft.seconds)}</span>
        <span className="text-[9px] text-[#A8BDA5] uppercase">{isBengali ? 'সেকেন্ড' : 'Sec'}</span>
      </div>
    </div>
  );
};
