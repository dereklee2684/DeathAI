-- Fix RLS Policies to Allow Reading Universities
-- Run this in your Supabase SQL editor to fix the dashboard issue

-- Drop existing policies for universities
DROP POLICY IF EXISTS "Universities are viewable by all authenticated users" ON public.universities;
DROP POLICY IF EXISTS "All authenticated users can manage universities for development" ON public.universities;

-- Create new policies that allow reading without authentication
CREATE POLICY "Universities are viewable by everyone" ON public.universities
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can manage universities" ON public.universities
    FOR ALL USING (auth.role() = 'authenticated');

-- Also fix other tables to allow reading without authentication for development
DROP POLICY IF EXISTS "Published profiles are viewable by all" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles they have access to" ON public.profiles;
DROP POLICY IF EXISTS "All authenticated users can manage profiles for development" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can manage profiles" ON public.profiles
    FOR ALL USING (auth.role() = 'authenticated');

-- Fix user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "All authenticated users can manage roles for development" ON public.user_roles;

CREATE POLICY "User roles are viewable by everyone" ON public.user_roles
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can manage roles" ON public.user_roles
    FOR ALL USING (auth.role() = 'authenticated');

-- Fix other tables
DROP POLICY IF EXISTS "All authenticated users can manage timeline events for development" ON public.timeline_events;
DROP POLICY IF EXISTS "Timeline events are viewable by everyone" ON public.timeline_events;
CREATE POLICY "Timeline events are viewable by everyone" ON public.timeline_events
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "All authenticated users can manage stories for development" ON public.stories;
DROP POLICY IF EXISTS "Stories are viewable by everyone" ON public.stories;
CREATE POLICY "Stories are viewable by everyone" ON public.stories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "All authenticated users can manage media for development" ON public.media;
DROP POLICY IF EXISTS "Media is viewable by everyone" ON public.media;
CREATE POLICY "Media is viewable by everyone" ON public.media
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "All authenticated users can manage comments for development" ON public.comments;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments
    FOR SELECT USING (true);

-- Keep notifications private (only if they don't exist)
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

SELECT 'RLS policies updated successfully. Universities should now be visible in the dashboard.' as status; 