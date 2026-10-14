import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { storageService, KEYS } from '../../services/storageService';
import { 
  UserProfile, 
  Program, 
  WellnessEvent, 
  NutritionArticle, 
  Testimonial, 
  GalleryItem, 
  ContactEnquiry, 
  PaymentRecord, 
  WebsiteSettings,
  ProgramCategory
} from '../../types';
import { Modal } from '../../components/common/Modal';
import { isSupabaseConfigured, testSupabaseConnection } from '../../services/supabaseClient';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Camera, 
  MessageSquare, 
  Mail, 
  CreditCard, 
  Settings as SettingsIcon,
  ShieldCheck, 
  Plus, 
  Search, 
  Download, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Save, 
  ExternalLink,
  Flame,
  ArrowUpRight,
  Key,
  Database,
  Lock,
  Copy
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (path: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type AdminTab = 
  | 'overview' 
  | 'members' 
  | 'programs' 
  | 'events' 
  | 'articles' 
  | 'gallery' 
  | 'testimonials' 
  | 'enquiries' 
  | 'payments' 
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, onShowToast }) => {
  const { isBengali, t, setLanguage } = useLanguage();
  const { currentUser, isAdmin, changeAdminPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Reactive state from storageService
  const [members, setMembers] = useState<UserProfile[]>(() => storageService.getUsers());
  const [programs, setPrograms] = useState<Program[]>(() => storageService.getPrograms());
  const [events, setEvents] = useState<WellnessEvent[]>(() => storageService.getEvents());
  const [articles, setArticles] = useState<NutritionArticle[]>(() => storageService.getArticles());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => storageService.getTestimonials(false));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => storageService.getGallery());
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(() => storageService.getEnquiries());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => storageService.getPayments());
  const [settings, setSettings] = useState<WebsiteSettings>(() => storageService.getSettings());

  // Admin password management state
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [adminPassMessage, setAdminPassMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Supabase status state
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Checking Supabase connection...');

  // Search filter states
  const [memberSearch, setMemberSearch] = useState('');

  // Modals for CRUD
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Partial<Program> | null>(null);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<WellnessEvent> | null>(null);

  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<NutritionArticle> | null>(null);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);

  // Sync state when storage changes
  const refreshAll = () => {
    setMembers(storageService.getUsers());
    setPrograms(storageService.getPrograms());
    setEvents(storageService.getEvents());
    setArticles(storageService.getArticles());
    setTestimonials(storageService.getTestimonials(false));
    setGallery(storageService.getGallery());
    setEnquiries(storageService.getEnquiries());
    setPayments(storageService.getPayments());
    setSettings(storageService.getSettings());
  };

  useEffect(() => {
    testSupabaseConnection().then(res => setSupabaseStatus(res.message));

    const unsub1 = storageService.subscribe(KEYS.PROGRAMS, refreshAll);
    const unsub2 = storageService.subscribe(KEYS.EVENTS, refreshAll);
    const unsub3 = storageService.subscribe(KEYS.ENQUIRIES, refreshAll);
    const unsub4 = storageService.subscribe(KEYS.TESTIMONIALS, refreshAll);
    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, []);

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPass !== confirmAdminPass) {
      setAdminPassMessage({
        text: isBengali ? 'নতুন পাসওয়ার্ড দুটি হুবহু মিলছে না।' : 'New passwords do not match.',
        isError: true
      });
      return;
    }
    const res = changeAdminPassword(currentAdminPass, newAdminPass);
    if (res.success) {
      setAdminPassMessage({
        text: isBengali ? 'অ্যাডমিন পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।' : 'Admin password successfully updated.',
        isError: false
      });
      setCurrentAdminPass('');
      setNewAdminPass('');
      setConfirmAdminPass('');
      onShowToast(isBengali ? 'পাসওয়ার্ড পরিবর্তিত হয়েছে।' : 'Admin password changed.', 'success');
    } else {
      setAdminPassMessage({
        text: res.error || (isBengali ? 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' : 'Incorrect current password.'),
        isError: true
      });
    }
  };

  if (!isAdmin && currentUser?.email !== 'tanmoydari4@gmail.com') {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#153D32]">
          {isBengali ? 'অ্যাক্সেস সংরক্ষিত' : 'Restricted Access'}
        </h2>
        <p className="text-xs text-stone-600">
          {isBengali 
            ? 'এই পৃষ্ঠাটি কেবল প্রাতিষ্ঠানিক অ্যাডমিনদের জন্য। অনুগ্রহ করে অ্যাডমিন অ্যাকাউন্টে প্রবেশ করুন।'
            : 'You must be logged in as an authorized administrator to view this console.'}
        </p>
        <button
          onClick={() => navigate('/admin/login')}
          className="px-6 py-2.5 rounded-full bg-[#153D32] text-white text-xs font-semibold"
        >
          {isBengali ? 'অ্যাডমিন লগইন' : 'Admin Login'}
        </button>
      </div>
    );
  }

  // --- MEMBER MANAGEMENT ---
  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleToggleMemberStatus = (uid: string) => {
    const mem = members.find(m => m.uid === uid);
    if (!mem) return;
    const nextStatus = mem.membershipStatus === 'active' ? 'suspended' : 'active';
    const updated = { ...mem, membershipStatus: nextStatus as any };
    storageService.saveUser(updated);
    refreshAll();
    onShowToast(`Member status changed to ${nextStatus}`, 'info');
  };

  const handleExportMembersCSV = () => {
    const headers = ['UID', 'Full Name', 'Email', 'Mobile', 'Preferred Language', 'Status', 'Role', 'Created At'];
    const rows = members.map(m => [
      `"${m.uid}"`,
      `"${m.fullName}"`,
      `"${m.email}"`,
      `"${m.mobile || ''}"`,
      `"${m.preferredLanguage}"`,
      `"${m.membershipStatus}"`,
      `"${m.role}"`,
      `"${m.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `prana_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(isBengali ? 'সদস্য তালিকা সফলভাবে ডাউনলোড হয়েছে।' : 'Member CSV exported successfully.', 'success');
  };

  // --- PROGRAM ACTIONS ---
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram || !editingProgram.title) return;

    const prog: Program = {
      id: editingProgram.id || `prog-${Date.now()}`,
      slug: editingProgram.slug || editingProgram.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: editingProgram.title,
      titleBn: editingProgram.titleBn || editingProgram.title,
      description: editingProgram.description || '',
      descriptionBn: editingProgram.descriptionBn || '',
      category: editingProgram.category || 'lifestyle_coaching',
      categoryName: editingProgram.categoryName || 'Lifestyle Coaching',
      categoryNameBn: editingProgram.categoryNameBn || 'জীবনধারা কোচিং',
      imageUrl: editingProgram.imageUrl || 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1000&q=80',
      price: Number(editingProgram.price) || 0,
      duration: editingProgram.duration || '4 Weeks',
      durationBn: editingProgram.durationBn || '৪ সপ্তাহ',
      audience: editingProgram.audience || 'All seekers of gentle balance',
      audienceBn: editingProgram.audienceBn || 'সকল আগ্রহী ব্যক্তিবর্গ',
      features: editingProgram.features || ['Guided daily check-in', 'Nutrition wisdom', 'Mentor access'],
      featuresBn: editingProgram.featuresBn || ['দৈনিক চেক-ইন', 'পুষ্টি শিক্ষা', 'মেন্টর সহায়তা'],
      published: editingProgram.published ?? true,
      featured: editingProgram.featured ?? true,
      createdAt: editingProgram.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storageService.saveProgram(prog);
    setProgramModalOpen(false);
    setEditingProgram(null);
    refreshAll();
    onShowToast(isBengali ? 'প্রোগ্রাম সংরক্ষিত হয়েছে।' : 'Program saved successfully.', 'success');
  };

  const handleDeleteProgram = (id: string) => {
    if (window.confirm(isBengali ? 'আপনি কি নিশ্চিত যে এই প্রোগ্রামটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this program?')) {
      storageService.deleteProgram(id);
      refreshAll();
      onShowToast('Program removed', 'info');
    }
  };

  // --- EVENT ACTIONS ---
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;

    const ev: WellnessEvent = {
      id: editingEvent.id || `event-${Date.now()}`,
      title: editingEvent.title,
      titleBn: editingEvent.titleBn || editingEvent.title,
      description: editingEvent.description || '',
      descriptionBn: editingEvent.descriptionBn || '',
      imageUrl: editingEvent.imageUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
      startAt: editingEvent.startAt || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      endAt: editingEvent.endAt || new Date(Date.now() + 1000 * 60 * 60 * 25).toISOString(),
      timezone: 'IST (UTC+5:30)',
      format: editingEvent.format || 'online',
      formatBn: editingEvent.format === 'in_person' ? 'সরাসরি প্রকৃতিতে' : 'অনলাইন লাইভ সেশন',
      meetingUrl: editingEvent.meetingUrl || '',
      venue: editingEvent.venue || '',
      hostName: editingEvent.hostName || 'Prāna Wellness Guide',
      hostRole: editingEvent.hostRole || 'Lifestyle Mentor',
      capacity: Number(editingEvent.capacity) || 50,
      registeredCount: editingEvent.registeredCount || 0,
      registrationDeadline: editingEvent.registrationDeadline || new Date().toISOString(),
      price: Number(editingEvent.price) || 0,
      status: editingEvent.status || 'upcoming',
      tags: ['Mindfulness', 'Gentle Movement'],
      createdAt: editingEvent.createdAt || new Date().toISOString()
    };

    storageService.saveEvent(ev);
    setEventModalOpen(false);
    setEditingEvent(null);
    refreshAll();
    onShowToast(isBengali ? 'ইভেন্ট শিডিউল সংরক্ষিত হয়েছে।' : 'Event scheduled successfully.', 'success');
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Delete this event?')) {
      storageService.deleteEvent(id);
      refreshAll();
      onShowToast('Event deleted', 'info');
    }
  };

  // --- ARTICLE ACTIONS ---
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title) return;

    const art: NutritionArticle = {
      id: editingArticle.id || `art-${Date.now()}`,
      slug: editingArticle.slug || editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: editingArticle.title,
      titleBn: editingArticle.titleBn || editingArticle.title,
      summary: editingArticle.summary || '',
      summaryBn: editingArticle.summaryBn || '',
      content: editingArticle.content || '',
      contentBn: editingArticle.contentBn || '',
      imageUrl: editingArticle.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80',
      category: editingArticle.category || 'nutrition',
      categoryBn: editingArticle.category === 'movement' ? 'হাঁটাচলা' : 'পুষ্টি শিক্ষা',
      author: editingArticle.author || 'Prāna Editorial',
      readTime: editingArticle.readTime || '4 min',
      published: editingArticle.published ?? true,
      publishedAt: editingArticle.publishedAt || new Date().toISOString()
    };

    storageService.saveArticle(art);
    setArticleModalOpen(false);
    setEditingArticle(null);
    refreshAll();
    onShowToast('Article published', 'success');
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Delete article?')) {
      storageService.deleteArticle(id);
      refreshAll();
      onShowToast('Article deleted', 'info');
    }
  };

  // --- TESTIMONIAL MODERATION ---
  const handleApproveTestimonial = (id: string, approved: boolean) => {
    storageService.updateTestimonialStatus(id, approved);
    refreshAll();
    onShowToast(approved ? 'Reflection approved and published.' : 'Reflection moved to pending.', 'success');
  };

  const handleDeleteTestimonial = (id: string) => {
    if (window.confirm('Delete review?')) {
      storageService.deleteTestimonial(id);
      refreshAll();
      onShowToast('Review removed', 'info');
    }
  };

  // --- ENQUIRY ACTIONS ---
  const handleUpdateEnquiryStatus = (id: string, status: ContactEnquiry['status']) => {
    storageService.updateEnquiryStatus(id, status);
    refreshAll();
  };

  const handleDeleteEnquiry = (id: string) => {
    storageService.deleteEnquiry(id);
    refreshAll();
  };

  // --- SETTINGS SAVE ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(settings);
    onShowToast(isBengali ? 'ওয়েবসাইট সেটিংস সংরক্ষিত হয়েছে।' : 'Website settings updated successfully.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#153D32] text-[#F8F6F0] shadow-md border border-[#C6A66A]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C6A66A] text-[#153D32] uppercase">
              Admin Console
            </span>
            <span className="text-xs text-[#A8BDA5]">
              {currentUser?.email}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#FDFAF5]">
            {t.admin.title}
          </h1>
          <p className="text-xs text-[#A8BDA5]">
            {t.admin.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FDFAF5] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isBengali ? 'ওয়েবসাইট দেখুন' : 'View Public Site'}</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#A8BDA5]/20">
        {[
          { key: 'overview', label: t.admin.tabs.overview, icon: LayoutDashboard },
          { key: 'members', label: `${t.admin.tabs.members} (${members.length})`, icon: Users },
          { key: 'programs', label: `${t.admin.tabs.programs} (${programs.length})`, icon: Sparkles },
          { key: 'events', label: `${t.admin.tabs.events} (${events.length})`, icon: Calendar },
          { key: 'articles', label: `${t.admin.tabs.articles} (${articles.length})`, icon: BookOpen },
          { key: 'testimonials', label: `${t.admin.tabs.testimonials} (${testimonials.filter(t => !t.approved).length} new)`, icon: MessageSquare },
          { key: 'enquiries', label: `${t.admin.tabs.enquiries} (${enquiries.filter(e => e.status === 'unread').length})`, icon: Mail },
          { key: 'payments', label: t.admin.tabs.payments, icon: CreditCard },
          { key: 'settings', label: t.admin.tabs.settings, icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#153D32] text-[#F8F6F0] shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB CONTENT --- */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium">{t.admin.stats.totalMembers}</span>
              <p className="text-2xl font-bold text-[#153D32]">{members.length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium">{t.admin.stats.activePrograms}</span>
              <p className="text-2xl font-bold text-[#153D32]">{programs.filter(p => p.published).length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium">{t.admin.stats.upcomingEvents}</span>
              <p className="text-2xl font-bold text-[#153D32]">{events.filter(e => e.status === 'upcoming').length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium">{t.admin.stats.pendingEnquiries}</span>
              <p className="text-2xl font-bold text-amber-700">{enquiries.filter(e => e.status === 'unread').length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium">{t.admin.stats.unapprovedReviews}</span>
              <p className="text-2xl font-bold text-amber-700">{testimonials.filter(t => !t.approved).length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-1">
              <span className="text-[11px] text-stone-500 font-medium">{t.admin.stats.revenueSim}</span>
              <p className="text-2xl font-bold text-emerald-800">
                {settings.currencySymbol}{payments.reduce((acc, p) => acc + p.amount, 0)}
              </p>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#E7EFE6] border border-[#A8BDA5]/40 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#153D32]">
                {isBengali ? 'নতুন প্রোগ্রাম যোগ করুন' : 'Launch New Program'}
              </h3>
              <p className="text-xs text-stone-600">
                {isBengali ? 'নতুন পুষ্টি বা জীবনধারা কোচিং কোর্স প্রকাশ করুন।' : 'Create and publish gentle habit or nutrition courses.'}
              </p>
              <button
                onClick={() => {
                  setEditingProgram({
                    title: '',
                    titleBn: '',
                    category: 'lifestyle_coaching',
                    price: 1499,
                    duration: '4 Weeks',
                    published: true,
                    features: ['Daily habit checklist', 'Weekly live circle'],
                    featuresBn: ['দৈনিক অভ্যাস গাইড', 'সাপ্তাহিক লাইভ ক্লাস']
                  });
                  setProgramModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.admin.actions.createProgram}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#E7EFE6] border border-[#A8BDA5]/40 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#153D32]">
                {isBengali ? 'ইভেন্ট শিডিউল করুন' : 'Schedule Live Session'}
              </h3>
              <p className="text-xs text-stone-600">
                {isBengali ? 'সকালের লাইভ স্ট্রেচিং বা সন্ধ্যার মেডিটেশন যোগ করুন।' : 'Add upcoming sunrise breathwork or park walking circle.'}
              </p>
              <button
                onClick={() => {
                  setEditingEvent({
                    title: '',
                    titleBn: '',
                    format: 'online',
                    hostName: 'Dr. Arundhati Roy',
                    capacity: 50,
                    price: 0,
                    status: 'upcoming'
                  });
                  setEventModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.admin.actions.createEvent}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#E7EFE6] border border-[#A8BDA5]/40 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#153D32]">
                {isBengali ? 'সদস্য তালিকা ডাউনলোড' : 'Member Data Export'}
              </h3>
              <p className="text-xs text-stone-600">
                {isBengali ? 'সকল সদস্যের তথ্য সুরক্ষিত CSV ফরম্যাটে সংরক্ষণ করুন।' : 'Download clean CSV containing registered members.'}
              </p>
              <button
                onClick={handleExportMembersCSV}
                className="px-4 py-2 rounded-full bg-white border border-[#A8BDA5]/40 text-[#153D32] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F8F6F0]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.admin.actions.exportCsv}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder={isBengali ? 'নাম বা ইমেল দিয়ে খুঁজুন...' : 'Search by member name or email...'}
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#A8BDA5]/40 text-xs focus:outline-hidden focus:border-[#153D32]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={handleExportMembersCSV}
              className="px-4 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.admin.actions.exportCsv}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#A8BDA5]/30 bg-white">
            <table className="min-w-full text-left text-xs text-stone-700">
              <thead className="bg-[#E7EFE6] text-[#153D32] font-semibold border-b border-[#A8BDA5]/20">
                <tr>
                  <th className="p-3.5">Member Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Mobile</th>
                  <th className="p-3.5">Lang</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8BDA5]/10">
                {filteredMembers.map((m) => (
                  <tr key={m.uid} className="hover:bg-[#F8F6F0]/60">
                    <td className="p-3.5 font-medium text-stone-900">{m.fullName}</td>
                    <td className="p-3.5 text-stone-600">{m.email}</td>
                    <td className="p-3.5">{m.mobile || '—'}</td>
                    <td className="p-3.5 uppercase font-bold text-[10px]">{m.preferredLanguage}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.membershipStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {m.membershipStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-sm bg-stone-100 text-stone-700 font-semibold text-[10px]">
                        {m.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {m.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleMemberStatus(m.uid)}
                          className="text-xs font-semibold text-[#153D32] hover:underline"
                        >
                          {m.membershipStatus === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PROGRAMS TAB */}
      {activeTab === 'programs' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
              {isBengali ? 'ওয়েলনেস কোর্স ও প্রোগ্রাম পরিচালনা' : 'Manage Wellness Programs'}
            </h2>
            <button
              onClick={() => {
                setEditingProgram({
                  title: '',
                  titleBn: '',
                  category: 'lifestyle_coaching',
                  price: 1999,
                  duration: '6 Weeks',
                  published: true,
                  features: ['Daily Habit Architecture', 'Weekly Live Circle'],
                  featuresBn: ['দৈনিক অভ্যাস রুটিন', 'সাপ্তাহিক লাইভ ক্লাস']
                });
                setProgramModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.admin.actions.createProgram}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div key={prog.id} className="p-5 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E7EFE6] text-[#153D32] font-semibold text-[10px]">
                      {prog.categoryName}
                    </span>
                    <span className="font-bold text-[#153D32]">{settings.currencySymbol}{prog.price}</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-[#153D32]">{prog.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{prog.description}</p>
                </div>

                <div className="pt-3 border-t border-[#A8BDA5]/20 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setEditingProgram(prog);
                      setProgramModalOpen(true);
                    }}
                    className="text-stone-700 hover:text-[#153D32] font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProgram(prog.id)}
                    className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
              {isBengali ? 'ইভেন্ট ও সেশন শিডিউল' : 'Event & Live Session Management'}
            </h2>
            <button
              onClick={() => {
                setEditingEvent({
                  title: '',
                  titleBn: '',
                  format: 'online',
                  hostName: 'Dr. Arundhati Roy',
                  capacity: 50,
                  price: 0,
                  status: 'upcoming'
                });
                setEventModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.admin.actions.createEvent}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#A8BDA5]/30 bg-white">
            <table className="min-w-full text-left text-xs text-stone-700">
              <thead className="bg-[#E7EFE6] text-[#153D32] font-semibold border-b border-[#A8BDA5]/20">
                <tr>
                  <th className="p-3.5">Event Title</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Format</th>
                  <th className="p-3.5">Host</th>
                  <th className="p-3.5">RSVPs</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8BDA5]/10">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#F8F6F0]/60">
                    <td className="p-3.5 font-medium text-stone-900">{ev.title}</td>
                    <td className="p-3.5">{new Date(ev.startAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td className="p-3.5 uppercase font-semibold text-[10px]">{ev.format}</td>
                    <td className="p-3.5">{ev.hostName}</td>
                    <td className="p-3.5">{ev.registeredCount}/{ev.capacity}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7EFE6] text-[#153D32]">
                        {ev.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingEvent(ev);
                          setEventModalOpen(true);
                        }}
                        className="text-stone-700 hover:text-[#153D32] font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ARTICLES TAB */}
      {activeTab === 'articles' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
              {isBengali ? 'ওয়েলনেস আর্টিকেল ও ব্লগ' : 'Educational Nutrition Articles'}
            </h2>
            <button
              onClick={() => {
                setEditingArticle({
                  title: '',
                  titleBn: '',
                  summary: '',
                  content: '',
                  category: 'nutrition',
                  author: 'Prāna Editorial',
                  readTime: '4 min',
                  published: true
                });
                setArticleModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.admin.actions.createArticle}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((art) => (
              <div key={art.id} className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E7EFE6] text-[#153D32] font-semibold text-[10px]">
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-[#153D32]">{art.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{art.summary}</p>
                </div>

                <div className="pt-3 border-t border-[#A8BDA5]/20 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      setEditingArticle(art);
                      setArticleModalOpen(true);
                    }}
                    className="text-stone-700 hover:text-[#153D32] font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(art.id)}
                    className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TESTIMONIALS MODERATION TAB */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
              {isBengali ? 'সদস্য রিভিউ ও অভিজ্ঞতা অনুমোদন' : 'Testimonials & Reflections Moderation'}
            </h2>
            <p className="text-xs text-stone-500">
              {isBengali ? 'সত্যতা ও গোপনীয়তা বজায় রাখতে রিভিউ পর্যালোচনা করুন।' : 'Review member submissions before they appear on the live site.'}
            </p>
          </div>

          <div className="space-y-4">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  test.approved ? 'bg-white border-[#A8BDA5]/30' : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#153D32]">{test.authorName}</span>
                    <span className="text-[11px] text-stone-500">({test.authorLocation})</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      test.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {test.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 italic">"{test.quote}"</p>
                  <span className="text-[10px] text-stone-400 block">{test.programTaken}</span>
                </div>

                <div className="flex items-center gap-2">
                  {!test.approved ? (
                    <button
                      onClick={() => handleApproveTestimonial(test.id, true)}
                      className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.admin.actions.approve}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApproveTestimonial(test.id, false)}
                      className="px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTestimonial(test.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
              {isBengali ? 'যোগাযোগ বার্তা ও পরামর্শ জিজ্ঞাসা' : 'Received Messages & Consultation Enquiries'}
            </h2>
            <p className="text-xs text-stone-500">
              {isBengali ? 'ওয়েবসাইট ও ড্যাশবোর্ড থেকে আসা সকল বার্তা' : 'Direct enquiries from public contact form and member coach messages.'}
            </p>
          </div>

          {enquiries.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-[#A8BDA5]/30">
              <Mail className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs text-stone-500">{isBengali ? 'কোনো নতুন বার্তা নেই।' : 'No enquiries received yet.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-6 rounded-2xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-[#153D32] text-sm">{enq.fullName}</span>
                      <span className="text-stone-500 ml-2">({enq.email} {enq.mobile ? `• ${enq.mobile}` : ''})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7EFE6] text-[#153D32] uppercase">
                        {enq.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        enq.status === 'unread' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 bg-[#F8F6F0] p-3 rounded-xl border border-[#A8BDA5]/20 leading-relaxed whitespace-pre-line">
                    {enq.message}
                  </p>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-stone-400 text-[11px]">{new Date(enq.createdAt).toLocaleString()}</span>
                    <div className="flex items-center gap-2">
                      {enq.status === 'unread' ? (
                        <button
                          onClick={() => handleUpdateEnquiryStatus(enq.id, 'read')}
                          className="text-xs text-[#153D32] font-semibold hover:underline"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateEnquiryStatus(enq.id, 'replied')}
                          className="text-xs text-emerald-700 font-semibold hover:underline"
                        >
                          Mark as Replied
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteEnquiry(enq.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold pl-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
                {t.admin.tabs.payments}
              </h2>
              <p className="text-xs text-stone-500">
                {isBengali ? 'সদস্যদের কোর্স ও সেশন ফি ট্র্যাকিং' : 'Transaction records, payment status, and gateway configuration'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#E7EFE6] border border-[#A8BDA5]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-[#153D32] block">
                {isBengali ? 'পেমেন্ট গেটওয়ে মোড:' : 'Payment Gateway Mode:'}
              </span>
              <span className="text-stone-600">
                {settings.paymentMode === 'test_simulation'
                  ? (isBengali ? 'সিমুলেটেড সুরক্ষিত টেস্ট মোড সক্রিয় (কোনো লাইভ চার্জ নেই)' : 'Secure Test Simulation Mode (No external gateway required for preview)')
                  : 'Razorpay Live Integration'}
              </span>
            </div>
            <button
              onClick={() => {
                const nextMode = settings.paymentMode === 'test_simulation' ? 'razorpay_live' : 'test_simulation';
                setSettings({ ...settings, paymentMode: nextMode });
                storageService.saveSettings({ ...settings, paymentMode: nextMode });
                onShowToast(`Payment mode updated to ${nextMode}`, 'info');
              }}
              className="px-4 py-2 rounded-full bg-[#153D32] text-white text-xs font-semibold"
            >
              Toggle to {settings.paymentMode === 'test_simulation' ? 'Razorpay Live' : 'Test Mode'}
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#A8BDA5]/30 bg-white">
            <table className="min-w-full text-left text-xs text-stone-700">
              <thead className="bg-[#E7EFE6] text-[#153D32] font-semibold border-b border-[#A8BDA5]/20">
                <tr>
                  <th className="p-3.5">Ref ID</th>
                  <th className="p-3.5">Member</th>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8BDA5]/10">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#F8F6F0]/60">
                    <td className="p-3.5 font-mono text-[11px] text-stone-500">{pay.transactionRef}</td>
                    <td className="p-3.5 font-medium text-stone-900">{pay.userName}</td>
                    <td className="p-3.5">{pay.itemTitle}</td>
                    <td className="p-3.5 font-bold text-[#153D32]">{settings.currencySymbol}{pay.amount}</td>
                    <td className="p-3.5 uppercase text-[10px] font-semibold">{pay.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-500">{new Date(pay.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-semibold text-[#153D32]">
              {isBengali ? 'ওয়েবসাইট ব্র্যান্ডিং ও কন্টেন্ট সেটিংস' : 'Brand Identity & Website Configuration'}
            </h2>
            <p className="text-xs text-stone-500">
              {isBengali ? 'ব্র্যান্ডের নাম, হিরো ব্যানার, হোয়াটসঅ্যাপ নম্বর ও যোগাযোগের তথ্য হালনাগাদ করুন' : 'Update editable brand name, hero banner text, contact details, and bilingual copy.'}
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-6 text-xs text-stone-700">
            {/* Brand Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Brand Name (English)</label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-800 block mb-1">ব্র্যান্ড নাম (বাংলা)</label>
                <input
                  type="text"
                  value={settings.brandNameBn}
                  onChange={(e) => setSettings({ ...settings, brandNameBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
            </div>

            {/* Taglines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Tagline (English)</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-800 block mb-1">ট্যাগলাইন (বাংলা)</label>
                <input
                  type="text"
                  value={settings.taglineBn}
                  onChange={(e) => setSettings({ ...settings, taglineBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
            </div>

            {/* Hero Section Headlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#A8BDA5]/20">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Hero Main Heading (English)</label>
                <input
                  type="text"
                  value={settings.heroHeadline}
                  onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-800 block mb-1">হিরো প্রধান শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={settings.heroHeadlineBn}
                  onChange={(e) => setSettings({ ...settings, heroHeadlineBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">Hero Background Image URL</label>
              <input
                type="url"
                value={settings.heroImageUrl}
                onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 font-mono text-[11px]"
              />
            </div>

            {/* Contacts & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#A8BDA5]/20">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Business Email</label>
                <input
                  type="email"
                  value={settings.businessEmail}
                  onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Business Phone</label>
                <input
                  type="text"
                  value={settings.businessPhone}
                  onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-800 block mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold text-xs shadow-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{t.admin.actions.saveSettings}</span>
              </button>
            </div>
          </form>

          {/* Supabase Database Integration Card */}
          <div className="p-8 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-5 text-xs text-stone-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#A8BDA5]/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#153D32]">
                    {isBengali ? 'সুপাবেস (Supabase) ডেটাবেস কনফিগারেশন' : 'Supabase PostgreSQL Backend Integration'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {isBengali ? 'ক্লাউড ডেটাবেস সিঙ্ক ও পারসিস্টেন্স ম্যানেজমেন্ট' : 'Scalable PostgreSQL cloud database & authentication'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isSupabaseConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#E7EFE6] text-[#153D32]'
                }`}>
                  {isSupabaseConfigured ? '● Supabase Connected' : '● Local-First Storage Active'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F6F0] border border-[#A8BDA5]/30 text-stone-600 space-y-2">
              <p className="leading-relaxed">
                {supabaseStatus}
              </p>
              <div className="text-[11px] text-stone-500 pt-1 border-t border-[#A8BDA5]/20">
                <span>{isBengali ? 'সুপাবেস যুক্ত করতে .env ফাইলে বসান:' : 'To connect your live Supabase project, configure in .env:'}</span>
                <code className="block mt-1 font-mono text-[10px] text-[#153D32] bg-white p-2 rounded-lg border border-[#A8BDA5]/30">
                  VITE_SUPABASE_URL="https://your-project-id.supabase.co"<br/>
                  VITE_SUPABASE_ANON_KEY="your-anon-key-here"
                </code>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-stone-500">
                {isBengali 
                  ? 'সম্পূর্ণ SQL স্কিমা ও টেবিল ফাইল তৈরি করা আছে (supabase/schema.sql)।' 
                  : 'Ready-to-run PostgreSQL schema with RLS policies is prepared in supabase/schema.sql.'}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('-- Run schema from supabase/schema.sql in Supabase SQL Editor');
                  onShowToast(isBengali ? 'SQL ফাইলের নির্দেশনা কপি করা হয়েছে।' : 'SQL Schema instructions copied.', 'info');
                }}
                className="px-4 py-2 rounded-full bg-white border border-[#A8BDA5]/40 text-[#153D32] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#E7EFE6]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isBengali ? 'SQL স্কিমা নির্দেশনা' : 'Copy Schema Info'}</span>
              </button>
            </div>
          </div>

          {/* Admin Security & Password Change Card */}
          <div className="p-8 rounded-3xl bg-white border border-[#A8BDA5]/30 shadow-xs space-y-5 text-xs text-stone-700">
            <div className="flex items-center gap-3 pb-3 border-b border-[#A8BDA5]/20">
              <div className="p-2.5 rounded-xl bg-[#E7EFE6] text-[#153D32]">
                <Key className="w-5 h-5 text-[#C6A66A]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#153D32]">
                  {isBengali ? 'অ্যাডমিন পাসওয়ার্ড পরিবর্তন ও সুরক্ষা' : 'Admin Password & Security Settings'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {isBengali ? 'অ্যাডমিন প্যানেলে টাইপ করে লগইন করার গোপনীয় পাসওয়ার্ড পরিবর্তন করুন' : 'Change the master password required for entering the admin console.'}
                </p>
              </div>
            </div>

            {adminPassMessage && (
              <div className={`p-3 rounded-xl border text-xs ${
                adminPassMessage.isError
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                {adminPassMessage.text}
              </div>
            )}

            <form onSubmit={handleChangeAdminPassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    {isBengali ? 'বর্তমান পাসওয়ার্ড *' : 'Current Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={currentAdminPass}
                    onChange={(e) => setCurrentAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    {isBengali ? 'নতুন পাসওয়ার্ড *' : 'New Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    {isBengali ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm New Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0]/60 border border-[#A8BDA5]/40 text-stone-900 focus:outline-hidden focus:border-[#153D32]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#153D32] hover:bg-[#0E2922] text-[#F8F6F0] font-semibold text-xs shadow-xs flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C6A66A]" />
                  <span>{isBengali ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Admin Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Program Create/Edit Modal */}
      {editingProgram && (
        <Modal
          isOpen={programModalOpen}
          onClose={() => setProgramModalOpen(false)}
          title={editingProgram.id ? 'Edit Wellness Program' : 'Create Wellness Program'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Title (EN) *</label>
                <input
                  type="text"
                  required
                  value={editingProgram.title || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                />
              </div>
              <div>
                <label className="font-medium text-stone-700 block mb-1">শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={editingProgram.titleBn || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, titleBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Category</label>
                <select
                  value={editingProgram.category || 'lifestyle_coaching'}
                  onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value as ProgramCategory })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                >
                  <option value="lifestyle_coaching">Lifestyle Coaching</option>
                  <option value="nutrition_education">Nutrition Education</option>
                  <option value="morning_sessions">Morning Sessions</option>
                  <option value="evening_sessions">Evening Sessions</option>
                  <option value="personal_consultation">Personal Consultation</option>
                  <option value="wellness_community">Wellness Community</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-stone-700 block mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={editingProgram.price ?? 0}
                  onChange={(e) => setEditingProgram({ ...editingProgram, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Image URL</label>
              <input
                type="url"
                value={editingProgram.imageUrl || ''}
                onChange={(e) => setEditingProgram({ ...editingProgram, imageUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Description (EN)</label>
              <textarea
                rows={3}
                value={editingProgram.description || ''}
                onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-[#A8BDA5]/20">
              <button
                type="button"
                onClick={() => setProgramModalOpen(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#153D32] text-white font-semibold"
              >
                Save Program
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Event Create/Edit Modal */}
      {editingEvent && (
        <Modal
          isOpen={eventModalOpen}
          onClose={() => setEventModalOpen(false)}
          title={editingEvent.id ? 'Edit Event Schedule' : 'Schedule Wellness Event'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Event Title (EN) *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                />
              </div>
              <div>
                <label className="font-medium text-stone-700 block mb-1">ইভেন্ট শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={editingEvent.titleBn || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, titleBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-stone-700 block mb-1">Format</label>
                <select
                  value={editingEvent.format || 'online'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, format: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                >
                  <option value="online">Online Video</option>
                  <option value="in_person">In-Person Park</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-stone-700 block mb-1">Seat Capacity</label>
                <input
                  type="number"
                  value={editingEvent.capacity ?? 50}
                  onChange={(e) => setEditingEvent({ ...editingEvent, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                />
              </div>
              <div>
                <label className="font-medium text-stone-700 block mb-1">Price (₹, 0=Free)</label>
                <input
                  type="number"
                  value={editingEvent.price ?? 0}
                  onChange={(e) => setEditingEvent({ ...editingEvent, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Google Meet / Video Link (Secure)</label>
              <input
                type="url"
                value={editingEvent.meetingUrl || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, meetingUrl: e.target.value })}
                placeholder="https://meet.google.com/..."
                className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40 font-mono text-[11px]"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-[#A8BDA5]/20">
              <button
                type="button"
                onClick={() => setEventModalOpen(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#153D32] text-white font-semibold"
              >
                Save Event
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Article Create/Edit Modal */}
      {editingArticle && (
        <Modal
          isOpen={articleModalOpen}
          onClose={() => setArticleModalOpen(false)}
          title={editingArticle.id ? 'Edit Article' : 'Write Wellness Article'}
          maxWidth="xl"
        >
          <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-stone-700 block mb-1">Article Title (EN) *</label>
              <input
                type="text"
                required
                value={editingArticle.title || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Summary</label>
              <textarea
                rows={2}
                value={editingArticle.summary || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Full Article Content</label>
              <textarea
                rows={6}
                value={editingArticle.content || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#A8BDA5]/40 font-serif leading-relaxed"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-[#A8BDA5]/20">
              <button
                type="button"
                onClick={() => setArticleModalOpen(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#153D32] text-white font-semibold"
              >
                Publish Article
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
