'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowLeftIcon,
  PencilIcon,
  ArchiveBoxIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { getProfile, getTimelineEvents, getStories, updateProfile } from '@/lib/profiles'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { canEditProfile, canApproveProfiles } from '@/lib/auth'

interface TimelineEvent {
  id: string
  title: string
  description?: string
  event_type: 'education' | 'job' | 'event'
  start_date: string
  end_date?: string
  institution: string
}

interface Story {
  id: string
  question: string
  answer: string
}

interface Profile {
  id: string
  name: string
  birth_date?: string
  status: 'draft' | 'pending_review' | 'published' | 'archived'
  profile_photo_url?: string
  cover_photo_url?: string
  university_id: string
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

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  pending_review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800'
}

const statusLabels = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  published: 'Published',
  archived: 'Archived'
}

export default function ProfileViewPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [updating, setUpdating] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('ProfileViewPage - User role debug:', {
      userEmail: user?.email,
      userRole: user?.user_role,
      canEdit: canEditProfile(user, profile?.created_by || ''),
      canApprove: canApproveProfiles(user)
    })
  }, [user, profile?.created_by])

  useEffect(() => {
    if (params.id) {
      loadProfile()
    }
  }, [params.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const profileData = await getProfile(params.id as string)
      setProfile(profileData)
      
      const [events, storiesData] = await Promise.all([
        getTimelineEvents(params.id as string),
        getStories(params.id as string)
      ])
      
      setTimelineEvents(events)
      setStories(storiesData)
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/profiles/${profile?.id}/edit`)
  }

  const handleViewPublic = () => {
    router.push(`/profiles/${profile?.id}`)
  }

  const handleArchive = async () => {
    if (!profile) return
    
    try {
      setUpdating(true)
      await updateProfile(profile.id, { status: 'archived' })
      await loadProfile() // Refresh data
    } catch (err) {
      console.error('Error archiving profile:', err)
      setError('Failed to archive profile. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const handleReview = (action: 'approve' | 'reject') => {
    setReviewAction(action)
    setShowReviewModal(true)
  }

  const confirmReview = async () => {
    if (!profile || !reviewAction) return
    
    try {
      setUpdating(true)
      const newStatus = reviewAction === 'approve' ? 'published' : 'draft'
      await updateProfile(profile.id, { status: newStatus })
      await loadProfile() // Refresh data
      setShowReviewModal(false)
      setReviewAction(null)
    } catch (err) {
      console.error('Error updating profile status:', err)
      setError('Failed to update profile status. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'education':
        return '🎓'
      case 'job':
        return '💼'
      case 'event':
        return '📅'
      default:
        return '📌'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-red-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading profile</h3>
            <p className="mt-1 text-sm text-gray-500">{error || 'Profile not found'}</p>
            <div className="mt-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireDashboardAccess>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Profiles
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[profile.status]}`}>
                  {statusLabels[profile.status]}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{profile.universities?.name || 'No university assigned'}</p>
            </div>
            
            <div className="flex space-x-3">
              {profile.status === 'pending_review' && canApproveProfiles(user) && (
                <>
                  <button
                    onClick={() => handleReview('approve')}
                    disabled={updating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview('reject')}
                    disabled={updating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </>
              )}
              
              {canEditProfile(user, profile?.created_by || '') && user?.user_role !== 'viewer' && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
              )}
              
              <button
                onClick={handleViewPublic}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                View Public
              </button>
              
              {profile.status !== 'archived' && canEditProfile(user, profile?.created_by || '') && user?.user_role !== 'viewer' && (
                <button
                  onClick={handleArchive}
                  disabled={updating}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                >
                  <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                  Archive
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Birth Date</span>
                  <p className="text-gray-900">{profile.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'Not provided'}</p>
                </div>
                {profile.birth_date && (
                  <div>
                    <span className="text-sm text-gray-500">Passed Date</span>
                    <p className="text-gray-900">{new Date(profile.birth_date).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">University</span>
                  <p className="text-gray-900">{profile.universities?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Modified</span>
                  <p className="text-gray-900">{new Date(profile.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">{getEventIcon(event.event_type)}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {event.event_type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{event.institution}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(event.start_date).getFullYear()} - {event.end_date ? new Date(event.end_date).getFullYear() : 'Present'}
                      </p>
                      {event.description && (
                        <p className="text-gray-700">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
                {timelineEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No timeline events added yet.</p>
                )}
              </div>
            </div>

            {/* Stories */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stories & Memories</h2>
              <div className="space-y-6">
                {stories.map((story) => (
                  <div key={story.id} className="border-l-4 border-purple-200 pl-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{story.question}</h3>
                    <p className="text-gray-700 leading-relaxed">{story.answer}</p>
                  </div>
                ))}
                {stories.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No stories added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
              {profile.profile_photo_url ? (
                <Image
                  src={profile.profile_photo_url}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold text-gray-400">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Timeline Events</span>
                  <span className="font-semibold text-gray-900">{timelineEvents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stories</span>
                  <span className="font-semibold text-gray-900">{stories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created By</span>
                  <span className="font-semibold text-gray-900">{profile.users?.display_name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {canEditProfile(user, profile?.created_by || '') && user?.user_role !== 'viewer' && (
                  <button
                    onClick={handleEdit}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleViewPublic}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Public Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {reviewAction === 'approve' ? 'Approve Profile' : 'Reject Profile'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {reviewAction === 'approve' 
                  ? 'This will publish the profile and make it publicly visible.'
                  : 'This will return the profile to draft status for further editing.'
                }
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReview}
                  disabled={updating}
                  className={`flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                    reviewAction === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50`}
                >
                  {updating ? 'Updating...' : (reviewAction === 'approve' ? 'Approve' : 'Reject')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  )
} 