-- ============================================================================
-- FIELDVERSE: Master Supabase SQL Setup Script
-- Project: https://ijqsiqmcwpvczqnbccur.supabase.co
-- Run this complete script in your Supabase SQL Editor.
-- Safe to run multiple times (Idempotent).
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SAFE ENUM CREATION
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'player');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE organizer_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE event_format AS ENUM ('knockout', 'league');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'cancelled', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'waived', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'completed', 'abandoned', 'postponed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'player',
    organizer_status organizer_status DEFAULT 'pending',
    organization_name TEXT,
    organization_details TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_organizer_status ON public.profiles(organizer_status);

-- 4. SPORTS TABLE
CREATE TABLE IF NOT EXISTS public.sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    min_team_size INT NOT NULL DEFAULT 1,
    max_team_size INT NOT NULL DEFAULT 15,
    icon_name TEXT DEFAULT 'trophy',
    rules_json JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VENUES TABLE
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    ground_details TEXT,
    surface_type TEXT DEFAULT 'Turf',
    capacity INT DEFAULT 500,
    amenities JSONB DEFAULT '["Floodlights", "Dressing Rooms", "Parking", "Water Station"]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venues_city ON public.venues(city);

-- 6. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE RESTRICT,
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    description TEXT,
    banner_url TEXT,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE NOT NULL,
    registration_deadline DATE NOT NULL,
    max_teams INT NOT NULL DEFAULT 16,
    team_size INT NOT NULL DEFAULT 11,
    tournament_format event_format NOT NULL DEFAULT 'knockout',
    entry_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    prize_pool NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rules TEXT,
    status event_status NOT NULL DEFAULT 'draft',
    rejection_reason TEXT,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_reg_dates CHECK (registration_deadline <= start_date)
);

CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_sport ON public.events(sport_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);

-- 7. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_captain ON public.teams(captain_id);

-- 8. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    player_name TEXT NOT NULL,
    jersey_number INT,
    player_role TEXT DEFAULT 'Player',
    is_captain BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);

-- 9. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    registered_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    status registration_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_event_team UNIQUE (event_id, team_id)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.event_registrations(status);

-- 10. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    round_name TEXT NOT NULL DEFAULT 'Round 1',
    match_number INT NOT NULL,
    team_a_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    team_b_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE RESTRICT,
    match_date DATE NOT NULL,
    start_time TIME NOT NULL,
    status match_status NOT NULL DEFAULT 'scheduled',
    winner_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    score_summary TEXT DEFAULT 'Upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_event_match_num UNIQUE (event_id, match_number)
);

CREATE INDEX IF NOT EXISTS idx_matches_event ON public.matches(event_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);

-- 11. CRICKET INNINGS TABLE (Live Telemetry)
CREATE TABLE IF NOT EXISTS public.cricket_innings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    innings_number INT NOT NULL CHECK (innings_number IN (1, 2)),
    total_runs INT NOT NULL DEFAULT 0,
    total_wickets INT NOT NULL DEFAULT 0,
    total_overs NUMERIC(4, 1) NOT NULL DEFAULT 0.0,
    current_striker TEXT,
    current_non_striker TEXT,
    current_bowler TEXT,
    recent_overs_balls JSONB DEFAULT '[]'::jsonb,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_match_innings UNIQUE (match_id, innings_number)
);

-- 12. FOOTBALL MATCH EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.football_match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    minute INT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('goal', 'yellow_card', 'red_card', 'substitution', 'penalty')),
    player_name TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_audience TEXT NOT NULL DEFAULT 'all',
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- 15. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 16. AUTHENTICATION TRIGGER
-- Automatically creates a public.profiles record when a user signs up
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, organizer_status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'player'),
        CASE 
            WHEN (NEW.raw_user_meta_data->>'role') = 'organizer' THEN 'pending'::organizer_status
            ELSE 'approved'::organizer_status
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cricket_innings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.football_match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_approved_organizer()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'organizer' AND organizer_status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe policy recreation
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Sports viewable by all" ON public.sports;
CREATE POLICY "Sports viewable by all" ON public.sports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manages sports" ON public.sports;
CREATE POLICY "Admin manages sports" ON public.sports FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Venues viewable by all" ON public.venues;
CREATE POLICY "Venues viewable by all" ON public.venues FOR SELECT USING (true);

