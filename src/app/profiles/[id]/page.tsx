'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { ArrowLeftIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

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
  created_at: string
  universities?: {
    name: string
  }
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      loadProfile()
    }
  }, [params.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      // Load profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          universities!university_id (
            name
          )
        `)
        .eq('id', params.id)
        .eq('status', 'published')
        .single()

      if (profileError) {
        console.error('Error loading profile:', profileError)
        setError('Profile not found or not published.')
        return
      }

      setProfile(profileData)

      // Load timeline events and stories
      const [events, storiesData] = await Promise.all([
        supabase
          .from('timeline_events')
          .select('*')
          .eq('profile_id', params.id)
          .order('start_date', { ascending: true }),
        supabase
          .from('stories')
          .select('*')
          .eq('profile_id', params.id)
          .order('created_at', { ascending: true })
      ])

      if (events.error) {
        console.error('Error loading timeline events:', events.error)
      } else {
        setTimelineEvents(events.data || [])
      }

      if (storiesData.error) {
        console.error('Error loading stories:', storiesData.error)
      } else {
        setStories(storiesData.data || [])
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile.')
    } finally {
      setLoading(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">{error || 'Profile not found'}</p>
              <Link href="/universities" className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-700">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Universities
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Cover Photo */}
      {profile.cover_photo_url && (
        <div className="relative h-64 bg-gray-200">
          <img
            src={profile.cover_photo_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/universities" className="inline-flex items-center text-purple-600 hover:text-purple-700 mr-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Universities
            </Link>
          </div>
          
          <div className="flex items-start space-x-6">
            {profile.profile_photo_url ? (
              <img
                src={profile.profile_photo_url}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.name}
              </h1>
              {profile.universities?.name && (
                <p className="text-lg text-gray-600 mt-1">
                  {profile.universities.name}
                </p>
              )}
              {profile.birth_date && (
                <p className="text-sm text-gray-500 mt-1">
                  Born: {formatDate(profile.birth_date)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline Events */}
            {timelineEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2 text-purple-600" />
                  Timeline
                </h2>
                <div className="space-y-6">
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">
                          {getEventIcon(event.event_type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {event.institution}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(event.start_date)}
                            {event.end_date && ` - ${formatDate(event.end_date)}`}
                          </p>
                          {event.description && (
                            <p className="text-gray-700 mt-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stories */}
            {stories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 mr-2 text-purple-600" />
                  Stories
                </h2>
                <div className="space-y-6">
                  {stories.map((story) => (
                    <div key={story.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {story.question}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {story.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{profile.name}</p>
                </div>
                {profile.universities?.name && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">University</p>
                    <p className="text-gray-900">{profile.universities.name}</p>
                  </div>
                )}
                {profile.birth_date && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Birth Date</p>
                    <p className="text-gray-900">{formatDate(profile.birth_date)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Timeline Events</p>
                  <p className="text-gray-900">{timelineEvents.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Stories</p>
                  <p className="text-gray-900">{stories.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 