import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { WellnessEvent } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { Modal } from '../components/common/Modal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Users, 
  CheckCircle, 
  ExternalLink, 
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface EventsProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const Events: React.FC<EventsProps> = ({ navigate, onShowToast }) => {
  const { t, isBengali } = useLanguage();
  const { currentUser } = useAuth();
  const settings = storageService.getSettings();
  const allEvents = storageService.getEvents();
  const userRegistrations = storageService.getEventRegistrations(currentUser?.uid);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'past' | 'calendar' | 'myEvents'>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<WellnessEvent | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const isUserRegistered = (eventId: string) => {
    return userRegistrations.some(r => r.eventId === eventId);
  };

  const getFilteredEvents = () => {
    const now = new Date().getTime();
    switch (activeTab) {
      case 'upcoming':
        return allEvents.filter(e => e.status === 'upcoming');
      case 'live':
        return allEvents.filter(e => e.status === 'live' || (new Date(e.startAt).getTime() <= now && new Date(e.endAt).getTime() >= now));
      case 'past':
        return allEvents.filter(e => e.status === 'completed' || new Date(e.endAt).getTime() < now);
      case 'myEvents':
        const myIds = new Set(userRegistrations.map(r => r.eventId));
        return allEvents.filter(e => myIds.has(e.id));
      case 'calendar':
      default:
        return allEvents;
    }
  };

  const filteredEvents = getFilteredEvents();

  const handleOpenRegister = (event: WellnessEvent) => {
    setSelectedEvent(event);
    setRegisterModalOpen(true);
  };

  const handleConfirmRegistration = () => {
    if (!currentUser) {
      setRegisterModalOpen(false);
      onShowToast(isBengali ? 'ইভেন্টে নিবন্ধন করতে অনুগ্রহ করে প্রথমে লগইন করুন।' : 'Please sign in or register to RSVP for this event.', 'info');
      navigate('/login');
      return;
    }
    if (!selectedEvent) return;

    storageService.addEventRegistration({
      id: `reg-${Date.now()}`,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      registeredAt: new Date().toISOString()
    });

    setRegisterModalOpen(false);
    onShowToast(
      isBengali 
        ? `অভিনন্দন! "${selectedEvent.titleBn || selectedEvent.title}" সেশনের জন্য আপনার আসন নিশ্চিত হয়েছে।` 
        : `Your seat has been reserved for "${selectedEvent.title}"!`,
      'success'
    );
  };

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {t.events.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#153D32] font-semibold leading-tight">
          {t.events.title}
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-light">
          {t.events.subtitle}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 border-b border-[#A8BDA5]/20 pb-4">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#153D32] text-[#F8F6F0] font-semibold shadow-xs'
              : 'bg-white text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
          }`}
        >
          {t.events.tabs.upcoming}
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'live'
              ? 'bg-[#153D32] text-[#F8F6F0] font-semibold shadow-xs'
              : 'bg-white text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
          }`}
        >
          {t.events.tabs.live}
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'calendar'
              ? 'bg-[#153D32] text-[#F8F6F0] font-semibold shadow-xs'
              : 'bg-white text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
          }`}
        >
          {t.events.tabs.calendar}
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'past'
              ? 'bg-[#153D32] text-[#F8F6F0] font-semibold shadow-xs'
              : 'bg-white text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
          }`}
        >
          {t.events.tabs.past}
        </button>

        {currentUser && (
          <button
            onClick={() => setActiveTab('myEvents')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === 'myEvents'
                ? 'bg-[#C6A66A] text-[#153D32] font-bold shadow-xs'
                : 'bg-white text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
            }`}
          >
            {t.events.tabs.myEvents} ({userRegistrations.length})
          </button>
        )}
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#A8BDA5]/30 max-w-md mx-auto space-y-4">
          <Calendar className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-serif text-xl font-medium text-[#153D32]">
            {isBengali ? 'এই বিভাগে কোনো ইভেন্ট নেই' : 'No Events Found in This View'}
          </h3>
          <p className="text-xs text-stone-500">
            {t.events.emptyUpcoming}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEvents.map((event) => {
            const registered = isUserRegistered(event.id);
            const isUpcoming = event.status === 'upcoming';
            const seatsRemaining = Math.max(0, event.capacity - event.registeredCount);

            return (
              <div
                key={event.id}
                className="rounded-3xl bg-white border border-[#A8BDA5]/30 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#153D32]/90 text-[#F8F6F0] backdrop-blur-xs flex items-center gap-1.5">
                        {event.format === 'online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                        <span>{event.formatBn || (event.format === 'online' ? 'Online Video' : 'In-Person Park')}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4">
                      {event.price === 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A8BDA5] text-[#153D32] shadow-sm">
                          {isBengali ? 'বিনামূল্যে অংশ নিন' : 'Free Session'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C6A66A] text-[#153D32] shadow-sm">
                          {settings.currencySymbol}{event.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    {/* Countdown for upcoming events */}
                    {isUpcoming && (
                      <div className="p-3 rounded-xl bg-[#F8F6F0] border border-[#A8BDA5]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#153D32]">
                          {t.events.countdownLabel}:
                        </span>
                        <CountdownTimer targetDate={event.startAt} />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#153D32]" />
                          <span>{new Date(event.startAt).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#153D32]" />
                          <span>{new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({event.timezone})</span>
                        </div>
                      </div>

                      <h3 className="font-serif text-2xl font-semibold text-[#153D32] leading-snug">
                        {isBengali && event.titleBn ? event.titleBn : event.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {isBengali && event.descriptionBn ? event.descriptionBn : event.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#A8BDA5]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#153D32]" />
                        <span><strong>{t.events.host}:</strong> {event.hostName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#C6A66A]" />
                        <span>{seatsRemaining} {t.events.seatsLeft}</span>
                      </div>
                    </div>

                    {/* Authorized Meeting Link Reveal (Only visible if registered) */}
                    {registered && event.format === 'online' && event.meetingUrl && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>{isBengali ? 'আপনার আসন নিশ্চিত! সরাসরি ক্লাসে যুক্ত হতে:' : 'Seat Reserved! Your Live Link:'}</span>
                        </div>
                        <a
                          href={event.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-700 hover:underline flex items-center gap-1 break-all font-mono"
                        >
                          <span>{event.meetingUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 border-t border-[#A8BDA5]/20 mt-4 flex items-center justify-between gap-4">
                  <div className="text-xs text-stone-500">
                    {registered ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        {t.events.registered}
                      </span>
                    ) : seatsRemaining <= 0 ? (
                      <span className="text-rose-600 font-semibold">{t.events.seatsFull}</span>
                    ) : (
                      <span>{isBengali ? 'সীমিত আসন' : 'Limited Seats'}</span>
                    )}
                  </div>

                  {registered ? (
                    <button
                      disabled
                      className="px-5 py-2.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold cursor-default"
                    >
                      {t.events.registered}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenRegister(event)}
                      disabled={seatsRemaining <= 0 || event.status === 'completed'}
                      className="px-6 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] disabled:bg-stone-300 disabled:cursor-not-allowed text-[#F8F6F0] text-xs font-semibold shadow-xs transition-colors"
                    >
                      {t.events.registerEvent}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event RSVP Modal */}
      {selectedEvent && (
        <Modal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          title={isBengali ? 'সেশনে আসন সংরক্ষণ' : 'Reserve Session Seat'}
          maxWidth="md"
        >
          <div className="space-y-4 text-sm text-[#252A27]">
            <div className="p-4 rounded-xl bg-[#E7EFE6] border border-[#A8BDA5]/30 space-y-2">
              <h4 className="font-serif text-base font-semibold text-[#153D32]">
                {isBengali && selectedEvent.titleBn ? selectedEvent.titleBn : selectedEvent.title}
              </h4>
              <p className="text-xs text-stone-600">
                {new Date(selectedEvent.startAt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
              </p>
              <div className="flex justify-between items-center text-xs font-semibold text-[#153D32] pt-1">
                <span>{selectedEvent.formatBn || selectedEvent.format}</span>
                <span>{selectedEvent.price === 0 ? (isBengali ? 'বিনামূল্যে' : 'Free') : `${settings.currencySymbol}${selectedEvent.price}`}</span>
              </div>
            </div>

            {currentUser ? (
              <div className="p-3 rounded-xl bg-white border border-[#A8BDA5]/25 text-xs space-y-1">
                <span className="text-stone-500">{isBengali ? 'নিবন্ধনকারী সদস্য:' : 'Member Name:'}</span>
                <p className="font-semibold text-[#153D32]">{currentUser.fullName} ({currentUser.email})</p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {isBengali ? 'আসন সংরক্ষণ করতে অনুগ্রহ করে লগইন করুন।' : 'Please sign in to register your seat.'}
              </div>
            )}

            <p className="text-xs text-stone-500 leading-relaxed">
              {t.events.meetingLinkNotice}
            </p>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#A8BDA5]/20">
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmRegistration}
                className="px-5 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold shadow-xs"
              >
                {currentUser ? (isBengali ? 'আসন নিশ্চিত করুন' : 'Confirm RSVP') : (isBengali ? 'লগইন করুন' : 'Sign In')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
