import {
  Program,
  WellnessEvent,
  NutritionArticle,
  Testimonial,
  GalleryItem,
  ContactEnquiry,
  HabitLog,
  WebsiteSettings,
  PaymentRecord,
  Announcement,
  UserProfile,
  ProgramEnrollment,
  EventRegistration
} from '../types';
import {
  isSupabaseConfigured,
  fetchSupabaseSettings,
  saveSupabaseSettings,
  fetchSupabasePrograms,
  saveSupabaseProgram,
  deleteSupabaseProgram,
  fetchSupabaseEvents,
  saveSupabaseEvent,
  deleteSupabaseEvent,
  fetchSupabaseArticles,
  saveSupabaseArticle,
  deleteSupabaseArticle,
  fetchSupabaseGallery,
  saveSupabaseGallery,
  deleteSupabaseGallery,
  fetchSupabaseTestimonials,
  saveSupabaseTestimonial,
  deleteSupabaseTestimonial,
  fetchSupabaseEnquiries,
  syncEnquiryToSupabase,
  fetchSupabaseUsers,
  saveSupabaseUser,
  fetchSupabaseAnnouncements,
  saveSupabaseAnnouncement,
  setupSupabaseRealtime
} from './supabaseClient';

// Storage keys
const STORAGE_PREFIX = 'prana_wellness_';
const KEYS = {
  PROGRAMS: `${STORAGE_PREFIX}programs`,
  EVENTS: `${STORAGE_PREFIX}events`,
  ARTICLES: `${STORAGE_PREFIX}articles`,
  TESTIMONIALS: `${STORAGE_PREFIX}testimonials`,
  GALLERY: `${STORAGE_PREFIX}gallery`,
  ENQUIRIES: `${STORAGE_PREFIX}enquiries`,
  HABIT_LOGS: `${STORAGE_PREFIX}habit_logs`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  PAYMENTS: `${STORAGE_PREFIX}payments`,
  ANNOUNCEMENTS: `${STORAGE_PREFIX}announcements`,
  ENROLLMENTS: `${STORAGE_PREFIX}enrollments`,
  EVENT_REGS: `${STORAGE_PREFIX}event_regs`,
  USERS: `${STORAGE_PREFIX}users`,
};

// Seed Data
const initialSettings: WebsiteSettings = {
  brandName: 'Prāna Wellness',
  brandNameBn: 'প্রাণ ওয়েলনেস',
  tagline: 'Feel Better. Live Healthier. Grow Together.',
  taglineBn: 'সুস্থ থাকুন। ভালো বাঁচুন। একসাথে এগিয়ে চলুন।',
  philosophy: 'Small daily habits. Better lifestyle. A healthier future.',
  philosophyBn: 'ছোট ছোট দৈনন্দিন অভ্যাস। উন্নত জীবনধারা। একটি সুস্থ আগামী।',
  businessEmail: 'hello@pranawellness.org',
  businessPhone: '+91 98300 12345',
  businessAddress: '14/B Lake Serenity Road, Eco Wellness Sanctuary, Kolkata 700029, India',
  businessAddressBn: '১৪/বি লেক সেরেনিটি রোড, ইকো ওয়েলনেস স্যাঙ্কচুয়ারি, কলকাতা ৭০০০২৯, ভারত',
  whatsappNumber: '+919830012345',
  heroHeadline: 'Build a Healthier Life, One Habit at a Time.',
  heroHeadlineBn: 'প্রতিদিনের ছোট অভ্যাসে গড়ে তুলুন সুস্থ ও সুন্দর জীবন।',
  heroSubheadline: 'Discover a more balanced lifestyle through nutrition education, daily wellness habits, expert guidance, and a supportive community.',
  heroSubheadlineBn: 'পুষ্টি সংক্রান্ত সঠিক ধারণা, দৈনন্দিন সুষম অভ্যাস, বিশেষজ্ঞ মেন্টরশিপ এবং একটি অনুপ্রেরণামূলক কমিউনিটির মাধ্যমে উপভোগ করুন শান্তিময় জীবনধারা।',
  heroImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=80',
  currencySymbol: '₹',
  socialInstagram: 'https://instagram.com/prana.wellness.community',
  socialFacebook: 'https://facebook.com/prana.wellness.community',
  socialYouTube: 'https://youtube.com/@pranawellness',
  paymentMode: 'test_simulation',
};

