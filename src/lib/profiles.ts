import { createClient } from './supabase'

export interface TimelineEvent {
  id: string
  profile_id: string
  title: string
  description?: string
  event_type: 'education' | 'job' | 'event'
  start_date: string
  end_date?: string
  institution: string
  created_at: string
}

export interface Story {
  id: string
  profile_id: string
  question: string
  answer: string
  created_at: string
}

export interface Profile {
  id: string
  name: string
  birth_date?: string
  passed_date?: string
  cover_photo_url?: string
  profile_photo_url?: string
  status: 'draft' | 'pending_review' | 'published' | 'archived'
  university_id?: string
  created_by: string
  created_at: string
  updated_at: string
  universities?: {
    name: string
  }
  users?: {
    display_name: string
  }
}

export interface CreateProfileData {
  name: string
  birth_date?: string
  passed_date?: string
  university_id?: string
  timeline_events?: Omit<TimelineEvent, 'id' | 'profile_id' | 'created_at'>[]
  stories?: Omit<Story, 'id' | 'profile_id' | 'created_at'>[]
  user?: {
    id: string
    user_role?: string
  }
}

export interface UpdateProfileData {
  name?: string
  birth_date?: string
  passed_date?: string
  university_id?: string
  status?: 'draft' | 'pending_review' | 'published' | 'archived'
  profile_photo_url?: string
  cover_photo_url?: string
}

const supabase = createClient()

const PROFILE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET || 'profile-photos'
const COVER_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_COVER_BUCKET || 'cover-photos'

// Profile CRUD operations
export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      universities(name),
      users(display_name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching profiles:', error)
    throw error
  }

  return data || []
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      universities(name),
      users(display_name)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    throw error
  }

  return data
}

export async function createProfile(profileData: CreateProfileData) {
  // Determine initial status based on user role
  let initialStatus: 'draft' | 'pending_review' | 'published' = 'draft'
  
  if (profileData.user?.user_role === 'platform_admin' || profileData.user?.user_role === 'university_admin') {
    // Platform admins and university admins can publish directly
    initialStatus = 'published'
  } else if (profileData.user?.user_role === 'alumni') {
    // Alumni profiles go to pending review
    initialStatus = 'pending_review'
  }
  // Default is 'draft' for other roles

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      name: profileData.name,
      birth_date: profileData.birth_date,
      passed_date: profileData.passed_date,
      university_id: profileData.university_id,
      status: initialStatus,
      created_by: profileData.user?.id
    })
    .select()
    .single()

  if (profileError) {
    console.error('Error creating profile:', profileError)
    throw profileError
  }

  // Insert timeline events if provided
  if (profileData.timeline_events && profileData.timeline_events.length > 0) {
    // Filter out events with empty or invalid dates
    const validTimelineEvents = profileData.timeline_events
      .filter(event => event.start_date && event.start_date.trim() !== '')
      .map(event => ({
        ...event,
        profile_id: profile.id,
        // Ensure end_date is undefined if it's empty
        end_date: event.end_date && event.end_date.trim() !== '' ? event.end_date : undefined
      }))

    if (validTimelineEvents.length > 0) {
      const { error: timelineError } = await supabase
        .from('timeline_events')
        .insert(validTimelineEvents)

      if (timelineError) {
        console.error('Error creating timeline events:', timelineError)
        throw timelineError
      }
    }
  }

  // Insert stories if provided
  if (profileData.stories && profileData.stories.length > 0) {
    const stories = profileData.stories.map(story => ({
      ...story,
      profile_id: profile.id
    }))

    const { error: storiesError } = await supabase
      .from('stories')
      .insert(stories)

    if (storiesError) {
      console.error('Error creating stories:', storiesError)
      throw storiesError
    }
  }

  return profile
}

export async function updateProfile(id: string, updateData: UpdateProfileData) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }

  if (!data) {
    // This typically happens when RLS prevents the UPDATE or the row doesn't exist
    throw new Error('No profile updated. Check Row Level Security permissions or profile ID.')
  }

  return data
}

export async function deleteProfile(id: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting profile:', error)
    throw error
  }
}

// Timeline events operations
export async function getTimelineEvents(profileId: string) {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('profile_id', profileId)
    .order('start_date', { ascending: true })

  if (error) {
    console.error('Error fetching timeline events:', error)
    throw error
  }

  return data || []
}

export async function createTimelineEvent(eventData: Omit<TimelineEvent, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('timeline_events')
    .insert(eventData)
    .select()
    .single()

  if (error) {
    console.error('Error creating timeline event:', error)
    throw error
  }

  return data
}

export async function updateTimelineEvent(id: string, updateData: Partial<TimelineEvent>) {
  const { data, error } = await supabase
    .from('timeline_events')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating timeline event:', error)
    throw error
  }

  return data
}

export async function deleteTimelineEvent(id: string) {
  const { error } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting timeline event:', error)
    throw error
  }
}

// Stories operations
export async function getStories(profileId: string) {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching stories:', error)
    throw error
  }

  return data || []
}

export async function createStory(storyData: Omit<Story, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('stories')
    .insert(storyData)
    .select()
    .single()

  if (error) {
    console.error('Error creating story:', error)
    throw error
  }

  return data
}

export async function updateStory(id: string, updateData: Partial<Story>) {
  const { data, error } = await supabase
    .from('stories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating story:', error)
    throw error
  }

  return data
}

export async function deleteStory(id: string) {
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting story:', error)
    throw error
  }
}

// File upload operations
export async function uploadProfilePhoto(file: File, profileId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${profileId}-profile-${Date.now()}.${fileExt}`
  
  const { error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(fileName, file)

  if (error) {
    console.error('Error uploading profile photo:', error)
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from(PROFILE_BUCKET)
    .getPublicUrl(fileName)

  // Update profile with photo URL
  await updateProfile(profileId, { profile_photo_url: publicUrl })

  return publicUrl
}

export async function uploadCoverPhoto(file: File, profileId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${profileId}-cover-${Date.now()}.${fileExt}`
  
  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(fileName, file)

  if (error) {
    console.error('Error uploading cover photo:', error)
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from(COVER_BUCKET)
    .getPublicUrl(fileName)

  // Update profile with cover photo URL
  await updateProfile(profileId, { cover_photo_url: publicUrl })

  return publicUrl
} 