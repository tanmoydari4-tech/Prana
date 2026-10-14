-- ==============================================================================
-- Prāna Wellness & Living Community - Supabase PostgreSQL Schema & Security Policies
-- Cloud Project ID: atmnwxgvnfsrinqrzvij
-- ==============================================================================

-- 1. Users Table (Members & Admins)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  preferred_language TEXT DEFAULT 'en',
  interests JSONB DEFAULT '[]'::jsonb,
  role TEXT DEFAULT 'member', -- 'member' or 'admin'
  membership_status TEXT DEFAULT 'active', -- 'active', 'pending', 'suspended'
  wellness_goals TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_bn TEXT,
  description TEXT,
  description_bn TEXT,
  category TEXT NOT NULL,
  category_name TEXT,
  category_name_bn TEXT,
  image_url TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  duration TEXT,
  duration_bn TEXT,
  audience TEXT,
  audience_bn TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  features_bn JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  program_id TEXT REFERENCES public.programs(id) ON DELETE CASCADE,
  program_title TEXT NOT NULL,
  program_category TEXT,
  amount NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'paid',
  payment_reference TEXT,
  status TEXT DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  description TEXT,
  description_bn TEXT,
  image_url TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'IST (UTC+5:30)',
  format TEXT DEFAULT 'online', -- 'online' or 'in_person'
  format_bn TEXT,
  meeting_url TEXT,
  venue TEXT,
  host_name TEXT NOT NULL,
  host_role TEXT,
  capacity INT DEFAULT 50,
  registered_count INT DEFAULT 0,
  registration_deadline TIMESTAMPTZ,
  price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'live', 'completed', 'cancelled'
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT false
);

-- 6. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_bn TEXT,
  summary TEXT,
  summary_bn TEXT,
  content TEXT,
  content_bn TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'nutrition',
  category_bn TEXT,
  author TEXT NOT NULL,
  read_time TEXT DEFAULT '4 min',
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_location TEXT,
  avatar_url TEXT,
  quote TEXT NOT NULL,
  quote_bn TEXT,
  program_taken TEXT,
  rating INT DEFAULT 5,
  approved BOOLEAN DEFAULT false,
  is_placeholder BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  category TEXT NOT NULL,
  category_bn TEXT,
  image_url TEXT NOT NULL,
  caption TEXT,
  caption_bn TEXT,
  alt_text TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  privacy_agreed BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'unread', -- 'unread', 'read', 'replied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Habit Logs Table
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  walk_completed BOOLEAN DEFAULT false,
  routine_followed BOOLEAN DEFAULT false,
  mindfulness_done BOOLEAN DEFAULT false,
  sleep_schedule_followed BOOLEAN DEFAULT false,
  hydration_goal_met BOOLEAN DEFAULT false,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 11. Website Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  brand_name TEXT NOT NULL DEFAULT 'Prāna Wellness',
  brand_name_bn TEXT DEFAULT 'প্রাণ ওয়েলনেস',
  tagline TEXT DEFAULT 'Feel Better. Live Healthier. Grow Together.',
  tagline_bn TEXT DEFAULT 'সুস্থ থাকুন। ভালো বাঁচুন। একসাথে এগিয়ে চলুন।',
  philosophy TEXT,
  philosophy_bn TEXT,
  business_email TEXT DEFAULT 'hello@pranawellness.org',
  business_phone TEXT DEFAULT '+91 98300 12345',
  business_address TEXT,
  business_address_bn TEXT,
  whatsapp_number TEXT DEFAULT '+919830012345',
  hero_headline TEXT,
  hero_headline_bn TEXT,
  hero_subheadline TEXT,
  hero_subheadline_bn TEXT,
  hero_image_url TEXT,
  currency_symbol TEXT DEFAULT '₹',
  social_instagram TEXT,
  social_facebook TEXT,
  social_youtube TEXT,
  payment_mode TEXT DEFAULT 'test_simulation',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  transaction_ref TEXT NOT NULL,
  payment_method TEXT DEFAULT 'simulated',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  content TEXT NOT NULL,
  content_bn TEXT,
  level TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Enable all access for settings" ON public.settings;
DROP POLICY IF EXISTS "Enable all access for programs" ON public.programs;
DROP POLICY IF EXISTS "Enable all access for events" ON public.events;
DROP POLICY IF EXISTS "Enable all access for articles" ON public.articles;
DROP POLICY IF EXISTS "Enable all access for testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Enable all access for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Enable all access for enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Enable all access for users" ON public.users;
DROP POLICY IF EXISTS "Enable all access for habit_logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Enable all access for payments" ON public.payments;
DROP POLICY IF EXISTS "Enable all access for enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Enable all access for event_registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Enable all access for announcements" ON public.announcements;

-- Policies allowing full CRUD across all devices for this community application
CREATE POLICY "Enable all access for settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for programs" ON public.programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for enquiries" ON public.enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for habit_logs" ON public.habit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for enrollments" ON public.enrollments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for event_registrations" ON public.event_registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);

-- Seed Initial Website Settings
INSERT INTO public.settings (
  id, brand_name, brand_name_bn, tagline, tagline_bn, philosophy, philosophy_bn, business_email, business_phone, business_address, business_address_bn, whatsapp_number, currency_symbol, payment_mode
) VALUES (
  'main_settings',
  'Prāna Wellness',
  'প্রাণ ওয়েলনেস',
  'Feel Better. Live Healthier. Grow Together.',
  'সুস্থ থাকুন। ভালো বাঁচুন। একসাথে এগিয়ে চলুন।',
  'Small daily habits. Better lifestyle. A healthier future.',
  'ছোট ছোট দৈনন্দিন অভ্যাস। উন্নত জীবনধারা। একটি সুস্থ আগামী।',
  'hello@pranawellness.org',
  '+91 98300 12345',
  'Salt Lake City, Sector V, Kolkata, West Bengal, India',
  'সল্টলেক সিটি, সেক্টর ৫, কলকাতা, পশ্চিমবঙ্গ, ভারত',
  '+919830012345',
  '₹',
  'test_simulation'
) ON CONFLICT (id) DO NOTHING;

-- Enable Realtime Broadcast for Cross-Device Live Sync
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.programs;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.enquiries;
  EXCEPTION WHEN others THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
  EXCEPTION WHEN others THEN NULL;
  END;
END $$;
