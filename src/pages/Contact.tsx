import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { ContactEnquiry } from '../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ContactProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const { t, isBengali } = useLanguage();
  const settings = storageService.getSettings();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState<ContactEnquiry['category']>('general');
  const [message, setMessage] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      onShowToast(isBengali ? 'অনুগ্রহ করে গোপনীয়তা নীতিতে সম্মতি দিন।' : 'Please accept the privacy consent to submit.', 'error');
      return;
    }

    setSubmitting(true);
    const newEnquiry: ContactEnquiry = {
      id: `enq-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      category,
      message: message.trim(),
      privacyAgreed: true,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    storageService.addEnquiry(newEnquiry);
    setSubmitting(false);
    setSubmitted(true);

    onShowToast(
      isBengali 
        ? 'ধন্যবাদ! আপনার বার্তাটি আমাদের টিমের কাছে পৌঁছেছে। আমরা শীঘ্রই যোগাযোগ করব।'
        : 'Thank you! Your enquiry has been received. Our wellness coordinator will reply shortly.',
      'success'
    );

    // Reset form
    setFullName('');
    setEmail('');
    setMobile('');
    setMessage('');
    setPrivacyAgreed(false);
  };

  const whatsappHref = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    isBengali ? 'নমস্কার, আমি প্রাণ ওয়েলনেস কমিউনিটি ও প্রোগ্রাম সম্পর্কে জানতে আগ্রহী।' : 'Hello, I would like to inquire about Prāna Wellness programs and community sessions.'
  )}`;

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {isBengali ? 'আমাদের সাথে যোগাযোগ' : 'GET IN TOUCH'}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#153D32] font-semibold leading-tight">
          {isBengali ? 'আমরা আপনার সুস্থতার পথচলায় পাশে আছি' : 'We Are Here to Guide & Support You'}
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-light">
          {isBengali
            ? 'আমাদের প্রোগ্রাম, সেশনের সময়সূচি বা ব্যক্তিগত পরামর্শ সংক্রান্ত যেকোনো প্রশ্নে যোগাযোগ করুন।'
            : 'Reach out with questions about morning breathing sessions, grocery wisdom, or personal consultations.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Information Column (5 cols) */}
        <div className="lg:col-span-5 space-y-8 p-8 rounded-3xl bg-[#153D32] text-[#F8F6F0]">
          <div className="space-y-3">
            <h3 className="font-serif text-2xl font-semibold text-[#FDFAF5]">
              {isBengali ? 'যোগাযোগের তথ্য' : 'Direct Assistance'}
            </h3>
            <p className="text-xs text-[#A8BDA5] leading-relaxed">
              {isBengali
                ? 'আমাদের ওয়েলনেস সমন্বয়কারী দল সোম থেকে শনিবার সকাল ৯টা থেকে সন্ধ্যা ৭টা পর্যন্ত সক্রিয় রয়েছে।'
                : 'Our wellness coordination team is available Monday through Saturday, 9:00 AM – 7:00 PM IST.'}
            </p>
          </div>

          <div className="space-y-5 text-xs text-[#A8BDA5]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C6A66A] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">{isBengali ? 'ঠিকানা:' : 'Sanctuary Address:'}</span>
                <span>{isBengali ? settings.businessAddressBn || settings.businessAddress : settings.businessAddress}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#C6A66A] shrink-0" />
              <div>
                <span className="text-white font-semibold block">{isBengali ? 'ইমেল:' : 'Email Us:'}</span>
                <a href={`mailto:${settings.businessEmail}`} className="hover:underline">
                  {settings.businessEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#C6A66A] shrink-0" />
              <div>
                <span className="text-white font-semibold block">{isBengali ? 'ফোন:' : 'Phone Support:'}</span>
                <a href={`tel:${settings.businessPhone.replace(/\s+/g, '')}`} className="hover:underline">
                  {settings.businessPhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#C6A66A] shrink-0" />
              <div>
                <span className="text-white font-semibold block">{isBengali ? 'কর্মঘণ্টা:' : 'Operating Hours:'}</span>
                <span>Mon – Sat: 7:00 AM – 8:30 PM IST (Online Sessions)</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Action Button */}
          <div className="pt-4 border-t border-[#A8BDA5]/20">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#0E2922] font-semibold text-xs shadow-md transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isBengali ? 'হোয়াটসঅ্যাপে সরাসরি মেসেজ করুন' : 'Chat Directly on WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Right Form Column (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs">
          <h3 className="font-serif text-2xl font-semibold text-[#153D32] mb-6">
            {isBengali ? 'আপনার বার্তা পাঠান' : 'Send an Enquiry'}
          </h3>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#E7EFE6] border border-[#A8BDA5]/40 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#153D32] mx-auto" />
              <h4 className="font-serif text-2xl font-semibold text-[#153D32]">
                {isBengali ? 'আপনার বার্তাটি সফলভাবে জমা হয়েছে!' : 'Enquiry Received!'}
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                {isBengali
                  ? 'আমাদের পরামর্শক দল ২৪ ঘণ্টার মধ্যে আপনার ইমেল বা ফোনে যোগাযোগ করবেন। সুস্থ থাকুন!'
                  : 'Thank you for reaching out. Our coordinator will review your question and respond within 24 hours.'}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 rounded-full bg-[#153D32] text-[#F8F6F0] text-xs font-semibold"
              >
                {isBengali ? 'আরেকটি বার্তা পাঠান' : 'Send Another Note'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs text-stone-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    {isBengali ? 'পুরো নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isBengali ? 'যেমন: অনন্যা সেন' : 'e.g. Maya Sharma'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    {isBengali ? 'ইমেল ঠিকানা *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    {isBengali ? 'মোবাইল নম্বর (ঐচ্ছিক)' : 'Mobile Number (Optional)'}
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98300 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    {isBengali ? 'বিষয় / ক্যাটাগরি *' : 'Enquiry Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ContactEnquiry['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                  >
                    <option value="general">{isBengali ? 'সাধারণ তথ্য' : 'General Inquiry'}</option>
                    <option value="program">{isBengali ? 'ওয়েলনেস প্রোগ্রাম' : 'Wellness Program'}</option>
                    <option value="consultation">{isBengali ? '১-অন-১ ব্যক্তিগত পরামর্শ' : '1-on-1 Consultation'}</option>
                    <option value="community">{isBengali ? 'কমিউনিটি ও ইভেন্ট' : 'Community & Events'}</option>
                    <option value="corporate">{isBengali ? 'প্রাতিষ্ঠানিক ওয়েলনেস ওয়ার্কশপ' : 'Workplace Wellness'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  {isBengali ? 'আপনার বার্তা *' : 'Your Message *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isBengali ? 'আপনার স্বাস্থ্য লক্ষ্য বা জানার বিষয়টি লিখুন...' : 'Tell us about your wellness goals or session questions...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="privacyConsent"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mt-0.5 rounded-sm border-[#A8BDA5] text-[#153D32] focus:ring-0"
                />
                <label htmlFor="privacyConsent" className="text-[11px] text-stone-600 leading-normal">
                  {isBengali
                    ? 'আমি স্বীকার করছি যে আমি প্রাণ ওয়েলনেস প্ল্যাটফর্মের গোপনীয়তা নীতি পড়েছি এবং সম্মত হয়েছি।'
                    : 'I agree to the privacy policy and consent to receiving a supportive response regarding my enquiry.'}
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.common.submit}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