DROP POLICY IF EXISTS "Approved organizers can create venues" ON public.venues;
CREATE POLICY "Approved organizers can create venues" ON public.venues FOR INSERT WITH CHECK (public.is_approved_organizer() OR public.is_admin());

DROP POLICY IF EXISTS "View events policy" ON public.events;
CREATE POLICY "View events policy" ON public.events FOR SELECT USING (status = 'approved' OR organizer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Approved organizers can insert events" ON public.events;
CREATE POLICY "Approved organizers can insert events" ON public.events FOR INSERT WITH CHECK (organizer_id = auth.uid() AND public.is_approved_organizer());

DROP POLICY IF EXISTS "Organizers can update own events" ON public.events;
CREATE POLICY "Organizers can update own events" ON public.events FOR UPDATE USING (organizer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Teams viewable by all" ON public.teams;
CREATE POLICY "Teams viewable by all" ON public.teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
CREATE POLICY "Authenticated users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() = captain_id);

DROP POLICY IF EXISTS "Team members viewable by all" ON public.team_members;
CREATE POLICY "Team members viewable by all" ON public.team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "View registrations policy" ON public.event_registrations;
CREATE POLICY "View registrations policy" ON public.event_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Captains can register teams" ON public.event_registrations;
CREATE POLICY "Captains can register teams" ON public.event_registrations FOR INSERT WITH CHECK (registered_by = auth.uid());

DROP POLICY IF EXISTS "Matches viewable by all" ON public.matches;
CREATE POLICY "Matches viewable by all" ON public.matches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cricket telemetry viewable by all" ON public.cricket_innings;
CREATE POLICY "Cricket telemetry viewable by all" ON public.cricket_innings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Football events viewable by all" ON public.football_match_events;
CREATE POLICY "Football events viewable by all" ON public.football_match_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Announcements viewable by target audience" ON public.announcements;
CREATE POLICY "Announcements viewable by target audience" ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());

-- ============================================================================
-- 18. INITIAL SEED DATA
-- ============================================================================
INSERT INTO public.sports (name, slug, description, min_team_size, max_team_size, icon_name, rules_json, is_active)
VALUES 
    ('Cricket', 'cricket', '20-over & 10-over outdoor leather ball cricket tournaments.', 11, 16, '🏏', '{"overs": 20, "powerplay_overs": 6, "balls_per_over": 6}'::jsonb, true),
    ('Football', 'football', '7v7 and 11v11 association football turf tournaments.', 7, 15, '⚽', '{"half_duration_minutes": 35, "penalty_shootout": true}'::jsonb, true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.venues (name, address, city, ground_details, surface_type, capacity, amenities, is_active)
VALUES
    ('Apex International Sports Complex', 'Sector 4, HSR Layout', 'Bengaluru', 'Ground A - Natural Red Soil Pitch with 68m boundary; Full LED floodlights.', 'Natural Turf', 1200, '["Floodlights", "Changing Rooms", "Digital Scoreboard", "First Aid Room"]'::jsonb, true),
    ('Greenfield Arena', 'Indiranagar 100ft Road', 'Bengaluru', 'Ground 1 - FIFA-Standard 7v7 Artificial Turf with shock pads.', 'Artificial Turf', 600, '["Floodlights", "Shower Rooms", "Parking Area", "Hydration Stations"]'::jsonb, true),
    ('Skylight Multi-Sport Arena', 'Whitefield Main Road', 'Bengaluru', 'Dual pitch ground suitable for Cricket T20 and Football 9v9.', 'Hybrid Turf', 850, '["Pavilion Benches", "PA Sound System", "Parking", "Medical Staff"]'::jsonb, true)
ON CONFLICT DO NOTHING;