const initialPrograms: Program[] = [
  {
    id: 'prog-1',
    slug: 'healthy-lifestyle-coaching',
    title: 'Daily Habit Architecture & Lifestyle Coaching',
    titleBn: 'দৈনন্দিন জীবনধারা ও সুস্থ অভ্যাস কোচিং',
    description: 'Transform your daily rhythm without burnout. Learn gentle morning pacing, mindful work-break rituals, evening wind-down habits, and long-term consistency strategies.',
    descriptionBn: 'কোনো মানসিক চাপ ছাড়াই আপনার সারাদিনের রুটিন সাজান। সকালে স্বস্তিতে দিন শুরু, কাজের ফাঁকে হালকা বিশ্রাম এবং রাতে শান্তির ঘুমের উপযোগী জীবনধারা গড়ে তুলুন।',
    category: 'lifestyle_coaching',
    categoryName: 'Lifestyle Coaching',
    categoryNameBn: 'জীবনধারা কোচিং',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1000&q=80',
    price: 1999,
    duration: '6 Weeks',
    durationBn: '৬ সপ্তাহ',
    audience: 'Busy professionals and students seeking structure without burnout',
    audienceBn: 'ব্যস্ত চাকরিজীবী ও শিক্ষার্থী যারা ক্লান্তিকর চাপ ছাড়াই সুস্থ রুটিন চান',
    features: [
      '1-on-1 Lifestyle intake assessment',
      'Daily micro-habit tracker template',
      'Weekly 45-min live group check-in',
      'Direct mentor messaging support'
    ],
    featuresBn: [
      'ব্যক্তিগত জীবনধারা পর্যালোচনা',
      'দৈনন্দিন অভ্যাস ট্র্যাকার টেমপ্লেট',
      'সাপ্তাহিক ৪৫ মিনিটের লাইভ গ্রুপ সেশন',
      'মেন্টরের সাথে সরাসরি প্রশ্নোত্তর'
    ],
    published: true,
    featured: true,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'prog-2',
    slug: 'nutrition-education-essentials',
    title: 'Whole-Food Nutrition & Mindful Eating Wisdom',
    titleBn: 'প্রাকৃতিক সুষম খাদ্য ও পুষ্টি সচেতনতা',
    description: 'Demystify food without crash diets. Learn practical meal balancing, seasonal fruit & veggie integration, smart hydration, and how to read grocery labels with clarity.',
    descriptionBn: 'কোনো ক্র্যাশ ডায়েট নয়। শিখুন সহজ ঘরোয়া খাবারের সুষম ভারসাম্য, মৌসুমি শাকসবজি ও ফলের ব্যবহার, পর্যাপ্ত পানি পান এবং সচেতন বাজার করার কৌশল।',
    category: 'nutrition_education',
    categoryName: 'Nutrition Education',
    categoryNameBn: 'পুষ্টি শিক্ষা',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80',
    price: 2499,
    duration: '4 Weeks',
    durationBn: '৪ সপ্তাহ',
    audience: 'Individuals wanting wholesome, unrestrictive food relationships',
    audienceBn: 'যারা কোনো কঠিন নিয়ম ছাড়াই স্বাভাবিক সুষম খাবারে তৃপ্তি পেতে চান',
    features: [
      'Colorful plate guidelines & recipes',
      'Hydration & digestive rhythm masterclass',
      'Grocery label reading checklist',
      'Family-friendly meal inspiration'
    ],
    featuresBn: [
      'রঙিন ও পুষ্টিকর খাবারের তালিকা ও গাইড',
      'পর্যাপ্ত পানি পান ও হজমপ্রক্রিয়ার ক্লাস',
      'খাবারের লেবেল সহজে বোঝার নির্দেশিকা',
      'পরিবারের সবার উপযোগী সুস্বাদু খাবারের রূপরেখা'
    ],
    published: true,
    featured: true,
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'prog-3',
    slug: 'morning-wellness-sessions',
    title: 'Sunrise Gentle Mobility & Mindful Breath Circle',
    titleBn: 'সকালের মৃদু স্ট্রেচিং ও শ্বাসের অনুশীলন',
    description: 'Start every morning grounded and alert. Gentle bed-to-mat mobility, joint freedom stretches, and diaphragmatic breathwork designed for all ages.',
    descriptionBn: 'সকালের স্নিগ্ধতায় দিন শুরু করুন প্রাণবন্তভাবে। হালকা স্ট্রেচিং, জয়েন্টের নমনীয়তা এবং গভীর শ্বাস-প্রশ্বাসের অনুশীলন যা শরীরের শক্তি বৃদ্ধি করে।',
    category: 'morning_sessions',
    categoryName: 'Morning Sessions',
    categoryNameBn: 'সকালের সেশন',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80',
    price: 1499,
    duration: 'Monthly Pass (Mon-Fri 7 AM)',
    durationBn: 'মাসিক পাস (সোম-শুক্র সকাল ৭টা)',
    audience: 'Anyone waking up sluggish or stiff who wants an uplifting start',
    audienceBn: 'যাদের সকালে জড়তা কাজ করে এবং যারা ফুরফুরে অনুভূতি নিয়ে দিন শুরু করতে চান',
    features: [
      '20 Live morning online sessions/month',
      'Zero gym equipment required',
      'Guided 5-minute gratitude closing',
      'Recorded replays for busy mornings'
    ],
    featuresBn: [
      'মাসে ২০টি লাইভ অনলাইন মর্নিং সেশন',
      'কোনো সরঞ্জামের প্রয়োজন নেই',
      '৫ মিনিটের কৃতজ্ঞতা প্রকাশ ও মেডিটেশন',
      'মিস হলে যেকোনো সময় রেকর্ডিং দেখার সুবিধা'
    ],
    published: true,
    featured: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'prog-4',
    slug: 'evening-wellness-sessions',
    title: 'Twilight De-Stress & Restorative Sleep Sanctuary',
    titleBn: 'সন্ধ্যার মানসিক স্বস্তি ও শান্তির ঘুমের রুটিন',
    description: 'Unload mental clutter and transition into deep, restorative sleep. Includes gentle evening relaxation, guided body scan, and blue-light detoxification coaching.',
    descriptionBn: 'সারাদিনের মানসিক ক্লান্তি দূর করে নিশ্চিন্ত ঘুমের প্রস্তুতি নিন। হালকা রিলাক্সেশন, বডি স্ক্যান এবং সঠিক সময়ে ঘুমানোর সহায়ক পরামর্শ।',
    category: 'evening_sessions',
    categoryName: 'Evening Sessions',
    categoryNameBn: 'সন্ধ্যার সেশন',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80',
    price: 1499,
    duration: 'Monthly Pass (Mon-Fri 8:30 PM)',
    durationBn: 'মাসিক পাস (সোম-শুক্র রাত ৮:৩০)',
    audience: 'People struggling with evening racing thoughts or irregular sleep',
    audienceBn: 'যাদের রাতে ঘুমাতে দেরি হয় বা মাথায় সারাদিনের কাজের চিন্তা ঘোরে',
    features: [
      'Live evening calming audio-video circles',
      'Gentle reclined stretches',
      'Circadian rhythm optimization guide',
      'Herbal tea and wind-down rituals'
    ],
    featuresBn: [
      'লাইভ সন্ধ্যার প্রশান্তিকর মাইন্ডফুলনেস ক্লাস',
      'সহজ ও আরামদায়ক রিলাক্সিং স্ট্রেচ',
      'ঘুমের ছন্দ ঠিক করার কার্যকরী গাইড',
      'ভেষজ চা ও স্ক্রিনমুক্ত রাতের সহজ অভ্যাস'
    ],
    published: true,
    featured: false,
    createdAt: '2026-01-18T08:00:00Z',
    updatedAt: '2026-01-18T08:00:00Z',
  },
  {
    id: 'prog-5',
    slug: 'personal-wellness-consultation',
    title: '1-on-1 Personal Holistic Wellness Consultation',
    titleBn: 'ব্যক্তিগত ওয়ান-অন-ওয়ান ওয়েলনেস কনসালটেশন',
    description: 'A dedicated, empathetic 60-minute consultation with a senior wellness mentor to map your unique daily schedule, eating patterns, stress levels, and realistic goals.',
    descriptionBn: 'আমাদের অভিজ্ঞ ওয়েলনেস মেন্টরের সাথে ৬০ মিনিটের একান্তে অনলাইন আলোচনা। আপনার ব্যক্তিগত ব্যস্ততা, খাদ্যাভ্যাস ও মানসিক শান্তির উপযোগী পরামর্শ নিন।',
    category: 'personal_consultation',
    categoryName: 'Personal Consultation',
    categoryNameBn: 'ব্যক্তিগত পরামর্শ',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    price: 1800,
    duration: '60 Minutes + 14-Day Followup',
    durationBn: '৬০ মিনিট + ১৪ দিনের ফলোআপ',
    audience: 'Individuals needing custom tailored lifestyle adjustments',
    audienceBn: 'যাদের ব্যক্তিগত ও একক যত্ন সহকারে পরামর্শ প্রয়োজন',
    features: [
      'Comprehensive lifestyle assessment questionnaire',
      '60-minute private video call',
      'Customized daily habit blueprint (PDF)',
      '14-day WhatsApp accountability followup'
    ],
    featuresBn: [
      'বিস্তারিত স্বাস্থ্য ও রুটিন পর্যালোচনা ফর্ম',
      '৬০ মিনিটের নিরাপদ ব্যক্তিগত ভিডিও কল',
      'আপনার জন্য কাস্টমাইজড হ্যাবিট চার্ট (PDF)',
      '১৪ দিনের হোয়াটসঅ্যাপ ফলোআপ সাপোর্ট'
    ],
    published: true,
    featured: false,
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'prog-6',
    slug: 'wellness-community-circle',
    title: 'The Prāna Circle: Monthly Community Membership',
    titleBn: 'প্রাণ সার্কেল: মাসিক কমিউনিটি মেম্বারশিপ',
    description: 'Our core community space. Access all live morning & evening circles, weekly nutrition workshops, monthly habit challenges, and an uplifting peer support forum.',
    descriptionBn: 'আমাদের মূল কমিউনিটি সদস্যপদ। সকাল ও সন্ধ্যার সকল লাইভ ক্লাস, সাপ্তাহিক পুষ্টি কর্মশালা, মাসিক অভ্যাস চ্যালেঞ্জ এবং পারস্পরিক বন্ধুত্বের মেলবন্ধন।',
    category: 'wellness_community',
    categoryName: 'Wellness Community',
    categoryNameBn: 'ওয়েলনেস কমিউনিটি',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
    price: 999,
    duration: 'Monthly Ongoing',
    durationBn: 'মাসিক চলমান',
    audience: 'Those seeking ongoing motivation, warmth, and shared growth',
    audienceBn: 'যারা প্রতিদিনের সুস্থতার জন্য একটি আন্তরিক বন্ধুদের দল চান',
    features: [
      'Unlimited access to all live sessions',
      'Private community discussion circle',
      'Monthly seasonal habit challenges with badges',
      'Exclusive member wellness resource library'
    ],
    featuresBn: [
      'সকল লাইভ ক্লাসে আনলিমিটেড অংশ নেওয়ার সুযোগ',
      'সদস্যদের ঘরোয়া আলোচনা ফোরাম',
      'মাসিক অভ্যাস চ্যালেঞ্জ ও অনুপ্রেরণা',
      'ওয়েলনেস বই ও রিসোর্স লাইব্রেরি অ্যাক্সেস'
    ],
    published: true,
    featured: true,
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-01-22T08:00:00Z',
  },
];

