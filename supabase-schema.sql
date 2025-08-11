-- Create custom types
CREATE TYPE user_role AS ENUM ('platform_admin', 'university_admin', 'editor', 'contributor', 'viewer');
CREATE TYPE profile_status AS ENUM ('draft', 'pending_review', 'published', 'archived');
CREATE TYPE event_type AS ENUM ('education', 'job', 'event');
CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Universities table
CREATE TABLE public.universities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    birth_date DATE,
    passed_date DATE,
    cover_photo_url TEXT,
    profile_photo_url TEXT,
    status profile_status DEFAULT 'draft',
    university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, university_id, profile_id)
);

-- Timeline events table
CREATE TABLE public.timeline_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type event_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    institution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table
CREATE TABLE public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media table
CREATE TABLE public.media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    status comment_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_university_id ON public.profiles(university_id);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_university_id ON public.user_roles(university_id);
CREATE INDEX idx_user_roles_profile_id ON public.user_roles(profile_id);
CREATE INDEX idx_timeline_events_profile_id ON public.timeline_events(profile_id);
CREATE INDEX idx_stories_profile_id ON public.stories(profile_id);
CREATE INDEX idx_media_profile_id ON public.media(profile_id);
CREATE INDEX idx_comments_profile_id ON public.comments(profile_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for universities table (simplified for development)
CREATE POLICY "Universities are viewable by all authenticated users" ON public.universities
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage universities for development" ON public.universities
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for profiles table (simplified for development)
CREATE POLICY "Published profiles are viewable by all" ON public.profiles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view profiles they have access to" ON public.profiles
    FOR SELECT USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND (university_id = profiles.university_id OR profile_id = profiles.id)
        )
    );

CREATE POLICY "All authenticated users can manage profiles for development" ON public.profiles
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for user_roles table (simplified for development)
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "All authenticated users can manage roles for development" ON public.user_roles
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for other tables (simplified for development)
CREATE POLICY "All authenticated users can manage timeline events for development" ON public.timeline_events
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage stories for development" ON public.stories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage media for development" ON public.media
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can manage comments for development" ON public.comments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Create functions for common operations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 