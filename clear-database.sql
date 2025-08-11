-- Clear Database Script
-- This will delete all tables and data from your Supabase database
-- Run this in your Supabase SQL editor BEFORE running supabase-schema.sql

-- Drop all RLS policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Universities are viewable by all authenticated users" ON public.universities;
DROP POLICY IF EXISTS "Only platform admins can manage universities" ON public.universities;
DROP POLICY IF EXISTS "All authenticated users can manage universities for development" ON public.universities;
DROP POLICY IF EXISTS "Published profiles are viewable by all" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles they have access to" ON public.profiles;
DROP POLICY IF EXISTS "Users can edit profiles they have permission for" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "All authenticated users can manage profiles for development" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Platform admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "University admins can manage roles for their university" ON public.user_roles;
DROP POLICY IF EXISTS "All authenticated users can manage roles for development" ON public.user_roles;
DROP POLICY IF EXISTS "Timeline events follow profile permissions" ON public.timeline_events;
DROP POLICY IF EXISTS "Stories follow profile permissions" ON public.stories;
DROP POLICY IF EXISTS "Media follows profile permissions" ON public.media;
DROP POLICY IF EXISTS "Comments on published profiles are viewable by all" ON public.comments;
DROP POLICY IF EXISTS "Users can view comments on profiles they have access to" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can moderate comments" ON public.comments;
DROP POLICY IF EXISTS "All authenticated users can manage timeline events for development" ON public.timeline_events;
DROP POLICY IF EXISTS "All authenticated users can manage stories for development" ON public.stories;
DROP POLICY IF EXISTS "All authenticated users can manage media for development" ON public.media;
DROP POLICY IF EXISTS "All authenticated users can manage comments for development" ON public.comments;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop indexes
DROP INDEX IF EXISTS idx_profiles_university_id;
DROP INDEX IF EXISTS idx_profiles_status;
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_user_roles_university_id;
DROP INDEX IF EXISTS idx_user_roles_profile_id;
DROP INDEX IF EXISTS idx_timeline_events_profile_id;
DROP INDEX IF EXISTS idx_stories_profile_id;
DROP INDEX IF EXISTS idx_media_profile_id;
DROP INDEX IF EXISTS idx_comments_profile_id;
DROP INDEX IF EXISTS idx_comments_parent_id;
DROP INDEX IF EXISTS idx_notifications_user_id;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.stories CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.universities CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS profile_status CASCADE;
DROP TYPE IF EXISTS event_type CASCADE;
DROP TYPE IF EXISTS comment_status CASCADE;

-- Verify tables are dropped
SELECT 'Database cleared successfully. You can now run supabase-schema.sql' as status; 