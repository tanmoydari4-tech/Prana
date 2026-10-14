import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
    // Attempt pinging the Supabase REST endpoint
    const { data, error } = await supabase.from('settings').select('*').limit(1);
    if (error) {
      // If table doesn't exist yet, connection to Supabase is still valid!
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          connected: true,
          message: `Connected to Supabase project "${SUPABASE_PROJECT_ID}". To initialize tables, execute the SQL script in your Supabase SQL Editor.`,
          project: SUPABASE_PROJECT_ID
        };
      }
      return {
        connected: false,
        message: `Connected to Supabase endpoint, response: ${error.message}`,
        project: SUPABASE_PROJECT_ID
      };
    }
    return {
      connected: true,
      message: `Active & connected to Supabase PostgreSQL database (${SUPABASE_PROJECT_ID}).`,
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

/**
 * Syncs a new enquiry into Supabase if configured
 */
export async function syncEnquiryToSupabase(enquiry: {
  id: string;
  fullName: string;
  email: string;
  mobile?: string;
  category: string;
  message: string;
  privacyAgreed: boolean;
  status: string;
}): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('enquiries').insert([{
      id: enquiry.id,
      full_name: enquiry.fullName,
      email: enquiry.email,
      mobile: enquiry.mobile,
      category: enquiry.category,
      message: enquiry.message,
      privacy_agreed: enquiry.privacyAgreed,
      status: enquiry.status
    }]);
    return !error;
  } catch {
    return false;
  }
}
