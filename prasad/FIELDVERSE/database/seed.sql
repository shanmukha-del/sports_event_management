-- ============================================================================
-- FIELDVERSE: Seed Data
-- Demo and Initial Production Seed Data
-- ============================================================================

-- 1. Insert Initial Sports
INSERT INTO public.sports (id, name, slug, description, min_team_size, max_team_size, icon_name, rules_json, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Cricket', 'cricket', 'Outdoor pitch-based bat and ball sport with 11-15 players per squad.', 11, 15, 'cricket', '{"overs": 20, "powerplay_overs": 6, "balls_per_over": 6, "ball_type": "Leather 4-Piece"}'::jsonb, true),
    ('22222222-2222-2222-2222-222222222222', 'Football', 'football', 'Association football 7v7 or 11v11 turf and field tournament sport.', 7, 16, 'football', '{"half_duration_minutes": 35, "extra_time_minutes": 10, "penalty_shootout": true}'::jsonb, true)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Initial Verified Venues
INSERT INTO public.venues (id, name, address, city, ground_details, surface_type, capacity, amenities, is_active)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'Apex International Sports Complex', 'Sector 4, HSR Layout', 'Bengaluru', 'Ground A - Natural Red Soil Pitch with 68m boundary; Full LED floodlights.', 'Natural Turf', 1200, '["Floodlights", "Changing Rooms", "Cafeteria", "Digital Scoreboard", "First Aid Room", "Covered Stands"]'::jsonb, true),
    ('44444444-4444-4444-4444-444444444444', 'Greenfield Arena', 'Indiranagar 100ft Road', 'Bengaluru', 'Ground 1 - FIFA-Standard 7v7 Artificial Turf with rubber infill.', 'Artificial Turf', 600, '["Floodlights", "Shower Rooms", "Parking Area", "Hydration Stations"]'::jsonb, true),
    ('55555555-5555-5555-5555-555555555555', 'Skylight Multi-Sport Arena', 'Whitefield Main Road', 'Bengaluru', 'Dual pitch ground suitable for Cricket T20 and Football 9v9.', 'Hybrid Turf', 850, '["Pavilion Benches", "PA Sound System", "Parking", "Medical Staff"]'::jsonb, true)
ON CONFLICT DO NOTHING;

-- 3. Note for Demo Profiles, Events, and Teams:
-- In production Supabase, users will register via auth.signUp().
-- For local and offline preview mode, our client-side fallback store in `js/mockData.js`
-- mirrors this exact relational structure so the application runs immediately with full interactivity!