const initialEvents: WellnessEvent[] = [
  {
    id: 'event-1',
    title: 'Live Sunrise Awakening & Gentle Joint Mobility',
    titleBn: 'সকালের লাইভ স্নিগ্ধ স্ট্রেচিং ও শ্বাসের সেশন',
    description: 'Awaken your body with graceful, zero-impact joint rotations, gentle neck and shoulder releases, and deep diaphragmatic breathing to center your thoughts for the day.',
    descriptionBn: 'কোমল সূর্যালোকের সাথে শরীর ও মনকে সতেজ করুন। হালকা কাঁধ ও ঘাড়ের স্ট্রেচ এবং প্রশান্ত শ্বাস-প্রশ্বাসের মাধ্যমে আপনার সারাদিনের কর্মশক্তি বৃদ্ধি করুন।',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
    startAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(), // ~18 hours from now
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 19).toISOString(),
    timezone: 'IST (UTC+5:30)',
    format: 'online',
    formatBn: 'অনলাইন লাইভ (Google Meet)',
    meetingUrl: 'https://meet.google.com/pra-nawl-ses',
    hostName: 'Dr. Arundhati Roy, Wellness Mentor',
    hostRole: 'Holistic Lifestyle & Breath Guide',
    capacity: 60,
    registeredCount: 42,
    registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 17).toISOString(),
    price: 0,
    status: 'upcoming',
    tags: ['Mindfulness', 'Morning Routine', 'Gentle Movement'],
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'event-2',
    title: 'The Art of Mindful Hydration & Nourishing Soups Workshop',
    titleBn: 'সচেতন হাইড্রেশন ও ঘরোয়া পুষ্টিকর স্যুপ তৈরির কর্মশালা',
    description: 'Learn how proper cellular hydration goes beyond cold water. Discover natural electrolytes, calming warm herbal broths, and easy vegetable-infused broths.',
    descriptionBn: 'শরীরে সঠিক পানি শূন্যতা দূর করার বিজ্ঞান জানুন। কীভাবে সাধারণ ভেষজ উপাদান, মৌসুমি সবজির হালকা স্যুপ ও তাজা ফল দিয়ে শরীর আর্দ্র রাখা যায় তা হাতে-কলমে শিখুন।',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    startAt: new Date(Date.now() + 1000 * 60 * 60 * 68).toISOString(), // ~3 days from now
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 70).toISOString(),
    timezone: 'IST (UTC+5:30)',
    format: 'online',
    formatBn: 'অনলাইন লাইভ কর্মশালা',
    meetingUrl: 'https://meet.google.com/pra-soup-edu',
    hostName: 'Chef Suman Banerjee & Nutritionist Priyanjana',
    hostRole: 'Wholesome Culinary Educators',
    capacity: 40,
    registeredCount: 31,
    registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 64).toISOString(),
    price: 299,
    status: 'upcoming',
    tags: ['Nutrition', 'Cooking', 'Hydration'],
    createdAt: '2026-02-05T08:00:00Z',
  },
  {
    id: 'event-3',
    title: 'Community Weekend Mindful Nature Walk & Tea Gathering',
    titleBn: 'উইকেন্ড কমিউনিটি প্রকৃতিতে হাঁটা ও ভেষজ চা আড্ডা',
    description: 'Step away from asphalt and screens. A calm 45-minute collective walk under tree canopies followed by silent breathing and warm lemongrass tea.',
    descriptionBn: 'ক্লান্তিকর স্ক্রিন ছেড়ে মাটির ঘ্রাণ ও গাছের ছায়ায় হাঁটার অভিজ্ঞতা। ৪৫ মিনিটের নীরব পদচারণা শেষে ঘরোয়া লেমনগ্রাস ভেষজ চায়ে আড্ডা ও অভিজ্ঞতা বিনিময়।',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
    startAt: new Date(Date.now() + 1000 * 60 * 60 * 140).toISOString(), // ~6 days
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 142).toISOString(),
    timezone: 'IST (UTC+5:30)',
    format: 'in_person',
    formatBn: 'সরাসরি প্রকৃতিতে (লেক গার্ডেনস পার্ক)',
    venue: 'Rabindra Sarovar Nature Trails, Gate 3, Kolkata',
    hostName: 'Aniruddha Sen & Prāna Volunteers',
    hostRole: 'Community Naturalist & Walking Lead',
    capacity: 35,
    registeredCount: 28,
    registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 130).toISOString(),
    price: 0,
    status: 'upcoming',
    tags: ['Nature', 'Walking', 'Community'],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'event-4',
    title: 'Candlelight Evening Wind-Down & Sound Relaxation',
    titleBn: 'সন্ধ্যার মোমের আলোয় শব্দ ও শ্বাসের শিথিলতা',
    description: 'A serene transition into nighttime. Himalayan singing bowl acoustic tones paired with slow pacing to prepare your autonomic nervous system for deep sleep.',
    descriptionBn: 'তিব্বতি বাউলের মৃদু সুর এবং ধীরগতির শ্বাসের সাহায্যে মনকে স্থির করা। সারাদিনের ক্লান্তি ধুয়ে ফেলে গভীর ও স্বপ্নহীন ঘুমের জন্য নিজেকে প্রস্তুত করুন।',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80',
    startAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Past
    endAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    timezone: 'IST (UTC+5:30)',
    format: 'online',
    formatBn: 'অনলাইন লাইভ সেশন',
    meetingUrl: '',
    hostName: 'Kavita Iyer',
    hostRole: 'Meditation & Sound Guide',
    capacity: 70,
    registeredCount: 65,
    registrationDeadline: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    price: 0,
    status: 'completed',
    tags: ['Sleep', 'Sound Healing', 'Relaxation'],
    createdAt: '2026-02-02T08:00:00Z',
  }
];

