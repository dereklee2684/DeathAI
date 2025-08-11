'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  PlusIcon, 
  XMarkIcon,
  PhotoIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { 
  getProfile, 
  getTimelineEvents, 
  getStories, 
  updateProfile, 
  createTimelineEvent, 
  createStory, 
  deleteTimelineEvent, 
  deleteStory, 
  updateTimelineEvent as updateTimelineEventApi,
  updateStory as updateStoryApi,
  uploadProfilePhoto,
  uploadCoverPhoto,
  TimelineEvent, 
  Story, 
  Profile 
} from '@/lib/profiles'
import { useAuth } from '@/contexts/AuthContext'

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

interface ProfileData {
  name: string
  birthDate: string
  coverPhoto?: File
  profilePhoto?: File
  timeline: TimelineEventData[]
  stories: StoryData[]
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

export default function EditProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    birthDate: '',
    timeline: [],
    stories: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [originalTimelineIds, setOriginalTimelineIds] = useState<string[]>([])
  const [originalStoryIds, setOriginalStoryIds] = useState<string[]>([])

  const totalSteps = 4

  useEffect(() => {
    if (params.id) {
      loadProfile()
    }
  }, [params.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [profile, timelineEvents, stories] = await Promise.all([
        getProfile(params.id as string),
        getTimelineEvents(params.id as string),
        getStories(params.id as string)
      ])
      
      setProfileData({
        name: profile.name,
        birthDate: profile.birth_date || '',
        timeline: timelineEvents.map((event: any) => ({
          id: event.id,
          type: event.event_type,
          title: event.title,
          institution: event.institution,
          startDate: event.start_date,
          endDate: event.end_date || '',
          description: event.description || ''
        })),
        stories: stories.map((story: any) => ({
          id: story.id,
          question: story.question,
          answer: story.answer
        }))
      })
      setOriginalTimelineIds(timelineEvents.map((e: any) => e.id))
      setOriginalStoryIds(stories.map((s: any) => s.id))
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addTimelineEvent = () => {
    const newEvent: TimelineEventData = {
      id: Date.now().toString(),
      type: 'education',
      title: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    setProfileData(prev => ({
      ...prev,
      timeline: [...prev.timeline, newEvent]
    }))
  }

  const updateTimelineEvent = (id: string, field: keyof TimelineEventData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      timeline: prev.timeline.map(event => 
        event.id === id ? { ...event, [field]: value } : event
      )
    }))
  }

