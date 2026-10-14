export type Language = 'en' | 'bn';

export type UserRole = 'member' | 'admin';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  mobile: string;
  preferredLanguage: Language;
  interests: string[];
  role: UserRole;
  membershipStatus: 'active' | 'pending' | 'suspended';
  avatarUrl?: string;
  wellnessGoals?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProgramCategory = 
  | 'lifestyle_coaching'
  | 'nutrition_education'
  | 'morning_sessions'
  | 'evening_sessions'
  | 'personal_consultation'
  | 'wellness_community';

export interface Program {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  category: ProgramCategory;
  categoryName: string;
  categoryNameBn: string;
  imageUrl: string;
  price: number; // in INR
  duration: string;
  durationBn: string;
  audience: string;
  audienceBn: string;
  features: string[];
  featuresBn: string[];
  published: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramEnrollment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  programId: string;
  programTitle: string;
  programCategory: ProgramCategory;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'free_intro';
  paymentReference?: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface WellnessEvent {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  imageUrl: string;
  startAt: string; // ISO string
  endAt: string;   // ISO string
  timezone: string;
  format: 'online' | 'in_person';
  formatBn: string;
  meetingUrl?: string;
  venue?: string;
  hostName: string;
  hostRole: string;
  capacity: number;
  registeredCount: number;
  registrationDeadline: string;
  price: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  tags: string[];
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  eventId: string;
  eventTitle: string;
  registeredAt: string;
  attended?: boolean;
}

export interface NutritionArticle {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  summary: string;
  summaryBn: string;
  content: string;
  contentBn: string;
  imageUrl: string;
  category: 'nutrition' | 'habits' | 'mindfulness' | 'movement';
  categoryBn: string;
  author: string;
  readTime: string;
  published: boolean;
  publishedAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorLocation: string;
  avatarUrl: string;
  quote: string;
  quoteBn: string;
  programTaken: string;
  rating: number;
  approved: boolean;
  isPlaceholder?: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleBn: string;
  category: 'workshops' | 'community' | 'nature' | 'movement' | 'nutrition';
  categoryBn: string;
  imageUrl: string;
  caption: string;
  captionBn: string;
  altText: string;
  uploadedAt: string;
}

export interface ContactEnquiry {
  id: string;
  fullName: string;
  email: string;
  mobile?: string;
  category: 'general' | 'program' | 'consultation' | 'community' | 'corporate';
  message: string;
  privacyAgreed: boolean;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface HabitLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  walkCompleted: boolean;
  routineFollowed: boolean;
  mindfulnessDone: boolean;
  sleepScheduleFollowed: boolean;
  hydrationGoalMet: boolean;
  notes?: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  brandName: string;
  brandNameBn: string;
  tagline: string;
  taglineBn: string;
  philosophy: string;
  philosophyBn: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessAddressBn: string;
  whatsappNumber: string;
  heroHeadline: string;
  heroHeadlineBn: string;
  heroSubheadline: string;
  heroSubheadlineBn: string;
  heroImageUrl: string;
  currencySymbol: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYouTube: string;
  paymentMode: 'test_simulation' | 'razorpay_live';
  razorpayKeyId?: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  itemType: 'program' | 'event' | 'consultation';
  itemId: string;
  itemTitle: string;
  amount: number;
  currency: string;
  transactionRef: string;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'simulated';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  receiptUrl?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  level: 'info' | 'highlight' | 'urgent';
  createdAt: string;
}