const initialArticles: NutritionArticle[] = [
  {
    id: 'art-1',
    slug: 'why-daily-walking-outperforms-punishing-workouts',
    title: 'Why a Gentle 20-Minute Post-Meal Walk Outperforms Punishing Workouts',
    titleBn: 'কেন ভারী ক্লান্তিকর ব্যায়ামের চেয়ে ২০ মিনিটের হালকা হাঁটা বেশি উপকারী',
    summary: 'Discover the cellular science behind gentle postprandial walking: blood glucose modulation, cortisol reduction, and sustainable longevity without gym exhaustion.',
    summaryBn: 'খাবারের পর হালকা হাঁটার বৈজ্ঞানিক সুফল জানুন: রক্তে শর্করার ভারসাম্য, মানসিক চাপ কমানো এবং দীর্ঘমেয়াদি সুস্থতা যা কোনো জিম ছাড়াই সম্ভব।',
    content: `When people think of fitness, they frequently envision breathless exhaustion, heavy iron weights, or punishing schedules. Yet biological research in metabolic health repeatedly confirms that gentle, regular locomotion—such as an unhurried 20-minute stroll after lunch or dinner—provides superior hormonal balance and cardiovascular longevity for everyday individuals.

### The Glycemic Sweet Spot
Immediately following food consumption, your digestive tract converts carbohydrates into glucose. Rather than demanding massive spikes of insulin to sequester this energy, light muscle contractions from walking draw glucose directly from the bloodstream via non-insulin mediated pathways (GLUT4 translocation). This prevents the steep glucose crashes that trigger 3 PM fatigue and sweet cravings.

### Cortisol vs. Recovery
Aggressive workouts elevate cortisol, which in an already stressed professional or student, impairs restorative sleep. A peaceful walk in natural light lowers sympathetic nervous system activity and releases gentle endorphins that foster mental clarity.

### How to Build the Habit
1. **Never rush:** Walk at a conversational pace where you can easily breathe through your nose.
2. **Step outdoors when possible:** Natural daylight primes your circadian rhythm for restful nighttime sleep.
3. **Keep it simple:** 1,500 to 2,500 steps right after dining is all you need. Consistency beats intensity every single day.`,
    contentBn: `যখন মানুষ ফিটনেসের কথা ভাবে, তখন অনেকেই হাঁপিয়ে ওঠা ভারী ওয়ার্কআউট বা কঠিন নিয়মকানুনের কথা চিন্তা করে। কিন্তু আধুনিক চিকিৎসা বিজ্ঞান বলছে, সাধারণ মানুষের জন্য খাওয়ার পর ১৫-২০ মিনিটের এক চিলতে মনোরম হাঁটা হরমোনের ভারসাম্য ও হৃদযন্ত্রের সুরক্ষায় অনেক বেশি কার্যকর।

### রক্তের শর্করার স্বাভাবিক নিয়ন্ত্রণ
খাবার গ্রহণের পর শরীর তা শক্তিতে রূপান্তরিত করতে শুরু করে। আপনি যদি খাওয়ার পর একটানা বসে না থেকে আলতো পায়ে কিছুক্ষণ হাঁটেন, তবে পেশিগুলো অতিরিক্ত সুগার শোষণ করে নেয়। এতে অলসতা দূর হয় এবং মিষ্টি খাওয়ার তীব্র বাসনা কমে আসে।

### মানসিক প্রশান্তি ও কর্টিসল হ্রাস
কঠিন ব্যায়াম মানসিক চাপ বাড়াতে পারে। অন্যদিকে প্রকৃতির মাঝে ধীরেসুস্থে হাঁটা কর্টিসল হরমোন কমায় এবং রাতে চমৎকার ঘুমের পথ সুগম করে।

### কীভাবে অভ্যাসটি গড়ে তুলবেন?
১. কোনো তাড়াহুড়ো নয়—স্বাভাবিকভাবে বুক ভরে শ্বাস নিতে নিতে হাঁটুন।
২. সম্ভব হলে সকালের বা বিকেলের উন্মুক্ত আলো-বাতাসে সময় কাটান।
৩. তীব্রতার চেয়ে প্রতিদিনের ধারাবাহিকতাই দীর্ঘায়ুর মূল চাবিকাঠি।`,
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
    category: 'movement',
    categoryBn: 'সহজ হাঁটাচলা',
    author: 'Dr. Arundhati Roy',
    readTime: '4 min',
    published: true,
    publishedAt: '2026-01-28T09:00:00Z',
  },
  {
    id: 'art-2',
    slug: 'the-colorful-plate-natural-nutrition-without-deprivation',
    title: 'The Colorful Plate: Whole-Food Nourishment Without Deprivation',
    titleBn: 'রঙিন থালার পুষ্টি: কোনো বঞ্চিত না করে সুষম ঘরোয়া খাবার',
    summary: 'Forget calorie spreadsheets. Learn how embracing vibrant natural pigments—greens, purples, oranges, and deep reds—naturally guarantees micronutrient variety.',
    summaryBn: 'ক্যালোরি গোনার মানসিক যন্ত্রণা ভুলে যান। জানুন কীভাবে থালায় বিভিন্ন রঙের প্রাকৃতিক সবজি, ডাল ও ফল রেখে শরীরকে ভরিয়ে তোলা যায় অফুরন্ত প্রাণশক্তিতে।',
    content: `True nutrition is not about subtraction; it is about vibrant addition. Restrictive diets often leave people irritable, nutritionally depleted, and obsessed with food. At Prāna Wellness, we teach the joyful concept of the "Chromatographic Plate."

### What the Colors Tell Us
- **Deep Greens (Spinach, Moringa, Methi):** Abundant in magnesium, chlorophyll, and folate, supporting gentle liver detox and muscle relaxation.
- **Warm Oranges & Yellows (Papaya, Carrots, Turmeric):** Packed with beta-carotene and polyphenols that guard skin cells and strengthen immunity.
- **Rich Purples & Reds (Beets, Pomegranate, Red Cabbage):** High in anthocyanins and natural nitrates that enhance gentle blood circulation.
- **Earthy Whites & Browns (Lentils, Garlic, Sesame, Whole Grains):** Fuel your microbiome with fermentable fibers and essential prebiotics.

### The Gentle Transition Rule
Instead of outlawing your favorite traditional dishes, simply ask: *"What color can I add to this meal today?"* A squeeze of fresh lime, a handful of coriander leaves, or a cup of sliced cucumber immediately transforms ordinary food into cellular medicine.`,
    contentBn: `সঠিক পুষ্টি মানে নিজেকে প্রিয় খাবার থেকে বঞ্চিত করা নয়; বরং খাবারে বৈচিত্র্য ও ভালোবাসার স্পর্শ যোগ করা।

### রঙের পেছনের রহস্য
- **গাঢ় সবুজ (পালং, সজনে শাক, মেথি):** ম্যাগনেসিয়াম ও ক্লোরোফিলে সমৃদ্ধ, যা পেশি শিথিল করতে এবং হজম ভালো রাখতে অতুলনীয়।
- **উজ্জ্বল হলুদ ও কমলা (পেঁপে, গাজর, হলুদ):** বিটা-ক্যারোটিন সমৃদ্ধ, যা চোখের জ্যোতি ও ত্বকের সতেজতা বাড়ায়।
- **লাল ও বেগুনি (বিট, ডালিম, লাল বাঁধাকপি):** রক্ত সঞ্চালন উন্নত করে এবং ক্লান্তি দূর করতে সহায়ক।
- **সাদা ও বাদামি (ডাল, রসুন, তিল, লাল চাল):** অন্ত্রের উপকারী ব্যাকটেরিয়ার জন্য প্রয়োজনীয় ফাইবার সরবরাহ করে।

### শুরু করার সহজ উপায়
আজ থেকেই কোনো খাবার বাদ না দিয়ে নিজেকে প্রশ্ন করুন: *"আজকের থালায় আমি আর কোন রঙিন প্রাকৃতিক খাবার যোগ করতে পারি?"* এক টুকরো শসা বা সামান্য ধনেপাতা দিয়েই শুরু হোক আপনার পরিবর্তন।`,
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80',
    category: 'nutrition',
    categoryBn: 'পুষ্টি ও খাদ্যাভ্যাস',
    author: 'Priyanjana Sen, Nutritionist',
    readTime: '5 min',
    published: true,
    publishedAt: '2026-02-04T10:00:00Z',
  },
  {
    id: 'art-3',
    slug: 'the-gentle-sleep-sanctuary-reclaiming-restorative-nights',
    title: 'The Sleep Sanctuary: How to Calm an Overactive Mind Before Bed',
    titleBn: 'শান্তিময় ঘুমের প্রস্তুতি: ঘুমানোর আগে অস্থির মনকে শান্ত করার উপায়',
    summary: 'A step-by-step evening ritual to ease nervous system stimulation, reduce blue light overload, and drift into deep, healing slumber naturally.',
    summaryBn: 'রাতের উত্তেজনা ও উদ্বেগ কমিয়ে আনার একটি সহজ রুটিন। নীল আলোর প্রভাব থেকে চোখকে বাঁচিয়ে কীভাবে গভীর ও শান্ত ঘুমের জগতে প্রবেশ করবেন।',
    content: `Quality sleep is not a switch you flip at 11 PM; it is the culmination of gentle cues provided throughout your evening. In a culture saturated with late-night emails and infinite scrolling, our nervous systems remain trapped in high alert.

### The 3-2-1 Wind-Down Protocol
- **3 Hours Before Bed:** Finish heavy dinners. Digesting a large meal elevates core body temperature, which directly interferes with deep slow-wave sleep.
- **2 Hours Before Bed:** Switch from harsh overhead white lights to soft, warm lamp light. This signals your pineal gland to initiate natural melatonin secretion.
- **1 Hour Before Bed:** Place phones outside the bedroom or into sleep mode. Replace scrolling with 5 pages of relaxing reading, a warm cup of chamomile or tulsi tea, and gentle shoulder stretches.

Honor your rest as sacred. Sleep is your body's nightly repair clinic, and you deserve to wake up restored.`,
    contentBn: `ঘুম কোনো সুইচ নয় যে রাত ১১টায় চাপ দিলেই সাথে সাথে চলে আসবে। এটি একটি ধারাবাহিক প্রক্রিয়ার ফলাফল।

### ৩-২-১ সান্ধ্যকালীন নিয়ম
- **ঘুমের ৩ ঘণ্টা আগে:** রাতের ভারি খাবার শেষ করুন। এতে পাকস্থলী বিশ্রাম পাবে এবং শরীরের তাপমাত্রা ঠিক থাকবে।
- **ঘুমের ২ ঘণ্টা আগে:** ঘরের উজ্জ্বল সাদা বাতি বন্ধ করে হালকা উষ্ণ আলো জ্বালান। এটি মেলাটোনিন হরমোন নিঃসরণে সাহায্য করে।
- **ঘুমের ১ ঘণ্টা আগে:** মোবাইল স্ক্রিন থেকে দূরে থাকুন। এর পরিবর্তে কোনো ভালো বইয়ের কয়েকটি পাতা পড়ুন অথবা হালকা গরম তুলসী চা পান করুন।

ঘুম হলো আপনার শরীরের প্রাকৃতিক আরোগ্যশালা। শান্ত ঘুমের আনন্দ নিজের জীবনে ফিরিয়ে আনুন।`,
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80',
    category: 'mindfulness',
    categoryBn: 'মাইন্ডফুলনেস ও ঘুম',
    author: 'Kavita Iyer',
    readTime: '3 min',
    published: true,
    publishedAt: '2026-02-08T11:00:00Z',
  },
  {
    id: 'art-4',
    slug: 'the-power-of-micro-habits-for-sustainable-health',
    title: 'The Power of Micro-Habits: Why 1% Better Every Day Beats Overnight Overhauls',
    titleBn: 'মাইক্রো-হ্যাবিটের শক্তি: রাতারাতি পরিবর্তনের চেয়ে প্রতিদিনের ১% উন্নতি কেন সেরা',
    summary: 'Why monumental health resolutions always collapse by February, and how anchoring tiny 2-minute rituals creates lifelong sustainable transformation.',
    summaryBn: 'কেন কঠোর প্রতিজ্ঞা কয়েক দিনেই ভেঙে যায়, এবং কীভাবে মাত্র ২ মিনিটের ক্ষুদ্র অভ্যাস আজীবন সুস্থতার সবচেয়ে বড় ভিত্তি হয়ে দাঁড়ায়।',
    content: `Whenever people decide to get healthy, they try to change everything in 24 hours: overhaul their pantry, wake up at 4:30 AM, and attempt extreme workouts. By day twelve, willpower evaporates, leaving guilt in its wake.

### Habit Anchoring
The secret to permanent wellness is lowering the threshold of effort so low that you cannot say no. 
- Drink one glass of room-temperature water while your morning kettle boils.
- Do 3 mindful breaths every time you wash your hands.
- Put your walking shoes near the front door before going to sleep.

When these micro-actions become automatic, they create an identity shift: you begin to see yourself as someone who naturally honors their body.`,
    contentBn: `অধিকাংশ মানুষ যখন সুস্থ হওয়ার সিদ্ধান্ত নেন, তখন তারা সব কিছু একসাথে বদলে ফেলতে চান। ফলাফল হয় চরম ক্লান্তি এবং অচিরেই ফিরে যাওয়া পুরনো নিয়মে।

### হ্যাবিট অ্যাঙ্করিং বা অভ্যাসের নোঙর
স্থায়ী সুস্থতার রহস্য হলো পরিবর্তনের আকার এতটাই ছোট রাখা যাতে মস্তিষ্ক কোনো প্রতিরোধ না গড়ে তোলে।
- সকালে ঘুম থেকে উঠে বিছানা ছাড়ার আগেই এক গ্লাস পানি পান করুন।
- দিনে কয়েকবার গভীর নিঃশ্বাস নিয়ে শরীরকে শিথিল রাখুন।
- রাতে জুতো জোড়া দরজার কাছে রেখে ঘুমান যাতে সকালে হাঁটতে যাওয়ার কথা মনে পড়ে।

এই ক্ষুদ্র অভ্যাসগুলোই একদিন আপনাকে নিয়ে যাবে আপনার স্বপ্নের সুস্থ জীবনে।`,
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1000&q=80',
    category: 'habits',
    categoryBn: 'সুস্থ অভ্যাস',
    author: 'Dr. Arundhati Roy',
    readTime: '4 min',
    published: true,
    publishedAt: '2026-02-12T14:00:00Z',
  }
];

