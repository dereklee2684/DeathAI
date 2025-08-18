'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { 
  PlusIcon, 
  XMarkIcon, 
  CalendarIcon, 
  PhotoIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline'
import { 
  getTimelineEvents,
  getStories,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  createStory,
  updateStory,
  deleteStory,
  uploadProfilePhoto,
  uploadCoverPhoto
} from '@/lib/profiles'

interface Profile {
  id: string
  name: string
  birth_date?: string
  university_id: string
  status: string
  created_at: string
  updated_at: string
}

interface University {
  id: string
  name: string
}

  const storyQuestions = [
    "What was your proudest moment?",
    "What inspired you to pursue your career?",
    "What advice would you give to current students?",
    "What was your favorite memory from university?",
    "What legacy do you hope to leave behind?",
    "What challenges did you overcome?",
    "What would you like to be remembered for?",
    "What was your biggest achievement?"
  ]

export default function AlumniProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  interface TimelineEventData {
    id: string
    type: 'education' | 'job' | 'event'
    title: string
    institution: string
    startDate: string
    endDate: string
    description: string
  }

  interface StoryData {
    id: string
    question: string
    answer: string
  }

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    birth_date: ''
  })
  const [profilePhoto, setProfilePhoto] = useState<File | undefined>(undefined)
  const [coverPhoto, setCoverPhoto] = useState<File | undefined>(undefined)
  const [timeline, setTimeline] = useState<TimelineEventData[]>([])
  const [stories, setStories] = useState<StoryData[]>([])
  const [originalTimelineIds, setOriginalTimelineIds] = useState<string[]>([])
  const [originalStoryIds, setOriginalStoryIds] = useState<string[]>([])

  useEffect(() => {
    if (user?.id) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      console.log('Looking for profiles with created_by:', user?.id)
      
      // Find the profile for this alumni user
      const { data: profilesData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          universities!university_id (
            id,
            name
          )
        `)
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false })

      if (profileError) {
        console.error('Error loading profile:', profileError)
        setError('Failed to load profile.')
        return
      }

      console.log('Found profiles:', profilesData)

      // Get the most recent profile (first in the ordered list)
      const profileData = profilesData && profilesData.length > 0 ? profilesData[0] : null

      console.log('Loaded profile data:', profileData)

      // If multiple profiles found, show a warning
      if (profilesData && profilesData.length > 1) {
        console.warn(`Found ${profilesData.length} profiles for user ${user?.id}. Using the most recent one.`)
      }

      if (profileData) {
        setProfile(profileData)
        setUniversity(profileData.universities)
        
        // Populate form data
        const formDataToSet = {
          name: profileData.name || '',
          birth_date: profileData.birth_date || ''
        }
        
        console.log('Setting form data:', formDataToSet)
        setFormData(formDataToSet)

        // Load timeline events and stories for this profile
        try {
          const [events, storiesData] = await Promise.all([
            getTimelineEvents(profileData.id),
            getStories(profileData.id)
          ])

          const mappedEvents: TimelineEventData[] = events.map((event: { id: string; event_type: string; title: string; institution: string; start_date: string; end_date?: string; description?: string }) => ({
            id: event.id,
            type: event.event_type as 'education' | 'job' | 'event',
            title: event.title,
            institution: event.institution,
            startDate: event.start_date,
            endDate: event.end_date || '',
            description: event.description || ''
          }))
          const mappedStories: StoryData[] = storiesData.map((s: { id: string; question: string; answer: string }) => ({
            id: s.id,
            question: s.question,
            answer: s.answer
          }))

          setTimeline(mappedEvents)
          setStories(mappedStories)
          setOriginalTimelineIds(mappedEvents.map(e => e.id))
          setOriginalStoryIds(mappedStories.map(s => s.id))
          
          // If no timeline events exist, add predefined event
          if (mappedEvents.length === 0) {
            addPredefinedTimelineEvent()
          }
          
          // If no stories exist, add predefined questions
          if (mappedStories.length === 0) {
            addPredefinedStories()
          }
        } catch (err) {
          console.warn('Failed loading timeline/stories for alumni editor:', err)
          // If loading failed, still add predefined content
          addPredefinedTimelineEvent()
          addPredefinedStories()
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!profile) {
      setError('No profile found to update.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      const updateData = {
        name: formData.name.trim(),
        birth_date: formData.birth_date && formData.birth_date.trim() !== '' ? formData.birth_date : null,
        updated_at: new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        setError('Failed to update profile.')
        return
      }

      // Sync timeline events (create/update/delete)
      try {
        // Filter out events with empty start dates
        const validEvents = timeline.filter(event => event.startDate && event.startDate.trim() !== '')
        
        // Create or update current events
        for (const event of validEvents) {
          const isExisting = originalTimelineIds.includes(event.id)
          if (isExisting) {
            await updateTimelineEvent(event.id, {
              title: event.title,
              description: event.description || undefined,
              event_type: event.type,
              start_date: event.startDate,
              end_date: event.endDate && event.endDate.trim() !== '' ? event.endDate : undefined,
              institution: event.institution
            })
          } else {
            await createTimelineEvent({
              profile_id: profile.id,
              title: event.title,
              description: event.description || undefined,
              event_type: event.type,
              start_date: event.startDate,
              end_date: event.endDate && event.endDate.trim() !== '' ? event.endDate : undefined,
              institution: event.institution
            })
          }
        }

        // Delete removed events
        const currentIds = new Set(timeline.map(e => e.id))
        for (const originalId of originalTimelineIds) {
          if (!currentIds.has(originalId)) {
            await deleteTimelineEvent(originalId)
          }
        }
      } catch (err) {
        console.warn('Timeline sync warning:', err)
      }

      // Sync stories (create/update/delete)
      try {
        for (const s of stories) {
          const isExisting = originalStoryIds.includes(s.id)
          if (isExisting) {
            await updateStory(s.id, {
              question: s.question,
              answer: s.answer
            })
          } else {
            await createStory({
              profile_id: profile.id,
              question: s.question,
              answer: s.answer
            })
          }
        }

        // Delete removed stories
        const currentStoryIds = new Set(stories.map(s => s.id))
        for (const originalId of originalStoryIds) {
          if (!currentStoryIds.has(originalId)) {
            await deleteStory(originalId)
          }
        }
      } catch (err) {
        console.warn('Stories sync warning:', err)
      }

      // Upload photos if provided
      try {
        if (profilePhoto) {
          await uploadProfilePhoto(profilePhoto, profile.id)
        }
        if (coverPhoto) {
          await uploadCoverPhoto(coverPhoto, profile.id)
        }
      } catch (err) {
        console.warn('Photo upload warning:', err)
      }

      setSuccess('Profile updated successfully!')
      
      // Reload profile to get updated data
      await loadProfile()
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (field: 'profile' | 'cover', file: File) => {
    if (field === 'profile') {
      setProfilePhoto(file)
    } else {
      setCoverPhoto(file)
    }
  }

  const addTimelineEventLocal = () => {
    const newEvent: TimelineEventData = {
      id: Date.now().toString(),
      type: 'education',
      title: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    setTimeline(prev => [...prev, newEvent])
  }

  const updateTimelineEventLocal = (id: string, field: keyof TimelineEventData, value: string) => {
    setTimeline(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const removeTimelineEventLocal = (id: string) => {
    setTimeline(prev => prev.filter(e => e.id !== id))
  }

  const addStoryLocal = () => {
    const newStory: StoryData = {
      id: Date.now().toString(),
      question: 'Tell us a story...',
      answer: ''
    }
    setStories(prev => [...prev, newStory])
  }

  const addPredefinedStories = () => {
    const predefinedStories: StoryData[] = storyQuestions.map((question, index) => ({
      id: `predefined-${Date.now()}-${index}`,
      question: question,
      answer: ''
    }))
    setStories(prev => [...prev, ...predefinedStories])
  }

  const addPredefinedTimelineEvent = () => {
    const predefinedEvent: TimelineEventData = {
      id: `predefined-${Date.now()}`,
      type: 'education',
      title: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    setTimeline(prev => [...prev, predefinedEvent])
  }

  const updateStoryLocal = (id: string, field: keyof StoryData, value: string) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeStoryLocal = (id: string) => {
    setStories(prev => prev.filter(s => s.id !== id))
  }

  // Redirect if not alumni
  if (user && user.user_role !== 'alumni') {
    router.push('/')
    return null
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Edit Alumni Profile
          </h1>
          <p className="mt-2 text-lg text-gray-800">
            Update your alumni profile information
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {profile ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {university?.name} Alumni Profile
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      id="birth_date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>


                </div>
              </div>

              {/* Photos */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Photos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('profile', e.target.files[0])}
                        className="hidden"
                        id="profile-photo"
                      />
                      <label htmlFor="profile-photo" className="cursor-pointer">
                        <span className="text-purple-600 hover:text-purple-500">Upload photo</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('cover', e.target.files[0])}
                        className="hidden"
                        id="cover-photo"
                      />
                      <label htmlFor="cover-photo" className="cursor-pointer">
                        <span className="text-purple-600 hover:text-purple-500">Upload photo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>



              {/* Timeline Events */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-900">Timeline Events</h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={addPredefinedTimelineEvent}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Add University Event
                    </button>
                    <button
                      type="button"
                      onClick={addTimelineEventLocal}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Custom Event
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Event {index + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimelineEventLocal(event.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={event.type}
                            onChange={(e) => updateTimelineEventLocal(event.id, 'type', e.target.value as 'education' | 'job' | 'event')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                          >
                            <option value="education">Education</option>
                            <option value="job">Job</option>
                            <option value="event">Event</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => updateTimelineEventLocal(event.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                            placeholder="e.g., Bachelor's Degree"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                          <input
                            type="text"
                            value={event.institution}
                            onChange={(e) => updateTimelineEventLocal(event.id, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                            placeholder="e.g., University Name"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={event.startDate}
                              onChange={(e) => updateTimelineEventLocal(event.id, 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                              type="date"
                              value={event.endDate}
                              onChange={(e) => updateTimelineEventLocal(event.id, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={event.description}
                            onChange={(e) => updateTimelineEventLocal(event.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                            rows={3}
                            placeholder="Brief details about this event"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stories */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-900">Stories</h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={addPredefinedStories}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Add Predefined Questions
                    </button>
                    <button
                      type="button"
                      onClick={addStoryLocal}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Custom Story
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {stories.map((story, index) => (
                    <div key={story.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Story {index + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStoryLocal(story.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                          <input
                            type="text"
                            value={story.question}
                            onChange={(e) => updateStoryLocal(story.id, 'question', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                            placeholder="What was your proudest moment?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                          <textarea
                            value={story.answer}
                            onChange={(e) => updateStoryLocal(story.id, 'answer', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                            rows={3}
                            placeholder="Share your story..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">No profile found</p>
                              <p className="mt-2">It looks like you don&apos;t have an alumni profile yet.</p>
              <p className="mt-2">Please contact your university admin to create a profile for you, or try refreshing the page.</p>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 