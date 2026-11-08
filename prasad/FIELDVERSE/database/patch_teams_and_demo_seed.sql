-- ============================================================================
-- FIELDVERSE: Patch for Seamless Team Registrations & Demo Accounts
-- Run this script in your Supabase SQL Editor (https://ijqsiqmcwpvczqnbccur.supabase.co)
-- ============================================================================

-- 1. Insert Demo Users into auth.users (so profiles foreign keys are valid)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES
    ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'organizer@fieldverse.com', crypt('organizer123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sunil Gavaskar Sports Academy","role":"organizer"}', now(), now()),
    ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'player@fieldverse.com', crypt('player123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Rahul Sharma","role":"player"}', now(), now()),
    ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'admin@fieldverse.com', crypt('admin123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Vikramaditya Rao","role":"admin"}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Profiles into public.profiles
INSERT INTO public.profiles (id, email, full_name, phone, role, organizer_status, organization_name, created_at)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'organizer@fieldverse.com', 'Sunil Gavaskar Sports Academy', '+91 98200 55443', 'organizer', 'approved', 'Sunil Gavaskar Sports Academy', now()),
    ('22222222-2222-2222-2222-222222222222', 'player@fieldverse.com', 'Rahul Sharma', '+91 98765 43210', 'player', 'approved', null, now()),
    ('33333333-3333-3333-3333-333333333333', 'admin@fieldverse.com', 'Vikramaditya Rao', '+91 98450 11223', 'admin', 'approved', 'FIELDVERSE Board', now())
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    organizer_status = EXCLUDED.organizer_status;

-- 3. Make captain_id & registered_by nullable so guest/demo teams can always register
ALTER TABLE public.teams ALTER COLUMN captain_id DROP NOT NULL;
ALTER TABLE public.event_registrations ALTER COLUMN registered_by DROP NOT NULL;

-- 4. Open RLS Policies for Seamless Frontend Interactions
DROP POLICY IF EXISTS "Public can insert teams" ON public.teams;
CREATE POLICY "Public can insert teams" ON public.teams FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update teams" ON public.teams;
CREATE POLICY "Public can update teams" ON public.teams FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can insert registrations" ON public.event_registrations;
CREATE POLICY "Public can insert registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update registrations" ON public.event_registrations;
CREATE POLICY "Public can update registrations" ON public.event_registrations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can select registrations" ON public.event_registrations;
CREATE POLICY "Public can select registrations" ON public.event_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert events" ON public.events;
CREATE POLICY "Public can insert events" ON public.events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update events" ON public.events;
CREATE POLICY "Public can update events" ON public.events FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can update cricket innings" ON public.cricket_innings;
CREATE POLICY "Public can update cricket innings" ON public.cricket_innings FOR ALL USING (true);

-- 5. Seed a Verified Live Event in Supabase
DO $$
DECLARE
    v_sport_id UUID;
    v_venue_id UUID;
BEGIN
    SELECT id INTO v_sport_id FROM public.sports WHERE slug = 'cricket' LIMIT 1;
    SELECT id INTO v_venue_id FROM public.venues LIMIT 1;

    IF v_sport_id IS NOT NULL AND v_venue_id IS NOT NULL THEN
        INSERT INTO public.events (
            id, title, sport_id, organizer_id, description, venue_id, 
            start_date, end_date, registration_start, registration_deadline, 
            max_teams, team_size, tournament_format, entry_fee, prize_pool, status
        )
        VALUES (
            'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
            'Grand Monsoon Cricket Championship 2026',
            v_sport_id,
            '11111111-1111-1111-1111-111111111111',
            'Premier 20-over leather ball cricket tournament with digital ball tracking and live telemetry.',
            v_venue_id,
            '2026-11-20', '2026-11-28',
            '2026-10-01', '2026-11-15',
            16, 11, 'knockout', 4500, 75000, 'approved'
        )
        ON CONFLICT (id) DO UPDATE SET status = 'approved';
    END IF;
END $$;
