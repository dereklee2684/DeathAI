export type UserRole = 'platform_admin' | 'university_admin' | 'editor' | 'contributor' | 'viewer' | 'alumni'
export type ProfileStatus = 'draft' | 'pending_review' | 'published' | 'archived'
export type EventType = 'education' | 'job' | 'event'
export type CommentStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  email: string
  display_name?: string
  user_role?: UserRole
  created_at: string
  updated_at: string
}

export interface University {
  id: string
  name: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  name: string
  birth_date?: string
  passed_date?: string
  cover_photo_url?: string
  profile_photo_url?: string
  status: ProfileStatus
  university_id: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface UserRoleAssignment {
  id: string
  user_id: string
  university_id?: string
  profile_id?: string
  role: UserRole
  created_at: string
}

export interface TimelineEvent {
  id: string
  profile_id: string
  title: string
  description?: string
  event_type: EventType
  start_date: string
  end_date?: string
  institution?: string
  created_at: string
}

export interface Story {
  id: string
  profile_id: string
  question: string
  answer: string
  created_at: string
}

export interface Media {
  id: string
  profile_id: string
  url: string
  caption?: string
  created_by: string
  created_at: string
}

export interface Comment {
  id: string
  profile_id: string
  user_id: string
  content: string
  parent_id?: string
  status: CommentStatus
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
} 