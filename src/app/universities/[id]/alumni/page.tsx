'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { MagnifyingGlassIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Profile {
  id: string
  name: string
  status: 'draft' | 'pending_review' | 'published' | 'archived'
  profile_photo_url?: string
  created_at: string
  universities?: {
    name: string
  }
}

interface University {
  id: string
  name: string
  code?: string
}

export default function UniversityAlumniPage() {
  const router = useRouter()
  const params = useParams()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (params.id) {
      loadUniversityAndAlumni()
    }
  }, [params.id])

  const loadUniversityAndAlumni = async () => {
    try {
      setLoading(true)
      setError('')

      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      // Load university details
      const { data: universityData, error: universityError } = await supabase
        .from('universities')
        .select('*')
        .eq('id', params.id)
        .single()

      if (universityError) {
        console.error('Error loading university:', universityError)
        setError('University not found.')
        return
      }

      setUniversity(universityData)

      // Load published alumni profiles for this university
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          universities!university_id (
            name
          )
        `)
        .eq('university_id', params.id)
        .eq('status', 'published')
        .order('name', { ascending: true })

      if (profilesError) {
        console.error('Error loading profiles:', profilesError)
        setError('Failed to load alumni profiles.')
        return
      }

      setProfiles(profilesData || [])
    } catch (err) {
      console.error('Error loading university and alumni:', err)
      setError('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleProfileClick = (profileId: string) => {
    router.push(`/profiles/${profileId}`)
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

  if (error || !university) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg">{error || 'University not found'}</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/universities" className="inline-flex items-center text-purple-600 hover:text-purple-700 mr-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Universities
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {university.name} Alumni
          </h1>
          {university.code && (
            <p className="mt-1 text-lg text-gray-600">
              Code: {university.code}
            </p>
          )}
          <p className="mt-2 text-lg text-gray-800">
            Discover the achievements and stories of our alumni
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search alumni by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Alumni Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  {profile.profile_photo_url ? (
                    <img
                      src={profile.profile_photo_url}
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <UserIcon className="h-8 w-8 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Alumni
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-purple-600 hover:text-purple-700">
                  <span>View Profile</span>
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm ? (
                <>
                  <p className="text-lg">No alumni found</p>
                  <p className="mt-2">Try adjusting your search terms.</p>
                </>
              ) : (
                <>
                  <p className="text-lg">No alumni profiles available</p>
                  <p className="mt-2">Check back later for updates.</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Showing {filteredProfiles.length} of {profiles.length} alumni profiles
          </p>
        </div>
      </div>
    </div>
  )
} 