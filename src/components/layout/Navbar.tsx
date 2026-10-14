import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  LayoutDashboard, 
  LogOut, 
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { language, setLanguage, t, isBengali } = useLanguage();
  const { currentUser, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/programs', label: t.nav.programs },
    { path: '/nutrition', label: t.nav.nutrition },
    { path: '/events', label: t.nav.events },
    { path: '/community', label: t.nav.community },
    { path: '/gallery', label: t.nav.gallery },
    { path: '/contact', label: t.nav.contact },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F6F0]/95 backdrop-blur-md shadow-xs border-b border-[#A8BDA5]/20 py-3'
          : 'bg-[#F8F6F0] py-4 border-b border-[#A8BDA5]/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center text-left focus:outline-hidden group"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-sm font-medium transition-colors relative py-1 hover:text-[#153D32] ${
                    isActive
                      ? 'text-[#153D32] font-semibold'
                      : 'text-[#252A27]/80'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A66A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Language selector & Member Portal */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Functional Language Switcher */}
            <div className="flex items-center p-1 rounded-full bg-[#E7EFE6] border border-[#A8BDA5]/30">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-[#153D32] text-[#F8F6F0] shadow-xs'
                    : 'text-[#252A27]/70 hover:text-[#153D32]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                  language === 'bn'
                    ? 'bg-[#153D32] text-[#F8F6F0] shadow-xs'
                    : 'text-[#252A27]/70 hover:text-[#153D32]'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Member Profile or Join */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-[#153D32]/10 hover:bg-[#153D32]/15 text-[#153D32] border border-[#153D32]/20 transition-colors"
                >
                  <User className="w-4 h-4 text-[#153D32]" />
                  <span className="text-xs font-semibold max-w-[120px] truncate">
                    {currentUser.fullName.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-[#C6A66A] text-[#153D32] font-bold rounded-sm">
                      Admin
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-[#A8BDA5]/30 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#A8BDA5]/20">
                      <p className="text-xs text-stone-500">{isBengali ? 'লগইন আছেন:' : 'Signed in as'}</p>
                      <p className="text-sm font-semibold text-[#153D32] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => handleNav('/dashboard')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#252A27] hover:bg-[#F8F6F0] hover:text-[#153D32]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#A8BDA5]" />
                      {t.nav.dashboard}
                    </button>

                    <button
                      onClick={() => handleNav('/member/profile')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#252A27] hover:bg-[#F8F6F0] hover:text-[#153D32]"
                    >
                      <User className="w-4 h-4 text-[#A8BDA5]" />
                      {t.nav.profile}
                    </button>

                    <button
                      onClick={() => handleNav('/member/programs')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#252A27] hover:bg-[#F8F6F0] hover:text-[#153D32]"
                    >
                      <Sparkles className="w-4 h-4 text-[#A8BDA5]" />
                      {t.nav.myPrograms}
                    </button>

                    <button
                      onClick={() => handleNav('/member/events')}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#252A27] hover:bg-[#F8F6F0] hover:text-[#153D32]"
                    >
                      <Calendar className="w-4 h-4 text-[#A8BDA5]" />
                      {t.nav.myEvents}
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('/admin')}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#C6A66A] font-semibold hover:bg-[#153D32]/10"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C6A66A]" />
                        {t.nav.admin}
                      </button>
                    )}

                    <div className="border-t border-[#A8BDA5]/20 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          handleNav('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.nav.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#153D32] hover:bg-[#A8BDA5]/20 rounded-full transition-colors"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-2 text-xs font-semibold text-[#F8F6F0] bg-[#153D32] hover:bg-[#0E2922] rounded-full shadow-xs transition-all flex items-center gap-1.5 group"
                >
                  <span>{t.nav.join}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C6A66A] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 xl:hidden">
            {/* Language toggle on mobile header */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#E7EFE6] text-[#153D32] rounded-full border border-[#A8BDA5]/40"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'বাং' : 'EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#153D32] hover:bg-[#A8BDA5]/20 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#A8BDA5]/20 bg-[#F8F6F0] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-1.5 py-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPath === link.path
                    ? 'bg-[#153D32] text-[#F8F6F0] font-semibold'
                    : 'text-[#252A27] hover:bg-[#E7EFE6]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#A8BDA5]/20 flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="px-3 py-1.5 bg-[#E7EFE6] rounded-lg">
                  <p className="text-xs text-[#252A27]/70">{isBengali ? 'সদস্য:' : 'Signed in:'}</p>
                  <p className="text-sm font-bold text-[#153D32]">{currentUser.fullName}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNav('/dashboard')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#153D32] text-white rounded-lg"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {t.nav.dashboard}
                  </button>
                  <button
                    onClick={() => handleNav('/member/profile')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-[#A8BDA5]/40 text-[#153D32] rounded-lg"
                  >
                    <User className="w-3.5 h-3.5" />
                    {t.nav.profile}
                  </button>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#C6A66A]/20 text-[#153D32] border border-[#C6A66A] rounded-lg"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C6A66A]" />
                    {t.nav.admin}
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNav('/');
                  }}
                  className="w-full text-center py-2 text-xs text-rose-700 font-medium hover:bg-rose-50 rounded-lg"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-[#153D32] bg-white border border-[#A8BDA5]/40 rounded-xl"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-[#F8F6F0] bg-[#153D32] rounded-xl shadow-xs"
                >
                  {t.nav.join}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