  const removeTimelineEvent = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      timeline: prev.timeline.filter(event => event.id !== id)
    }))
  }

  const addStory = () => {
    const newStory: StoryData = {
      id: Date.now().toString(),
      question: 'Tell us a story...',
      answer: ''
    }
    setProfileData(prev => ({
      ...prev,
      stories: [...prev.stories, newStory]
    }))
  }

  const updateStory = (id: string, answer: string, question?: string) => {
    setProfileData(prev => ({
      ...prev,
      stories: prev.stories.map(story => 
        story.id === id ? { ...story, answer, ...(question && { question }) } : story
      )
    }))
  }

  const removeStory = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      stories: prev.stories.filter(story => story.id !== id)
    }))
  }

  const handleFileUpload = (field: 'coverPhoto' | 'profilePhoto', file: File) => {
    setProfileData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to edit a profile.')
      return
    }

    if (!profileData.name.trim()) {
      setError('Profile name is required.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Validate timeline events required fields before any writes
      const invalidEvents = profileData.timeline.filter(evt => !evt.title.trim() || !evt.startDate)
      if (invalidEvents.length > 0) {
        setError('Please fill Title and Start Date for all timeline events or remove incomplete entries.')
        setIsSubmitting(false)
        return
      }

      // Update base profile fields
      await updateProfile(params.id as string, {
        name: profileData.name,
        birth_date: profileData.birthDate || undefined
      })

      // Upload photos if provided
      if (profileData.profilePhoto) {
        await uploadProfilePhoto(profileData.profilePhoto, params.id as string)
      }
      if (profileData.coverPhoto) {
        await uploadCoverPhoto(profileData.coverPhoto, params.id as string)
      }

      // Sync timeline events
      const uiEvents = profileData.timeline
      const existingIds = new Set(originalTimelineIds)
      const uiIds = new Set(uiEvents.map(e => e.id))

      // Deletes
      for (const oldId of originalTimelineIds) {
        if (!uiIds.has(oldId)) {
          await deleteTimelineEvent(oldId)
        }
      }

      // Creates/Updates
      for (const evt of uiEvents) {
        const payload = {
          id: evt.id,
          profile_id: params.id as string,
          event_type: evt.type,
          title: evt.title,
          institution: evt.institution,
          start_date: evt.startDate,
          end_date: evt.endDate || undefined,
          description: evt.description
        }
        if (existingIds.has(evt.id)) {
          await updateTimelineEventApi(evt.id, payload as any)
        } else {
          const { id, ...createData } = payload
          await createTimelineEvent(createData as any)
        }
      }

      // Sync stories
      const uiStories = profileData.stories
      const existingStoryIdSet = new Set(originalStoryIds)
      const uiStoryIdSet = new Set(uiStories.map(s => s.id))

      // Deletes
      for (const oldId of originalStoryIds) {
        if (!uiStoryIdSet.has(oldId)) {
          await deleteStory(oldId)
        }
      }

      // Creates/Updates
      for (const story of uiStories) {
        const payload = {
          id: story.id,
          profile_id: params.id as string,
          question: story.question,
          answer: story.answer
        }
        if (existingStoryIdSet.has(story.id)) {
          await updateStoryApi(story.id, payload as any)
        } else {
          const { id, ...createData } = payload
          await createStory(createData as any)
        }
      }

      router.push(`/dashboard/profiles/${params.id}`)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-center">
        <div className="flex items-center w-[500px]">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i + 1 < currentStep 
                  ? 'bg-green-500 text-white' 
                  : i + 1 === currentStep 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {i + 1 < currentStep ? '✓' : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`flex-1 h-1 ${
                  i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center text-sm text-gray-600 mt-2">
        <div className="flex w-[500px] -ml-4">
          <div className="flex-1">
            <span>Basic Info</span>
          </div>
          <div className="flex-1">
            <span>Timeline</span>
          </div>
          <div className="flex-1">
            <span>Stories</span>
          </div>
          <div className="flex-1">
            <span>Review</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <input
              type="date"
              value={profileData.birthDate}
              onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
            />
          </div>
        </div>
      </div>

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
                onChange={(e) => e.target.files?.[0] && handleFileUpload('profilePhoto', e.target.files[0])}
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
                onChange={(e) => e.target.files?.[0] && handleFileUpload('coverPhoto', e.target.files[0])}
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
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Timeline Events</h3>
        <button
          onClick={addTimelineEvent}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Event
        </button>
      </div>
      
      <div className="space-y-4">
        {profileData.timeline.map((event, index) => (
          <div key={event.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Event {index + 1}</span>
              </div>
              <button
                onClick={() => removeTimelineEvent(event.id)}
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
                  onChange={(e) => updateTimelineEvent(event.id, 'type', e.target.value as any)}
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
                  onChange={(e) => updateTimelineEvent(event.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                  placeholder="e.g., Bachelor's Degree"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={event.institution}
                  onChange={(e) => updateTimelineEvent(event.id, 'institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                  placeholder="e.g., University Name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={event.startDate}
                    onChange={(e) => updateTimelineEvent(event.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={event.endDate}
                    onChange={(e) => updateTimelineEvent(event.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={event.description}
                  onChange={(e) => updateTimelineEvent(event.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                  placeholder="Describe this event..."
                />
              </div>
            </div>
          </div>
        ))}
        
        {profileData.timeline.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No timeline events added yet.</p>
            <p className="text-sm">Click "Add Event" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Stories & Memories</h3>
        <button
          onClick={addStory}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Custom Story
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Predefined Questions */}
        {storyQuestions.map((question, index) => {
          const existingStory = profileData.stories.find(story => story.question === question)
          return (
            <div key={`predefined-${index}`} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Story {index + 1}</span>
                </div>
                {existingStory && (
                  <button
                    onClick={() => removeStory(existingStory.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <p className="text-gray-600 bg-white px-3 py-2 rounded border">{question}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <textarea
                    value={existingStory?.answer || ''}
                    onChange={(e) => {
                      if (existingStory) {
                        updateStory(existingStory.id, e.target.value)
                      } else {
                        // Create new story for this question
                        const newStory: StoryData = {
                          id: Date.now().toString(),
                          question: question,
                          answer: e.target.value
                        }
                        setProfileData(prev => ({
                          ...prev,
                          stories: [...prev.stories, newStory]
                        }))
                      }
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                    placeholder="Share your story..."
                  />
                </div>
              </div>
            </div>
          )
        })}
        
        {/* Custom Stories */}
        {profileData.stories.filter(story => !storyQuestions.includes(story.question)).map((story, index) => (
          <div key={story.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Custom Story {index + 1}</span>
              </div>
              <button
                onClick={() => removeStory(story.id)}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input
                  type="text"
                  value={story.question}
                  onChange={(e) => updateStory(story.id, story.answer, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                  placeholder="Enter your question..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea
                  value={story.answer}
                  onChange={(e) => updateStory(story.id, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
                  placeholder="Share your story..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Review & Save Changes</h3>
      
      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Name</span>
              <p className="text-gray-900">{profileData.name || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Birth Date</span>
              <p className="text-gray-900">{profileData.birthDate || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Timeline Events ({profileData.timeline.length})</h4>
          {profileData.timeline.length > 0 ? (
            <div className="space-y-2">
              {profileData.timeline.map((event, index) => (
                <div key={event.id} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">{event.institution}</p>
                      <p className="text-xs text-gray-500">{event.startDate} - {event.endDate}</p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No timeline events added</p>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Stories ({profileData.stories.length})</h4>
          {profileData.stories.length > 0 ? (
            <div className="space-y-2">
              {profileData.stories.map((story, index) => (
                <div key={story.id} className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-900 mb-1">{story.question}</p>
                  <p className="text-sm text-gray-600">{story.answer || 'No answer provided'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No stories added</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return renderStep1()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Alumni Profile</h1>
          <p className="text-gray-600 mt-2">Update the profile information and content</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {renderStepIndicator()}

        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderCurrentStep()}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </button>

          <div className="flex space-x-4">
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                Next
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 