const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    authorName: 'Sharmistha Mukherjee',
    authorLocation: 'Kolkata, WB',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    quote: 'Prāna Wellness changed how I view health completely. As a busy school teacher, aggressive gym workouts always left me injured and exhausted. Here, the emphasis on morning gentle stretching, eating colorful seasonal veggies, and breathing has given me more sustained energy than I have felt in a decade.',
    quoteBn: 'প্রাণ ওয়েলনেস আমার স্বাস্থ্য ভাবনাই বদলে দিয়েছে। একজন শিক্ষক হিসেবে ভারী জিম আমাকে ক্লান্ত করে তুলত। এখানে সকালের স্নিগ্ধ স্ট্রেচিং, রঙিন শাকসবজির নিয়ম এবং শ্বাসের অনুশীলনে আমি আমার পুরনো সজীবতা ফিরে পেয়েছি।',
    programTaken: 'Daily Habit Architecture & Morning Sessions',
    rating: 5,
    approved: true,
    isPlaceholder: true,
    createdAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'test-2',
    authorName: 'Debabrata Chatterjee',
    authorLocation: 'Salt Lake, Kolkata',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'I used to struggle with 2 AM insomnia and stress-eating after long software shifts. The evening wind-down circles and the 20-minute post-dinner walk habit fixed my sleep without any pills. The community members are wonderfully supportive!',
    quoteBn: 'সফটওয়্যার চাকরির মানসিক চাপে রাত জেগে থাকা আর উল্টোপাল্টা খাওয়া আমার নিত্যদিনের সমস্যা ছিল। সন্ধ্যার শান্তিময় ক্লাস এবং খাওয়ার পর ২০ মিনিট হাঁটার নিয়ম আমার ঘুমে দারুণ শান্তি এনে দিয়েছে।',
    programTaken: 'Twilight De-Stress & Nutrition Wisdom',
    rating: 5,
    approved: true,
    isPlaceholder: true,
    createdAt: '2026-01-24T08:00:00Z',
  },
  {
    id: 'test-3',
    authorName: 'Ananya Bhattacharya',
    authorLocation: 'Howrah, WB',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'There is zero judgment here. No body-shaming, no crazy supplement pushing. Just kind people helping each other drink enough water, eat wholesome meals, and enjoy a peaceful morning walk.',
    quoteBn: 'এখানে কোনো লোকদেখানো বা চেহারা নিয়ে কটূক্তি নেই। কোনো অবাস্তব সাপ্লিমেন্ট বিক্রির চেষ্টা নেই। শুধু একদল আন্তরিক মানুষ যারা প্রতিদিন একে অপরকে সুস্থ থাকার অনুপ্রেরণা জোগায়।',
    programTaken: 'The Prāna Circle: Monthly Membership',
    rating: 5,
    approved: true,
    isPlaceholder: true,
    createdAt: '2026-02-01T08:00:00Z',
  }
];

