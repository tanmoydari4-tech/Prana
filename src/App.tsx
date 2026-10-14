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

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p !== '' ? p : '/';
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

  // Safe client navigation helper
  const navigate = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {
      // ignore
    }
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
