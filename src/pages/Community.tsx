import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { Testimonial } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/common/Modal';
import { 
  Heart, 
  Users, 
  Award, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Star,
  Send
} from 'lucide-react';

interface CommunityProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const Community: React.FC<CommunityProps> = ({ navigate, onShowToast }) => {
  const { t, isBengali } = useLanguage();
  const { currentUser } = useAuth();
  const testimonials = storageService.getTestimonials(true);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form State
  const [authorName, setAuthorName] = useState(currentUser?.fullName || '');
  const [authorLocation, setAuthorLocation] = useState('');
  const [programTaken, setProgramTaken] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    {
      q: isBengali ? 'প্রাণ ওয়েলনেস কি কোনো সাধারণ জিম?' : 'Is Prāna Wellness a gym?',
      a: isBengali 
        ? 'না, একেবারেই নয়। আমরা কোনো জিম নই এবং আমাদের কার্যক্রমে কোনো ভারী সরঞ্জাম, ডাম্বেল বা বডিবিল্ডিংয়ের সংস্কৃতি নেই। আমরা মনোনিবেশ করি স্বাস্থ্যকর দৈনন্দিন অভ্যাস, পুষ্টিকর খাবার, সকালের স্নিগ্ধ হাঁটা ও স্ট্রেচিং এবং মানসিক শান্তির ওপর।'
        : 'No, absolutely not. Prāna Wellness is a lifestyle and nourishment community. We do not use gym equipment, treadmills, or aggressive bodybuilding regimens. Our entire methodology is centered on daily micro-habits, balanced wholesome nutrition, gentle walking, and mindfulness.'
    },
    {
      q: isBengali ? 'আমি কি ঘরে বসেই সকাল ও সন্ধ্যার সেশনে যোগ দিতে পারি?' : 'Can I join morning and evening sessions from home?',
      a: isBengali
        ? 'হ্যাঁ! আমাদের অধিকাংশ সেশনই জুম বা গুগল মিটের মাধ্যমে লাইভ অনুষ্ঠিত হয়। আপনি বিছানা বা সাধারণ একটি ম্যাটেই আরামদায়কভাবে যোগ দিতে পারেন।'
        : 'Yes! Our morning breathing circles and evening twilight de-stress sessions are hosted live online via interactive video. You can participate comfortably from your living room without any special gear.'
    },
    {
      q: isBengali ? 'আপনারা কি কোনো কঠিন ডায়েট চার্ট বা সাপ্লিমেন্ট দেন?' : 'Do you prescribe extreme diets or supplements?',
      a: isBengali
        ? 'না। আমরা কোনো অননুমোদিত সাপ্লিমেন্ট বিক্রি করি না এবং কোনো না খেয়ে থাকার ডায়েট সমর্থন করি না। আমরা সাধারণ ঘরোয়া শাকসবজি, ফল ও ডালের মাধ্যমে রঙিন সুষম খাদ্যশিক্ষা প্রদান করি।'
        : 'Never. We strictly avoid extreme restrictive diets, unverified supplements, and false body-transformation promises. We teach sustainable, joyful relationship with seasonal whole foods.'
    },
    {
      q: isBengali ? 'সদস্যপদ ফি কি ফেরতযোগ্য বা পরিবর্তনযোগ্য?' : 'What is your session fee and cancellation policy?',
      a: isBengali
        ? 'আমাদের কমিউনিটি অনেকগুলো উন্মুক্ত সেশন পরিচালনা করে। পেইড কোর্সের ক্ষেত্রে প্রথম সপ্তাহের মধ্যে যেকোনো সময় সন্তুষ্ট না হলে ১০০% ফি ফেরত বা অন্য প্রোগ্রামে স্থানান্তরের সুযোগ রয়েছে।'
        : 'Many community gatherings and challenges are completely free. For structured paid coaching programs, we offer a flexible satisfaction refund within the first 7 days.'
    }
  ];

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || !authorName.trim()) return;

    setSubmitting(true);
    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      authorName: authorName.trim(),
      authorLocation: authorLocation.trim() || (isBengali ? 'কলকাতা' : 'Community Member'),
      avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      quote: quote.trim(),
      quoteBn: isBengali ? quote.trim() : '',
      programTaken: programTaken.trim() || 'Daily Habit Circle',
      rating,
      approved: false, // Requires admin moderation
      isPlaceholder: false,
      createdAt: new Date().toISOString()
    };

    storageService.addTestimonial(newTestimonial);
    setSubmitting(false);
    setShareModalOpen(false);
    setQuote('');

    onShowToast(
      isBengali 
        ? 'আপনার সুন্দর অভিজ্ঞতা জমা দেওয়ার জন্য ধন্যবাদ! অ্যাডমিন পর্যালোচনার পর এটি প্রকাশিত হবে।'
        : 'Thank you for sharing your experience! It will appear after community coordinator review.',
      'success'
    );
  };

  return (
    <div className="space-y-20 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {t.community.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#153D32] font-semibold leading-tight">
          {t.community.title}
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-light">
          {t.community.subtitle}
        </p>
      </div>

      {/* 2. Ongoing Community Habit Challenge Feature Banner */}
      <div className="rounded-3xl bg-linear-to-r from-[#153D32] to-[#1D5344] text-[#F8F6F0] p-8 sm:p-12 shadow-xl border border-[#C6A66A]/30 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A66A]/20 text-[#C6A66A] text-xs font-semibold tracking-wider uppercase">
            <Award className="w-4 h-4" />
            <span>{t.community.habitChallengeTitle}</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-[#FDFAF5]">
            {t.community.habitChallengeName}
          </h2>
          <p className="text-sm text-[#A8BDA5] leading-relaxed">
            {t.community.habitChallengeDesc}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#F8F6F0]/90 pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C6A66A]" />
              {isBengali ? 'কোনো ফি নেই' : '100% Free to Join'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C6A66A]" />
              {isBengali ? 'দৈনিক হোয়াটসঅ্যাপ চেক-ইন' : 'Daily WhatsApp Support'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C6A66A]" />
              {isBengali ? 'সাপ্তাহিক ব্যাজ' : 'Consistency Badge'}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => {
              if (!currentUser) {
                onShowToast(isBengali ? 'চ্যালেঞ্জে অংশ নিতে অনুগ্রহ করে লগইন করুন।' : 'Please sign in to join this challenge.', 'info');
                navigate('/login');
              } else {
                onShowToast(isBengali ? 'অভিনন্দন! আপনি ২১ দিনের সুস্থ অভ্যাস চ্যালেঞ্জে যুক্ত হয়েছেন।' : 'Welcome! You have joined the 21-Day Habit Challenge.', 'success');
                navigate('/dashboard');
              }
            }}
            className="px-8 py-3.5 rounded-full bg-[#C6A66A] hover:bg-[#d8b87a] text-[#153D32] font-semibold text-sm shadow-md transition-all transform hover:scale-105"
          >
            {t.community.joinChallenge}
          </button>
        </div>
      </div>

      {/* 3. Member Stories & Testimonials Grid */}
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-[#153D32] font-semibold">
              {t.community.memberStories}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {isBengali ? 'বাস্তব সদস্যদের আন্তরিক অভিজ্ঞতা ও রূপান্তর' : 'Honest reflections from community members'}
            </p>
          </div>

          <button
            onClick={() => {
              if (!currentUser) {
                onShowToast(isBengali ? 'আপনার অনুভূতি শেয়ার করতে প্রথমে লগইন করুন।' : 'Please sign in to share your reflection.', 'info');
                navigate('/login');
              } else {
                setShareModalOpen(true);
              }
            }}
            className="px-5 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] text-xs font-semibold shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <MessageSquare className="w-4 h-4 text-[#C6A66A]" />
            <span>{t.community.shareYourStory}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-8 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#C6A66A]">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{isBengali && test.quoteBn ? test.quoteBn : test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#A8BDA5]/20">
                <img
                  src={test.avatarUrl}
                  alt={test.authorName}
                  className="w-11 h-11 rounded-full object-cover border border-[#A8BDA5]/40"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#153D32]">{test.authorName}</h4>
                  <p className="text-xs text-stone-500">{test.authorLocation}</p>
                  <p className="text-[10px] text-[#C6A66A] font-semibold mt-0.5">{test.programTaken}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Frequently Asked Questions Accordion */}
      <div className="space-y-8 max-w-4xl mx-auto pt-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#153D32] uppercase">
            <HelpCircle className="w-4 h-4 text-[#C6A66A]" />
            <span>{t.community.faqTitle}</span>
          </div>
          <h2 className="font-serif text-3xl text-[#153D32] font-semibold">
            {isBengali ? 'সাধারণ জিজ্ঞাসা ও উত্তর' : 'Common Questions About Prāna Living'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#A8BDA5]/30 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-medium text-[#153D32] hover:bg-[#F8F6F0] transition-colors"
                >
                  <span className="font-serif font-semibold">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#C6A66A]" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#A8BDA5]/10 bg-[#FDFAF5]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Testimonial Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={t.community.shareYourStory}
        maxWidth="md"
      >
        <form onSubmit={handleShareSubmit} className="space-y-4 text-xs">
          <p className="text-stone-500 leading-relaxed">
            {t.community.shareNotice}
          </p>

          <div>
            <label className="font-medium text-stone-700 block mb-1">
              {isBengali ? 'আপনার পুরো নাম' : 'Your Full Name'}
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-stone-700 block mb-1">
                {isBengali ? 'শহর / এলাকা' : 'Location / City'}
              </label>
              <input
                type="text"
                placeholder={isBengali ? 'যেমন: কলকাতা' : 'e.g. Kolkata'}
                value={authorLocation}
                onChange={(e) => setAuthorLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
            </div>
            <div>
              <label className="font-medium text-stone-700 block mb-1">
                {isBengali ? 'প্রোগ্রাম / সেশন' : 'Program / Session'}
              </label>
              <input
                type="text"
                placeholder={isBengali ? 'যেমন: মর্নিং স্ট্রেচিং' : 'e.g. Morning Circle'}
                value={programTaken}
                onChange={(e) => setProgramTaken(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">
              {isBengali ? 'আপনার অনুভূতি ও অভিজ্ঞতা' : 'Your Honest Reflection'}
            </label>
            <textarea
              required
              rows={4}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder={isBengali ? 'কীভাবে এই অভ্যাসগুলো আপনার দৈনন্দিন জীবনে শান্তি এনে দিয়েছে তা লিখুন...' : 'How has daily habit consistency and wholesome nourishment helped you feel better?'}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
            />
          </div>

          <div>
            <label className="font-medium text-stone-700 block mb-1">
              {isBengali ? 'রেটিং' : 'Rating'}
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'text-[#C6A66A] fill-current' : 'text-stone-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-[#A8BDA5]/20">
            <button
              type="button"
              onClick={() => setShareModalOpen(false)}
              className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.community.submitReview}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