const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Sunrise Breath & Gentle Movement Circle',
    titleBn: 'সকালের মৃদু স্ট্রেচিং ও প্রাণায়াম সেশন',
    category: 'movement',
    categoryBn: 'সহজ হাঁটাচলা',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80',
    caption: 'Beginning the day under warm morning rays with gentle shoulder and spine mobility.',
    captionBn: 'কোমল সূর্যালোকের সাথে কাঁধ ও মেরুদণ্ডের স্নিগ্ধ নমনীয়তা দিয়ে দিনের সূচনা।',
    altText: 'Person doing gentle morning stretching in peaceful natural light',
    uploadedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'gal-2',
    title: 'Vibrant Whole-Food Meal Preparation Workshop',
    titleBn: 'রঙিন প্রাকৃতিক খাবারের কর্মশালা',
    category: 'nutrition',
    categoryBn: 'পুষ্টি ও খাদ্য',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80',
    caption: 'Members discovering the joy of seasonal fruits, herbs, and vibrant salads.',
    captionBn: 'মৌসুমি ফলমূল, ভেষজ উপাদান ও রঙিন সালাদের সঠিক পুষ্টিমান জানার মুহূর্ত।',
    altText: 'Assortment of vibrant fresh vegetables, fruits and whole grains',
    uploadedAt: '2026-01-18T08:00:00Z',
  },
  {
    id: 'gal-3',
    title: 'Lakeside Community Walking & Nature Bathing',
    titleBn: 'লেক সাইডে কমিউনিটি হাঁটার স্নিগ্ধ মুহূর্ত',
    category: 'nature',
    categoryBn: 'প্রকৃতি',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80',
    caption: 'Reconnecting with fresh air, earth, and tranquil canopy pathways.',
    captionBn: 'সবুজ গাছপালার ছায়ায় নির্মল বাতাস উপভোগ করার যৌথ অভিজ্ঞতা।',
    altText: 'Peaceful walking path bordered by lush green trees',
    uploadedAt: '2026-01-22T08:00:00Z',
  },
  {
    id: 'gal-4',
    title: 'Herbal Infusion & Tea Mindful Circle',
    titleBn: 'ভেষজ চা ও মেডিটেশন আড্ডা',
    category: 'community',
    categoryBn: 'কমিউনিটি',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
    caption: 'Sharing stories over freshly brewed lemongrass and tulsi herbal infusions.',
    captionBn: 'লেমনগ্রাস ও তুলসীর সুবাসে বন্ধুদের সাথে আন্তরিক গল্প ও অনুভূতি প্রকাশ।',
    altText: 'Ceramic cups with warm herbal tea on wooden table surrounded by leaves',
    uploadedAt: '2026-01-25T08:00:00Z',
  },
  {
    id: 'gal-5',
    title: 'Evening Candlelight Relaxation Sanctuary',
    titleBn: 'সন্ধ্যার মোমের আলোয় মানসিক প্রশান্তি',
    category: 'workshops',
    categoryBn: 'ওয়ার্কশপ',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80',
    caption: 'Unwinding after sunset to release accumulated stress and prepare for restful sleep.',
    captionBn: 'সূর্যাস্তের পর সারাদিনের ক্লান্তি দূর করে গভীর ঘুমের প্রস্তুতি।',
    altText: 'Warm soft candlelight reflecting on wooden floors in a calm studio',
    uploadedAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'gal-6',
    title: 'Mindful Morning Outdoor Gathering',
    titleBn: 'সকালের স্নিগ্ধ উন্মুক্ত সমাবেশ',
    category: 'nature',
    categoryBn: 'প্রকৃতি',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
    caption: 'Breathing with the morning horizon and feeling the earth beneath our feet.',
    captionBn: 'সকালের দিগন্তের সাথে বুকভরে শ্বাস নেওয়া এবং মাটির স্পর্শ অনুভব করা।',
    altText: 'Woman sitting peacefully in meditation facing a sunny mountain lake',
    uploadedAt: '2026-02-05T08:00:00Z',
  }
];

const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Spring 21-Day Habit Challenge is Now Open!',
    titleBn: 'আমাদের নতুন ২১ দিনের সুস্থ অভ্যাস চ্যালেঞ্জ শুরু হচ্ছে!',
    content: 'Join our friendly community challenge focusing on morning water hydration, 20-min walks, and evening gratitude. Completely free for all members.',
    contentBn: 'সকালে পর্যাপ্ত পানি পান, হালকা হাঁটা এবং মন শান্ত করার ২১ দিনের ফ্রি চ্যালেঞ্জে যোগ দিন। সকল সদস্যের জন্য উন্মুক্ত।',
    level: 'highlight',
    createdAt: '2026-02-10T08:00:00Z',
  }
];

// Helper to read and write localStorage safely with Supabase Cloud Sync
class StorageService {
  private listeners: Map<string, Set<() => void>> = new Map();
  private hasInitializedCloud = false;

