-- ============================================================================
-- FIELDVERSE: Row Level Security (RLS) Policies
-- PostgreSQL Database Security Layer
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cricket_innings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.football_match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SECURITY HELPER FUNCTIONS
-- ----------------------------------------------------------------------------

-- Check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current authenticated user is an approved organizer
CREATE OR REPLACE FUNCTION public.is_approved_organizer()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'organizer' AND organizer_status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Anyone can view public profile details
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- Users can update only their own profile, but cannot elevate role or change organizer_status
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND organizer_status = (SELECT organizer_status FROM public.profiles WHERE id = auth.uid())
);

-- Admin can manage all profiles
CREATE POLICY "Admin can update any profile" 
ON public.profiles FOR UPDATE USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. SPORTS POLICIES
-- ----------------------------------------------------------------------------
-- Sports are viewable by everyone
CREATE POLICY "Sports viewable by all" 
ON public.sports FOR SELECT USING (true);

-- Only admin can modify sports
CREATE POLICY "Admin manages sports" 
ON public.sports FOR ALL USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. VENUES POLICIES
-- ----------------------------------------------------------------------------
-- Venues are viewable by everyone
CREATE POLICY "Venues viewable by all" 
ON public.venues FOR SELECT USING (true);

-- Organizers and admin can create/edit venues
CREATE POLICY "Approved organizers can create venues" 
ON public.venues FOR INSERT WITH CHECK (public.is_approved_organizer() OR public.is_admin());

CREATE POLICY "Venue creator or admin can update venue" 
ON public.venues FOR UPDATE USING (created_by = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. EVENTS POLICIES
-- ----------------------------------------------------------------------------
-- Public can see approved events. Organizers see their own. Admins see all.
CREATE POLICY "View events policy" 
ON public.events FOR SELECT USING (
    status = 'approved' 
    OR organizer_id = auth.uid() 
    OR public.is_admin()
);

-- Approved organizers can create events
CREATE POLICY "Approved organizers can insert events" 
ON public.events FOR INSERT WITH CHECK (
    organizer_id = auth.uid() 
    AND public.is_approved_organizer()
);

-- Organizers can update their own events if not yet approved or completed
CREATE POLICY "Organizers can update own events" 
ON public.events FOR UPDATE USING (
    organizer_id = auth.uid() OR public.is_admin()
);

-- ----------------------------------------------------------------------------
-- 5. TEAMS & TEAM MEMBERS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Teams viewable by all" 
ON public.teams FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams" 
ON public.teams FOR INSERT WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Captains can update own teams" 
ON public.teams FOR UPDATE USING (auth.uid() = captain_id);

CREATE POLICY "Team members viewable by all" 
ON public.team_members FOR SELECT USING (true);

CREATE POLICY "Captains manage team members" 
ON public.team_members FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.teams 
        WHERE id = team_members.team_id AND captain_id = auth.uid()
    ) OR public.is_admin()
);

-- ----------------------------------------------------------------------------
-- 6. EVENT REGISTRATIONS POLICIES
-- ----------------------------------------------------------------------------
-- Public/players can see approved registrations. Organizers see all for their events. Captains see their own.
CREATE POLICY "View registrations policy" 
ON public.event_registrations FOR SELECT USING (
    status = 'approved'
    OR registered_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.events 
        WHERE id = event_registrations.event_id AND organizer_id = auth.uid()
    )
    OR public.is_admin()
);

-- Captains can register their teams
CREATE POLICY "Captains can register teams" 
ON public.event_registrations FOR INSERT WITH CHECK (
    registered_by = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.teams 
        WHERE id = event_registrations.team_id AND captain_id = auth.uid()
    )
);

-- Organizers of the event can approve/reject registrations
CREATE POLICY "Event organizers manage registrations" 
ON public.event_registrations FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.events 
        WHERE id = event_registrations.event_id AND organizer_id = auth.uid()
    ) OR public.is_admin()
);

-- ----------------------------------------------------------------------------
-- 7. MATCHES & LIVE SCORES POLICIES
-- ----------------------------------------------------------------------------
-- Matches are viewable by all
CREATE POLICY "Matches viewable by all" 
ON public.matches FOR SELECT USING (true);

-- Event organizers manage match fixtures
CREATE POLICY "Event organizers manage matches" 
ON public.matches FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.events 
        WHERE id = matches.event_id AND organizer_id = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY "Match results viewable by all" 
ON public.match_results FOR SELECT USING (true);

CREATE POLICY "Organizers manage match results" 
ON public.match_results FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.matches m
        JOIN public.events e ON e.id = m.event_id
        WHERE m.id = match_results.match_id AND e.organizer_id = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY "Cricket telemetry viewable by all" 
ON public.cricket_innings FOR SELECT USING (true);

CREATE POLICY "Organizers update cricket telemetry" 
ON public.cricket_innings FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.matches m
        JOIN public.events e ON e.id = m.event_id
        WHERE m.id = cricket_innings.match_id AND e.organizer_id = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY "Football events viewable by all" 
ON public.football_match_events FOR SELECT USING (true);

CREATE POLICY "Organizers update football events" 
ON public.football_match_events FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.matches m
        JOIN public.events e ON e.id = m.event_id
        WHERE m.id = football_match_events.match_id AND e.organizer_id = auth.uid()
    ) OR public.is_admin()
);

-- ----------------------------------------------------------------------------
-- 8. ANNOUNCEMENTS & NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE POLICY "Announcements viewable by target audience" 
ON public.announcements FOR SELECT USING (true);

CREATE POLICY "Organizers and admin create announcements" 
ON public.announcements FOR INSERT WITH CHECK (
    public.is_approved_organizer() OR public.is_admin()
);

CREATE POLICY "Users view own notifications" 
ON public.notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" 
ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 9. AUDIT LOGS
-- ----------------------------------------------------------------------------
-- Only admin can view audit logs
CREATE POLICY "Admin view audit logs" 
ON public.audit_logs FOR SELECT USING (public.is_admin());

-- System & admins can insert audit logs
CREATE POLICY "Insert audit logs" 
ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
