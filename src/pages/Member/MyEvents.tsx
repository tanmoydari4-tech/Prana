import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { Calendar, Video, MapPin, ExternalLink, Clock } from 'lucide-react';

interface MyEventsProps {
  navigate: (path: string) => void;
}

export const MyEvents: React.FC<MyEventsProps> = ({ navigate }) => {
  const { isBengali, t } = useLanguage();
  const { currentUser } = useAuth();

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

  const registrations = storageService.getEventRegistrations(currentUser.uid);
  const allEvents = storageService.getEvents();
  const myEvents = allEvents.filter(e => registrations.some(r => r.eventId === e.id));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase">
            {isBengali ? 'আমার সেশনসমূহ' : 'MY REGISTERED SESSIONS'}
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#153D32]">
            {isBengali ? 'আসন্ন লাইভ ক্লাস ও ইভেন্ট' : 'Upcoming Live Gatherings & Circles'}
          </h1>
        </div>

        <button
          onClick={() => navigate('/events')}
          className="px-5 py-2.5 rounded-full bg-[#153D32] text-[#F8F6F0] text-xs font-semibold hover:bg-[#0E2922] transition-colors self-start sm:self-auto"
        >
          {isBengali ? '+ নতুন সেশনে যোগ দিন' : '+ Browse More Sessions'}
        </button>
      </div>

      {myEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#A8BDA5]/30 space-y-4">
          <Calendar className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-serif text-xl font-medium text-[#153D32]">
            {isBengali ? 'কোনো নিবন্ধিত ইভেন্ট নেই' : 'No Upcoming Registered Events'}
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {isBengali 
              ? 'সকালের স্ট্রেচিং, সন্ধ্যার মেডিটেশন বা পুষ্টি কর্মশালায় আসন সংরক্ষণ করুন।'
              : 'Reserve your seat for upcoming live breathing circles and weekend community walks.'}
          </p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-2.5 rounded-full bg-[#153D32] text-white text-xs font-semibold"
          >
            {isBengali ? 'ইভেন্ট ক্যালেন্ডার দেখুন' : 'Explore Event Calendar'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E7EFE6] text-[#153D32] font-semibold text-[11px]">
                    {ev.formatBn || ev.format}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#153D32]" />
                    <span>{new Date(ev.startAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#153D32]">
                  {isBengali && ev.titleBn ? ev.titleBn : ev.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2">
                  {isBengali && ev.descriptionBn ? ev.descriptionBn : ev.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#A8BDA5]/20">
                {ev.format === 'online' && ev.meetingUrl ? (
                  <div className="space-y-2">
                    <span className="text-[11px] text-emerald-800 font-semibold block">
                      {isBengali ? 'অনলাইন লাইভ লিংক:' : 'Online Video Link:'}
                    </span>
                    <a
                      href={ev.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      <span>{t.events.joinMeeting}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-stone-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C6A66A] shrink-0" />
                    <span>{ev.venue || 'Outdoor Park Sanctuary'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