  constructor() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.initCloudSync();
      }, 50);
    }
  }

  public async initCloudSync(): Promise<void> {
    if (this.hasInitializedCloud || !isSupabaseConfigured) return;
    this.hasInitializedCloud = true;

    await this.pullAllFromCloud();

    setupSupabaseRealtime((table) => {
      this.handleCloudTableUpdate(table);
    });
  }

  public async pullAllFromCloud(): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      // 1. Settings
      const cloudSettings = await fetchSupabaseSettings();
      if (cloudSettings) {
        this.set(KEYS.SETTINGS, cloudSettings);
      } else {
        const localSettings = this.getSettings();
        await saveSupabaseSettings(localSettings);
      }

      // 2. Programs
      const cloudPrograms = await fetchSupabasePrograms();
      if (cloudPrograms && cloudPrograms.length > 0) {
        this.set(KEYS.PROGRAMS, cloudPrograms);
      } else if (cloudPrograms && cloudPrograms.length === 0) {
        for (const p of this.getPrograms()) {
          await saveSupabaseProgram(p);
        }
      }

      // 3. Events
      const cloudEvents = await fetchSupabaseEvents();
      if (cloudEvents && cloudEvents.length > 0) {
        this.set(KEYS.EVENTS, cloudEvents);
      } else if (cloudEvents && cloudEvents.length === 0) {
        for (const ev of this.getEvents()) {
          await saveSupabaseEvent(ev);
        }
      }

      // 4. Articles
      const cloudArticles = await fetchSupabaseArticles();
      if (cloudArticles && cloudArticles.length > 0) {
        this.set(KEYS.ARTICLES, cloudArticles);
      } else if (cloudArticles && cloudArticles.length === 0) {
        for (const art of this.getArticles()) {
          await saveSupabaseArticle(art);
        }
      }

      // 5. Gallery
      const cloudGallery = await fetchSupabaseGallery();
      if (cloudGallery && cloudGallery.length > 0) {
        this.set(KEYS.GALLERY, cloudGallery);
      } else if (cloudGallery && cloudGallery.length === 0) {
        for (const item of this.getGallery()) {
          await saveSupabaseGallery(item);
        }
      }

      // 6. Testimonials
      const cloudTestimonials = await fetchSupabaseTestimonials();
      if (cloudTestimonials && cloudTestimonials.length > 0) {
        this.set(KEYS.TESTIMONIALS, cloudTestimonials);
      }

      // 7. Enquiries
      const cloudEnquiries = await fetchSupabaseEnquiries();
      if (cloudEnquiries && cloudEnquiries.length > 0) {
        this.set(KEYS.ENQUIRIES, cloudEnquiries);
      }

      // 8. Announcements
      const cloudAnn = await fetchSupabaseAnnouncements();
      if (cloudAnn && cloudAnn.length > 0) {
        this.set(KEYS.ANNOUNCEMENTS, cloudAnn);
      }

      // 9. Users
      const cloudUsers = await fetchSupabaseUsers();
      if (cloudUsers && cloudUsers.length > 0) {
        this.set(KEYS.USERS, cloudUsers);
        const admin = cloudUsers.find(u => u.email.toLowerCase() === 'tanmoydari4@gmail.com');
        const passTag = admin?.interests?.find((i: string) => typeof i === 'string' && i.startsWith('__admin_pass_v1:'));
        if (passTag) {
          const pass = passTag.replace('__admin_pass_v1:', '').trim();
          if (pass) {
            localStorage.setItem('prana_wellness_admin_pass', pass);
          }
        }
      }
    } catch (err) {
      console.warn('Error syncing from Supabase Cloud:', err);
    }
  }

  private async handleCloudTableUpdate(table: string): Promise<void> {
    try {
      if (table === 'settings') {
        const res = await fetchSupabaseSettings();
        if (res) this.set(KEYS.SETTINGS, res);
      } else if (table === 'programs') {
        const res = await fetchSupabasePrograms();
        if (res) this.set(KEYS.PROGRAMS, res);
      } else if (table === 'events') {
        const res = await fetchSupabaseEvents();
        if (res) this.set(KEYS.EVENTS, res);
      } else if (table === 'articles') {
        const res = await fetchSupabaseArticles();
        if (res) this.set(KEYS.ARTICLES, res);
      } else if (table === 'gallery') {
        const res = await fetchSupabaseGallery();
        if (res) this.set(KEYS.GALLERY, res);
      } else if (table === 'testimonials') {
        const res = await fetchSupabaseTestimonials();
        if (res) this.set(KEYS.TESTIMONIALS, res);
      } else if (table === 'enquiries') {
        const res = await fetchSupabaseEnquiries();
        if (res) this.set(KEYS.ENQUIRIES, res);
      } else if (table === 'announcements') {
        const res = await fetchSupabaseAnnouncements();
        if (res) this.set(KEYS.ANNOUNCEMENTS, res);
      } else if (table === 'users') {
        const res = await fetchSupabaseUsers();
        if (res && res.length > 0) {
          this.set(KEYS.USERS, res);
          const admin = res.find(u => u.email.toLowerCase() === 'tanmoydari4@gmail.com');
          const passTag = admin?.interests?.find((i: string) => typeof i === 'string' && i.startsWith('__admin_pass_v1:'));
          if (passTag) {
            const pass = passTag.replace('__admin_pass_v1:', '').trim();
            if (pass) {
              localStorage.setItem('prana_wellness_admin_pass', pass);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error handling realtime table update:', e);
    }
  }

  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(`Error reading ${key}:`, e);
    }
    return fallback;
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify(key);
    } catch (e) {
      console.warn(`Error writing ${key}:`, e);
    }
  }

  public subscribe(key: string, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  private notify(key: string) {
    this.listeners.get(key)?.forEach(cb => cb());
  }

  // --- SETTINGS ---
  public getSettings(): WebsiteSettings {
    return this.get<WebsiteSettings>(KEYS.SETTINGS, initialSettings);
  }
  public saveSettings(settings: WebsiteSettings): void {
    this.set(KEYS.SETTINGS, settings);
    saveSupabaseSettings(settings).catch(e => console.warn('Supabase settings sync error:', e));
  }

  // --- PROGRAMS ---
  public getPrograms(): Program[] {
    return this.get<Program[]>(KEYS.PROGRAMS, initialPrograms);
  }
  public saveProgram(program: Program): void {
    const list = this.getPrograms();
    const idx = list.findIndex(p => p.id === program.id);
    if (idx >= 0) {
      list[idx] = { ...program, updatedAt: new Date().toISOString() };
    } else {
      list.push(program);
    }
    this.set(KEYS.PROGRAMS, list);
    saveSupabaseProgram(program).catch(e => console.warn('Supabase program sync error:', e));
  }
  public deleteProgram(id: string): void {
    const list = this.getPrograms().filter(p => p.id !== id);
    this.set(KEYS.PROGRAMS, list);
    deleteSupabaseProgram(id).catch(e => console.warn('Supabase program delete error:', e));
  }

  // --- EVENTS ---
  public getEvents(): WellnessEvent[] {
    return this.get<WellnessEvent[]>(KEYS.EVENTS, initialEvents);
  }
  public saveEvent(event: WellnessEvent): void {
    const list = this.getEvents();
    const idx = list.findIndex(e => e.id === event.id);
    if (idx >= 0) {
      list[idx] = event;
    } else {
      list.push(event);
    }
    this.set(KEYS.EVENTS, list);
    saveSupabaseEvent(event).catch(e => console.warn('Supabase event sync error:', e));
  }
  public deleteEvent(id: string): void {
    const list = this.getEvents().filter(e => e.id !== id);
    this.set(KEYS.EVENTS, list);
    deleteSupabaseEvent(id).catch(e => console.warn('Supabase event delete error:', e));
  }

  // --- ARTICLES ---
  public getArticles(): NutritionArticle[] {
    return this.get<NutritionArticle[]>(KEYS.ARTICLES, initialArticles);
  }
  public saveArticle(article: NutritionArticle): void {
    const list = this.getArticles();
    const idx = list.findIndex(a => a.id === article.id);
    if (idx >= 0) {
      list[idx] = article;
    } else {
      list.push(article);
    }
    this.set(KEYS.ARTICLES, list);
    saveSupabaseArticle(article).catch(e => console.warn('Supabase article sync error:', e));
  }
  public deleteArticle(id: string): void {
    const list = this.getArticles().filter(a => a.id !== id);
    this.set(KEYS.ARTICLES, list);
    deleteSupabaseArticle(id).catch(e => console.warn('Supabase article delete error:', e));
  }

  // --- TESTIMONIALS ---
  public getTestimonials(approvedOnly = true): Testimonial[] {
    const list = this.get<Testimonial[]>(KEYS.TESTIMONIALS, initialTestimonials);
    if (approvedOnly) {
      return list.filter(t => t.approved);
    }
    return list;
  }
  public addTestimonial(testimonial: Testimonial): void {
    const list = this.get<Testimonial[]>(KEYS.TESTIMONIALS, initialTestimonials);
    list.unshift(testimonial);
    this.set(KEYS.TESTIMONIALS, list);
    saveSupabaseTestimonial(testimonial).catch(e => console.warn('Supabase testimonial sync error:', e));
  }
  public updateTestimonialStatus(id: string, approved: boolean): void {
    const list = this.get<Testimonial[]>(KEYS.TESTIMONIALS, initialTestimonials);
    const item = list.find(t => t.id === id);
    if (item) {
      item.approved = approved;
      this.set(KEYS.TESTIMONIALS, list);
      saveSupabaseTestimonial(item).catch(e => console.warn('Supabase testimonial sync error:', e));
    }
  }
  public deleteTestimonial(id: string): void {
    const list = this.get<Testimonial[]>(KEYS.TESTIMONIALS, initialTestimonials).filter(t => t.id !== id);
    this.set(KEYS.TESTIMONIALS, list);
    deleteSupabaseTestimonial(id).catch(e => console.warn('Supabase testimonial delete error:', e));
  }

  // --- GALLERY ---
  public getGallery(): GalleryItem[] {
    return this.get<GalleryItem[]>(KEYS.GALLERY, initialGallery);
  }
  public saveGalleryItem(item: GalleryItem): void {
    const list = this.getGallery();
    const idx = list.findIndex(g => g.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    this.set(KEYS.GALLERY, list);
    saveSupabaseGallery(item).catch(e => console.warn('Supabase gallery sync error:', e));
  }
  public deleteGalleryItem(id: string): void {
    const list = this.getGallery().filter(g => g.id !== id);
    this.set(KEYS.GALLERY, list);
    deleteSupabaseGallery(id).catch(e => console.warn('Supabase gallery delete error:', e));
  }

  // --- ENQUIRIES ---
  public getEnquiries(): ContactEnquiry[] {
    return this.get<ContactEnquiry[]>(KEYS.ENQUIRIES, []);
  }
  public addEnquiry(enquiry: ContactEnquiry): void {
    const list = this.getEnquiries();
    list.unshift(enquiry);
    this.set(KEYS.ENQUIRIES, list);
    syncEnquiryToSupabase(enquiry).catch(() => {});
  }
  public updateEnquiryStatus(id: string, status: ContactEnquiry['status']): void {
    const list = this.getEnquiries();
    const item = list.find(e => e.id === id);
    if (item) {
      item.status = status;
      this.set(KEYS.ENQUIRIES, list);
    }
  }
  public deleteEnquiry(id: string): void {
    const list = this.getEnquiries().filter(e => e.id !== id);
    this.set(KEYS.ENQUIRIES, list);
  }

  // --- HABIT LOGS ---
  public getHabitLogs(userId: string): HabitLog[] {
    const all = this.get<HabitLog[]>(KEYS.HABIT_LOGS, []);
    return all.filter(h => h.userId === userId);
  }
  public getTodayHabitLog(userId: string): HabitLog {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getHabitLogs(userId);
    const existing = logs.find(h => h.date === today);
    if (existing) return existing;
    const newLog: HabitLog = {
      id: `habit-${userId}-${today}`,
      userId,
      date: today,
      walkCompleted: false,
      routineFollowed: false,
      mindfulnessDone: false,
      sleepScheduleFollowed: false,
      hydrationGoalMet: false,
      updatedAt: new Date().toISOString()
    };
    return newLog;
  }
  public saveHabitLog(log: HabitLog): void {
    const all = this.get<HabitLog[]>(KEYS.HABIT_LOGS, []);
    const idx = all.findIndex(h => h.userId === log.userId && h.date === log.date);
    if (idx >= 0) {
      all[idx] = { ...log, updatedAt: new Date().toISOString() };
    } else {
      all.push({ ...log, updatedAt: new Date().toISOString() });
    }
    this.set(KEYS.HABIT_LOGS, all);
  }

  // --- ENROLLMENTS ---
  public getEnrollments(userId?: string): ProgramEnrollment[] {
    const all = this.get<ProgramEnrollment[]>(KEYS.ENROLLMENTS, []);
    if (userId) return all.filter(e => e.userId === userId);
    return all;
  }
  public addEnrollment(enrollment: ProgramEnrollment): void {
    const all = this.getEnrollments();
    all.unshift(enrollment);
    this.set(KEYS.ENROLLMENTS, all);
  }

  // --- EVENT REGISTRATIONS ---
  public getEventRegistrations(userId?: string): EventRegistration[] {
    const all = this.get<EventRegistration[]>(KEYS.EVENT_REGS, []);
    if (userId) return all.filter(r => r.userId === userId);
    return all;
  }
  public addEventRegistration(reg: EventRegistration): void {
    const all = this.getEventRegistrations();
    if (!all.some(r => r.userId === reg.userId && r.eventId === reg.eventId)) {
      all.unshift(reg);
      this.set(KEYS.EVENT_REGS, all);
      // Increment event count
      const events = this.getEvents();
      const ev = events.find(e => e.id === reg.eventId);
      if (ev) {
        ev.registeredCount += 1;
        this.saveEvent(ev);
      }
    }
  }

  // --- PAYMENTS ---
  public getPayments(userId?: string): PaymentRecord[] {
    const all = this.get<PaymentRecord[]>(KEYS.PAYMENTS, []);
    if (userId) return all.filter(p => p.userId === userId);
    return all;
  }
  public addPayment(payment: PaymentRecord): void {
    const all = this.getPayments();
    all.unshift(payment);
    this.set(KEYS.PAYMENTS, all);
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(): Announcement[] {
    return this.get<Announcement[]>(KEYS.ANNOUNCEMENTS, initialAnnouncements);
  }
  public saveAnnouncement(ann: Announcement): void {
    const list = this.getAnnouncements();
    list.unshift(ann);
    this.set(KEYS.ANNOUNCEMENTS, list);
    saveSupabaseAnnouncement(ann).catch(e => console.warn('Supabase announcement sync error:', e));
  }

  // --- USERS ---
  public getUsers(): UserProfile[] {
    return this.get<UserProfile[]>(KEYS.USERS, [
      {
        uid: 'user-admin-1',
        fullName: 'Tanmoy Dari (Community Founder)',
        email: 'tanmoydari4@gmail.com',
        mobile: '+91 98300 12345',
        preferredLanguage: 'en',
        interests: ['Healthy Lifestyle Coaching', 'Mindful Walking', 'Nutrition Education'],
        role: 'admin',
        membershipStatus: 'active',
        wellnessGoals: 'Fostering a loving, non-commercial fitness and wellness lifestyle community across India and beyond.',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        uid: 'user-member-demo',
        fullName: 'Sourav Ganguly',
        email: 'member@pranawellness.org',
        mobile: '+91 98765 43210',
        preferredLanguage: 'bn',
        interests: ['Morning Sessions', 'Nutrition Education'],
        role: 'member',
        membershipStatus: 'active',
        wellnessGoals: 'Establish a solid 20-minute morning stretching routine and eat more colorful natural meals.',
        createdAt: '2026-01-15T00:00:00Z',
        updatedAt: '2026-01-15T00:00:00Z',
      }
    ]);
  }
  public saveUser(user: UserProfile): void {
    const list = this.getUsers();
    const idx = list.findIndex(u => u.uid === user.uid);
    if (idx >= 0) {
      list[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      list.push(user);
    }
    this.set(KEYS.USERS, list);
    saveSupabaseUser(user).catch(e => console.warn('Supabase user sync error:', e));
  }
}

export const storageService = new StorageService();
export { KEYS };
