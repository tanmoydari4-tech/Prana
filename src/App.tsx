import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer, ToastMessage } from './components/common/Toast';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Programs } from './pages/Programs';
import { Nutrition } from './pages/Nutrition';
import { Events } from './pages/Events';
import { Community } from './pages/Community';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';

// Auth Pages
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { ForgotPassword } from './pages/Auth/ForgotPassword';

// Member Portal
import { MemberDashboard } from './pages/Member/Dashboard';
import { Profile } from './pages/Member/Profile';
import { MyPrograms } from './pages/Member/MyPrograms';
import { MyEvents } from './pages/Member/MyEvents';

// Admin Portal
import { AdminLogin } from './pages/Admin/AdminLogin';
import { AdminDashboard } from './pages/Admin/AdminDashboard';

// Legal & System
import { PrivacyPolicy } from './pages/Legal/PrivacyPolicy';
import { TermsConditions } from './pages/Legal/TermsConditions';
import { NotFound } from './pages/NotFound';

// Helper to detect repository base path when hosted on GitHub Pages (e.g., /Prana)
export const getAppBasePath = (): string => {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname;
  const hostname = window.location.hostname;

  // On GitHub Pages (e.g. tanmoydari1-tech.github.io/Prana/)
  if (hostname.endsWith('github.io')) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      // First segment is the repo name (e.g., '/Prana')
      return `/${segments[0]}`;
    }
  }

  // Also handle if pathname explicitly starts with /Prana or /prana
  const pranaMatch = pathname.match(/^\/(prana)(\/|$)/i);
  if (pranaMatch) {
    return `/${pranaMatch[1]}`;
  }

  return '';
};

// Normalize browser path to app route (e.g., '/Prana/' -> '/', '/Prana/about' -> '/about')
export const getNormalizedAppPath = (pathname: string, hash: string = ''): string => {
  // Check for SPA redirect query parameter (e.g. ?p=/programs)
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectRoute = searchParams.get('p') || searchParams.get('route');
    if (redirectRoute) {
      const cleanRedirect = redirectRoute.startsWith('/') ? redirectRoute : `/${redirectRoute}`;
      return cleanRedirect;
    }
  }

  // Support hash routing if hash exists (e.g., #/admin or #admin or #/about)
  if (hash && hash.length > 1) {
    const cleanHash = hash.replace(/^#\/?/, '/');
    const pathOnly = cleanHash.split('?')[0];
    return pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  }

  let clean = pathname || '/';
  const base = getAppBasePath();

  if (base && clean.toLowerCase().startsWith(base.toLowerCase())) {
    clean = clean.slice(base.length);
  }

  // Remove trailing slash if longer than 1 character
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  return clean === '' ? '/' : clean;
};

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return getNormalizedAppPath(window.location.pathname, window.location.hash);
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Safe client navigation helper with repository sub-path awareness
  const navigate = (toPath: string) => {
    const [pathOnly, searchOnly] = toPath.split('?');
    const base = getAppBasePath();
    const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
    const searchString = searchOnly ? `?${searchOnly}` : '';
    const fullBrowserPath = `${base}${normalized === '/' && base ? '/' : normalized}${searchString}`;

    try {
      window.history.pushState({}, '', fullBrowserPath);
    } catch {
      // ignore
    }

    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getNormalizedAppPath(window.location.pathname, window.location.hash));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Parse query params for program or article preselection
  const urlParams = new URLSearchParams(window.location.search);
  const selectedProgramId = urlParams.get('selected');
  const selectedArticleSlug = urlParams.get('article');

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <Home navigate={navigate} onShowToast={showToast} />;
      case '/about':
        return <About navigate={navigate} />;
      case '/programs':
        return <Programs navigate={navigate} onShowToast={showToast} initialSelectedId={selectedProgramId} />;
      case '/nutrition':
        return <Nutrition navigate={navigate} initialArticleSlug={selectedArticleSlug} />;
      case '/events':
        return <Events navigate={navigate} onShowToast={showToast} />;
      case '/community':
        return <Community navigate={navigate} onShowToast={showToast} />;
      case '/gallery':
        return <Gallery navigate={navigate} />;
      case '/contact':
        return <Contact onShowToast={showToast} />;
      case '/login':
        return <Login navigate={navigate} onShowToast={showToast} />;
      case '/register':
        return <Register navigate={navigate} onShowToast={showToast} />;
      case '/forgot-password':
        return <ForgotPassword navigate={navigate} />;
      case '/dashboard':
        return <MemberDashboard navigate={navigate} onShowToast={showToast} />;
      case '/member/profile':
        return <Profile navigate={navigate} onShowToast={showToast} />;
      case '/member/programs':
        return <MyPrograms navigate={navigate} />;
      case '/member/events':
        return <MyEvents navigate={navigate} />;
      case '/admin/login':
        return <AdminLogin navigate={navigate} onShowToast={showToast} />;
      case '/admin':
        return <AdminDashboard navigate={navigate} onShowToast={showToast} />;
      case '/privacy':
        return <PrivacyPolicy navigate={navigate} />;
      case '/terms':
        return <TermsConditions navigate={navigate} />;
      default:
        return <NotFound navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#252A27] font-sans">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer navigate={navigate} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
