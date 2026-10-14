import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useLanguage } from '../../i18n/LanguageContext';
import { storageService } from '../../services/storageService';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle, 
  ArrowRight, 
  Heart, 
  CheckCircle2,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { isBengali, t } = useLanguage();
  const settings = storageService.getSettings();
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim() && emailSub.includes('@')) {
      setSubscribed(true);
      setEmailSub('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#153D32] text-[#F8F6F0] pt-16 pb-12 border-t border-[#C6A66A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#A8BDA5]/20">
          {/* Brand info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" light showTagline />
            <p className="text-sm text-[#A8BDA5] leading-relaxed max-w-sm mt-3">
              {isBengali ? settings.philosophyBn || settings.philosophy : settings.philosophy}
            </p>
            <div className="p-3.5 rounded-xl bg-[#0E2922]/80 border border-[#A8BDA5]/20 text-xs text-[#F8F6F0]/85">
              <span className="text-[#C6A66A] font-semibold block mb-1">
                {isBengali ? '🌱 আমাদের প্রতিশ্রুতি:' : '🌱 Our Core Philosophy:'}
              </span>
              {isBengali
                ? 'আমরা কোনো জিম নই। কোনো ভারী ওজন, কঠিন ডায়েট বা অবাস্তব প্রতিশ্রুতি নেই—কেবল প্রতিদিনের স্বাভাবিক পুষ্টি, স্নিগ্ধ হাঁটা ও মানসিক শান্তির রূপরেখা।'
                : '100% Gentle Wellness without gym intimidation, extreme weightlifting, or unsustainable crash diets. Sustainable health built on simple daily habits.'}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#0E2922] hover:bg-[#C6A66A] hover:text-[#153D32] text-[#A8BDA5] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#0E2922] hover:bg-[#C6A66A] hover:text-[#153D32] text-[#A8BDA5] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.socialYouTube}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#0E2922] hover:bg-[#C6A66A] hover:text-[#153D32] text-[#A8BDA5] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-semibold transition-colors border border-[#25D366]/30"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#C6A66A] tracking-wider uppercase">
              {isBengali ? 'পৃষ্ঠাসমূহ' : 'Explore'}
            </h4>
            <ul className="space-y-2 text-sm text-[#A8BDA5]">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-white transition-colors">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-white transition-colors">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/programs')} className="hover:text-white transition-colors">
                  {t.nav.programs}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/nutrition')} className="hover:text-white transition-colors">
                  {t.nav.nutrition}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/events')} className="hover:text-white transition-colors">
                  {t.nav.events}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/community')} className="hover:text-white transition-colors">
                  {t.nav.community}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/gallery')} className="hover:text-white transition-colors">
                  {t.nav.gallery}
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Portal */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#C6A66A] tracking-wider uppercase">
              {isBengali ? 'সদস্য ও সহায়তা' : 'Community'}
            </h4>
            <ul className="space-y-2 text-sm text-[#A8BDA5]">
              <li>
                <button onClick={() => handleNav('/login')} className="hover:text-white transition-colors">
                  {t.nav.login}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/register')} className="hover:text-white transition-colors">
                  {t.nav.join}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/dashboard')} className="hover:text-white transition-colors">
                  {t.nav.dashboard}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/contact')} className="hover:text-white transition-colors">
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/privacy')} className="hover:text-white transition-colors">
                  {isBengali ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/terms')} className="hover:text-white transition-colors">
                  {isBengali ? 'শর্তাবলি ও নিয়ম' : 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/admin/login')} className="hover:text-[#C6A66A] transition-colors text-xs opacity-75">
                  {t.nav.admin}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact info & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#C6A66A] tracking-wider uppercase">
              {isBengali ? 'দৈনন্দিন টিপস' : 'Stay Connected'}
            </h4>
            <p className="text-xs text-[#A8BDA5] leading-relaxed">
              {isBengali
                ? 'সকালের পুষ্টি ও মানসিক শান্তির সাপ্তাহিক নিউজলেটার পেতে ইমেল দিন।'
                : 'Receive a serene weekly dispatch with seasonal food ideas, breathwork tips, and live circle invites.'}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center rounded-xl bg-[#0E2922] border border-[#A8BDA5]/30 overflow-hidden focus-within:border-[#C6A66A]">
                <input
                  type="email"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder={isBengali ? 'আপনার ইমেল ঠিকানা...' : 'Your email address...'}
                  required
                  className="w-full px-3 py-2 text-xs bg-transparent text-[#F8F6F0] focus:outline-hidden placeholder-[#A8BDA5]/50"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#C6A66A] hover:bg-[#d8b87a] text-[#153D32] transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-[#A8BDA5]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A66A]" />
                  <span>{isBengali ? 'ধন্যবাদ! আপনি যুক্ত হয়েছেন।' : 'Thank you for joining our circle!'}</span>
                </div>
              )}
            </form>

            <div className="space-y-2 pt-2 text-xs text-[#A8BDA5]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C6A66A] shrink-0 mt-0.5" />
                <span>{isBengali ? settings.businessAddressBn || settings.businessAddress : settings.businessAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C6A66A] shrink-0" />
                <a href={`mailto:${settings.businessEmail}`} className="hover:underline">
                  {settings.businessEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C6A66A] shrink-0" />
                <a href={`tel:${settings.businessPhone.replace(/\s+/g, '')}`} className="hover:underline">
                  {settings.businessPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A8BDA5]/80">
          <p className="max-w-2xl text-center md:text-left leading-relaxed">
            {t.common.disclaimerText}
          </p>
          <div className="flex items-center gap-2 text-center">
            <span>© {new Date().getFullYear()} {settings.brandName}. {t.common.allRights}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
