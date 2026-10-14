import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import {
  WebsiteSettings,
  Program,
  WellnessEvent,
  NutritionArticle,
  Testimonial,
  GalleryItem,
  ContactEnquiry,
  UserProfile,
  HabitLog,
  Announcement,
  ProgramEnrollment,
  EventRegistration
} from '../types';

export const SUPABASE_PROJECT_ID = 'atmnwxgvnfsrinqrzvij';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_15I7OtmTepRBdcB8mEUG8A_t_65x7Ls';

export let supabase: SupabaseClient | null = null;
export let isSupabaseConfigured = false;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    isSupabaseConfigured = true;
  }
} catch (error) {
  console.warn('Supabase client failed to initialize:', error);
}

/**
 * Checks connection health to Supabase project
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; project: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in environment.',
      project: SUPABASE_PROJECT_ID
    };
  }

  try {
    const { data, error } = await supabase.from('settings').select('*').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          connected: true,
          message: `Connected to Supabase project "${SUPABASE_PROJECT_ID}". Execute supabase/schema.sql in your Supabase SQL Editor to initialize tables.`,
          project: SUPABASE_PROJECT_ID
        };
      }
      return {
        connected: false,
        message: `Connected to Supabase, but query error: ${error.message}`,
        project: SUPABASE_PROJECT_ID
      };
    }
    return {
      connected: true,
      message: `Active & connected to Supabase Cloud (${SUPABASE_PROJECT_ID}). All admin changes sync across all devices.`,
      project: SUPABASE_PROJECT_ID
    };
  } catch (err: unknown) {
    return {
      connected: false,
      message: err instanceof Error ? err.message : 'Unknown Supabase connection error',
      project: SUPABASE_PROJECT_ID
    };
  }
}

// ==========================================
// Mappers: Supabase <-> TypeScript Models
// ==========================================

export function mapSettingsFromRow(row: any, fallback: WebsiteSettings): WebsiteSettings {
  if (!row) return fallback;
  return {
    brandName: row.brand_name || fallback.brandName,
    brandNameBn: row.brand_name_bn || fallback.brandNameBn,
    tagline: row.tagline || fallback.tagline,
    taglineBn: row.tagline_bn || fallback.taglineBn,
    philosophy: row.philosophy || fallback.philosophy,
    philosophyBn: row.philosophy_bn || fallback.philosophyBn,
    businessEmail: row.business_email || fallback.businessEmail,
    businessPhone: row.business_phone || fallback.businessPhone,
    businessAddress: row.business_address || fallback.businessAddress,
    businessAddressBn: row.business_address_bn || fallback.businessAddressBn,
    whatsappNumber: row.whatsapp_number || fallback.whatsappNumber,
    heroHeadline: row.hero_headline || fallback.heroHeadline,
    heroHeadlineBn: row.hero_headline_bn || fallback.heroHeadlineBn,
    heroSubheadline: row.hero_subheadline || fallback.heroSubheadline,
    heroSubheadlineBn: row.hero_subheadline_bn || fallback.heroSubheadlineBn,
    heroImageUrl: row.hero_image_url || fallback.heroImageUrl,
    currencySymbol: row.currency_symbol || fallback.currencySymbol,
    socialInstagram: row.social_instagram || fallback.socialInstagram,
    socialFacebook: row.social_facebook || fallback.socialFacebook,
    socialYouTube: row.social_youtube || fallback.socialYouTube,
    paymentMode: row.payment_mode || fallback.paymentMode,
  };
}

export function mapSettingsToRow(s: WebsiteSettings): any {
  return {
    id: 'main_settings',
    brand_name: s.brandName,
    brand_name_bn: s.brandNameBn,
    tagline: s.tagline,
    tagline_bn: s.taglineBn,
    philosophy: s.philosophy,
    philosophy_bn: s.philosophyBn,
    business_email: s.businessEmail,
    business_phone: s.businessPhone,
    business_address: s.businessAddress,
    business_address_bn: s.businessAddressBn,
    whatsapp_number: s.whatsappNumber,
    hero_headline: s.heroHeadline,
    hero_headline_bn: s.heroHeadlineBn,
    hero_subheadline: s.heroSubheadline,
    hero_subheadline_bn: s.heroSubheadlineBn,
    hero_image_url: s.heroImageUrl,
    currency_symbol: s.currencySymbol,
    social_instagram: s.socialInstagram,
    social_facebook: s.socialFacebook,
    social_youtube: s.socialYouTube,
    payment_mode: s.paymentMode,
    updated_at: new Date().toISOString()
  };
}

export function mapProgramFromRow(r: any): Program {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    titleBn: r.title_bn,
    description: r.description,
    descriptionBn: r.description_bn,
    category: r.category,
    categoryName: r.category_name,
    categoryNameBn: r.category_name_bn,
    imageUrl: r.image_url,
    price: Number(r.price || 0),
    duration: r.duration,
    durationBn: r.duration_bn,
    audience: r.audience,
    audienceBn: r.audience_bn,
    features: Array.isArray(r.features) ? r.features : [],
    featuresBn: Array.isArray(r.features_bn) ? r.features_bn : [],
    published: r.published ?? true,
    featured: r.featured ?? false,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export function mapProgramToRow(p: Program): any {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    title_bn: p.titleBn,
    description: p.description,
    description_bn: p.descriptionBn,
    category: p.category,
    category_name: p.categoryName,
    category_name_bn: p.categoryNameBn,
    image_url: p.imageUrl,
    price: p.price,
    duration: p.duration,
    duration_bn: p.durationBn,
    audience: p.audience,
    audience_bn: p.audienceBn,
    features: p.features || [],
    features_bn: p.featuresBn || [],
    published: p.published,
    featured: p.featured,
    created_at: p.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export function mapEventFromRow(r: any): WellnessEvent {
  return {
    id: r.id,
    title: r.title,
    titleBn: r.title_bn,
    description: r.description,
    descriptionBn: r.description_bn,
    imageUrl: r.image_url,
    startAt: r.start_at,
    endAt: r.end_at,
    timezone: r.timezone,
    format: r.format || 'online',
    formatBn: r.format_bn,
    meetingUrl: r.meeting_url,
    venue: r.venue,
    hostName: r.host_name,
    hostRole: r.host_role,
    capacity: r.capacity || 50,
    registeredCount: r.registered_count || 0,
    registrationDeadline: r.registration_deadline,
    price: Number(r.price || 0),
    status: r.status || 'upcoming',
    tags: Array.isArray(r.tags) ? r.tags : [],
    createdAt: r.created_at
  };
}

export function mapEventToRow(e: WellnessEvent): any {
  return {
    id: e.id,
    title: e.title,
    title_bn: e.titleBn,
    description: e.description,
    description_bn: e.descriptionBn,
    image_url: e.imageUrl,
    start_at: e.startAt,
    end_at: e.endAt,
    timezone: e.timezone,
    format: e.format,
    format_bn: e.formatBn,
    meeting_url: e.meetingUrl,
    venue: e.venue,
    host_name: e.hostName,
    host_role: e.hostRole,
    capacity: e.capacity,
    registered_count: e.registeredCount,
    registration_deadline: e.registrationDeadline,
    price: e.price,
    status: e.status,
    tags: e.tags || [],
    created_at: e.createdAt || new Date().toISOString()
  };
}

export function mapArticleFromRow(r: any): NutritionArticle {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    titleBn: r.title_bn,
    summary: r.summary,
    summaryBn: r.summary_bn,
    content: r.content,
    contentBn: r.content_bn,
    imageUrl: r.image_url,
    category: r.category,
    categoryBn: r.category_bn,
    author: r.author,
    readTime: r.read_time,
    published: r.published ?? true,
    publishedAt: r.published_at
  };
}

export function mapArticleToRow(a: NutritionArticle): any {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    title_bn: a.titleBn,
    summary: a.summary,
    summary_bn: a.summaryBn,
    content: a.content,
    content_bn: a.contentBn,
    image_url: a.imageUrl,
    category: a.category,
    category_bn: a.categoryBn,
    author: a.author,
    read_time: a.readTime,
    published: a.published,
    published_at: a.publishedAt || new Date().toISOString()
  };
}

export function mapTestimonialFromRow(r: any): Testimonial {
  return {
    id: r.id,
    authorName: r.author_name,
    authorLocation: r.author_location,
    avatarUrl: r.avatar_url,
    quote: r.quote,
    quoteBn: r.quote_bn,
    programTaken: r.program_taken,
    rating: r.rating || 5,
    approved: r.approved ?? false,
    isPlaceholder: r.is_placeholder ?? false,
    createdAt: r.created_at
  };
}

export function mapTestimonialToRow(t: Testimonial): any {
  return {
    id: t.id,
    author_name: t.authorName,
    author_location: t.authorLocation,
    avatar_url: t.avatarUrl,
    quote: t.quote,
    quote_bn: t.quoteBn,
    program_taken: t.programTaken,
    rating: t.rating,
    approved: t.approved,
    is_placeholder: t.isPlaceholder,
    created_at: t.createdAt || new Date().toISOString()
  };
}

export function mapGalleryFromRow(r: any): GalleryItem {
  return {
    id: r.id,
    title: r.title,
    titleBn: r.title_bn,
    category: r.category,
    categoryBn: r.category_bn,
    imageUrl: r.image_url,
    caption: r.caption,
    captionBn: r.caption_bn,
    altText: r.alt_text,
    uploadedAt: r.uploaded_at
  };
}

export function mapGalleryToRow(g: GalleryItem): any {
  return {
    id: g.id,
    title: g.title,
    title_bn: g.titleBn,
    category: g.category,
    category_bn: g.categoryBn,
    image_url: g.imageUrl,
    caption: g.caption,
    caption_bn: g.captionBn,
    alt_text: g.altText,
    uploaded_at: g.uploadedAt || new Date().toISOString()
  };
}

export function mapEnquiryFromRow(r: any): ContactEnquiry {
  return {
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    mobile: r.mobile,
    category: r.category,
    message: r.message,
    privacyAgreed: r.privacy_agreed ?? true,
    status: r.status || 'unread',
    createdAt: r.created_at
  };
}

export function mapUserFromRow(r: any): UserProfile {
  return {
    uid: r.uid,
    fullName: r.full_name,
    email: r.email,
    mobile: r.mobile || '',
    preferredLanguage: r.preferred_language || 'en',
    interests: Array.isArray(r.interests) ? r.interests : [],
    role: r.role || 'member',
    membershipStatus: r.membership_status || 'active',
    wellnessGoals: r.wellness_goals || '',
    avatarUrl: r.avatar_url,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

export function mapUserToRow(u: UserProfile): any {
  return {
    uid: u.uid,
    full_name: u.fullName,
    email: u.email,
    mobile: u.mobile,
    preferred_language: u.preferredLanguage,
    interests: u.interests || [],
    role: u.role,
    membership_status: u.membershipStatus,
    wellness_goals: u.wellnessGoals,
    avatar_url: u.avatarUrl,
    updated_at: new Date().toISOString()
  };
}

export function mapAnnouncementFromRow(r: any): Announcement {
  return {
    id: r.id,
    title: r.title || 'Announcement',
    titleBn: r.title_bn || 'বিজ্ঞপ্তি',
    content: r.content || r.message || '',
    contentBn: r.content_bn || r.message_bn || '',
    level: (r.level as 'info' | 'highlight' | 'urgent') || 'info',
    createdAt: r.created_at
  };
}

export function mapAnnouncementToRow(a: Announcement): any {
  return {
    id: a.id,
    title: a.title,
    title_bn: a.titleBn,
    content: a.content,
    content_bn: a.contentBn,
    level: a.level,
    created_at: a.createdAt || new Date().toISOString()
  };
}

// ==========================================
// Cloud Read & Write Operations (Cross-Device)
// ==========================================

export async function fetchSupabaseSettings(): Promise<WebsiteSettings | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 'main_settings').single();
    if (error || !data) return null;
    return mapSettingsFromRow(data, {} as WebsiteSettings);
  } catch {
    return null;
  }
}

export async function saveSupabaseSettings(settings: WebsiteSettings): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapSettingsToRow(settings);
    const { error } = await supabase.from('settings').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabasePrograms(): Promise<Program[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapProgramFromRow);
  } catch {
    return null;
  }
}

export async function saveSupabaseProgram(program: Program): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapProgramToRow(program);
    const { error } = await supabase.from('programs').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseProgram(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('programs').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabaseEvents(): Promise<WellnessEvent[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('events').select('*').order('start_at', { ascending: true });
    if (error || !data) return null;
    return data.map(mapEventFromRow);
  } catch {
    return null;
  }
}

export async function saveSupabaseEvent(event: WellnessEvent): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapEventToRow(event);
    const { error } = await supabase.from('events').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseEvent(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabaseArticles(): Promise<NutritionArticle[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('articles').select('*').order('published_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapArticleFromRow);
  } catch {
    return null;
  }
}

export async function saveSupabaseArticle(article: NutritionArticle): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapArticleToRow(article);
    const { error } = await supabase.from('articles').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseArticle(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabaseGallery(): Promise<GalleryItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('gallery').select('*').order('uploaded_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapGalleryFromRow);
  } catch {
    return null;
  }
}

export async function saveSupabaseGallery(item: GalleryItem): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapGalleryToRow(item);
    const { error } = await supabase.from('gallery').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseGallery(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabaseTestimonials(): Promise<Testimonial[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapTestimonialFromRow);
  } catch {
    return null;
  }
}

export async function saveSupabaseTestimonial(testimonial: Testimonial): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapTestimonialToRow(testimonial);
    const { error } = await supabase.from('testimonials').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteSupabaseTestimonial(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabaseEnquiries(): Promise<ContactEnquiry[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapEnquiryFromRow);
  } catch {
    return null;
  }
}

export async function syncEnquiryToSupabase(enquiry: ContactEnquiry): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('enquiries').upsert([{
      id: enquiry.id,
      full_name: enquiry.fullName,
      email: enquiry.email,
      mobile: enquiry.mobile,
      category: enquiry.category,
      message: enquiry.message,
      privacy_agreed: enquiry.privacyAgreed,
      status: enquiry.status,
      created_at: enquiry.createdAt || new Date().toISOString()
    }], { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabaseUsers(): Promise<UserProfile[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data) return null;
    return data.map(mapUserFromRow);
  } catch {
    return null;
  }
}

export async function saveSupabaseUser(user: UserProfile): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapUserToRow(user);
    const { error } = await supabase.from('users').upsert(row, { onConflict: 'uid' });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSupabaseAnnouncements(): Promise<Announcement[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map(mapAnnouncementFromRow);
  } catch {
    return null;
  }
}

export async function saveSupabaseAnnouncement(ann: Announcement): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = mapAnnouncementToRow(ann);
    const { error } = await supabase.from('announcements').upsert(row, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Setup Realtime channel to listen for any PostgreSQL row changes in Supabase
 */
export function setupSupabaseRealtime(onTableChange: (tableName: string) => void): RealtimeChannel | null {
  if (!supabase) return null;
  try {
    const channel = supabase
      .channel('public-db-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        if (payload.table) {
          onTableChange(payload.table);
        }
      })
      .subscribe();
    return channel;
  } catch (err) {
    console.warn('Realtime subscription not active:', err);
    return null;
  }
}
