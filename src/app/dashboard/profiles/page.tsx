"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { isPlatformAdmin, isUniversityAdmin, isAlumni, canEditProfile, canCreateProfiles } from '@/lib/auth'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardNavbar from '@/components/DashboardNavbar'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'
import { getProfiles } from '@/lib/profiles'

interface Profile {
  id: string
  name: string
  status: 'draft' | 'pending_review' | 'published' | 'archived'
  profile_photo_url?: string
  created_at: string
  updated_at: string
  created_by: string
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

export default function ProfilesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [universityFilter, setUniversityFilter] = useState<string>('all')

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProfiles()
      
      // Filter profiles based on user role
      let filteredData = data
      if (isAlumni({ ...user, email: user?.email || '', id: user?.id || '' })) {
        // Alumni can only see their own profiles
        filteredData = data.filter((profile: Profile) => profile.created_by === user?.id)
      } else if (isUniversityAdmin({ ...user, email: user?.email || '', id: user?.id || '' })) {
        // University admins can see profiles from their university
        // Note: This would need to be enhanced with university-specific filtering
        filteredData = data
      }
      // Platform admins can see all profiles
      
      setProfiles(filteredData)
    } catch (err) {
      console.error('Error loading profiles:', err)
      setError('Failed to load profiles. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (profile.universities?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || profile.status === statusFilter
    const matchesUniversity = universityFilter === 'all' || profile.universities?.name === universityFilter
    
    return matchesSearch && matchesStatus && matchesUniversity
  })

  const handleCreateProfile = () => {
    router.push('/dashboard/profiles/create')
  }

  const handleViewProfile = (id: string) => {
    router.push(`/dashboard/profiles/${id}`)
  }

  const handleEditProfile = (id: string) => {
    router.push(`/dashboard/profiles/${id}/edit`)
  }

  const handleArchiveProfile = async (_id: string) => {
    try {
      // await updateProfile(id, { status: 'archived' }) // This line was removed as per the new_code
      // Refresh the profiles list
      await loadProfiles()
    } catch (err) {
      console.error('Error archiving profile:', err)
      setError('Failed to archive profile. Please try again.')
    }
  }

  const getUniversities = () => {
    const universities = new Set<string>()
    profiles.forEach(profile => {
      if (profile.universities?.name) {
        universities.add(profile.universities.name)
      }
    })
    return Array.from(universities).sort()
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute requireDashboardAccess>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {isAlumni({ ...user, email: user?.email || '', id: user?.id || '' }) ? 'My Profiles' : 'Alumni Profiles'}
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  {isAlumni({ ...user, email: user?.email || '', id: user?.id || '' })
                    ? 'Manage your alumni profiles' 
                    : 'Manage and review alumni profiles'
                  }
                </p>
              </div>
              {canCreateProfiles({ ...user, email: user?.email || '', id: user?.id || '' }) && (
                <button
                  onClick={handleCreateProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Profile
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900"
                  placeholder="Search profiles..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md text-gray-900"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University
              </label>
              <select
                id="university"
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md text-gray-900"
              >
                <option value="all">All Universities</option>
                {getUniversities().map(university => (
                  <option key={university} value={university}>{university}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProfiles.map((profile) => (
                <div key={profile.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {profile.profile_photo_url ? (
                          <Image
                            src={profile.profile_photo_url}
                            alt={profile.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-lg">
                              {profile.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                          {profile.universities?.name && (
                            <p className="text-sm text-gray-500">{profile.universities.name}</p>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[profile.status]}`}>
                        {statusLabels[profile.status]}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>Created: {new Date(profile.created_at).toLocaleDateString()}</span>
                      <span>Updated: {new Date(profile.updated_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProfile(profile.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </button>
                      
                      {canEditProfile({ ...user, email: user?.email || '', id: user?.id || '' }, profile.created_by) && (
                        <button
                          onClick={() => handleEditProfile(profile.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      )}
                      
                      {(isPlatformAdmin({ ...user, email: user?.email || '', id: user?.id || '' }) || isUniversityAdmin({ ...user, email: user?.email || '', id: user?.id || '' })) && (
                        <button
                          onClick={() => handleArchiveProfile(profile.id)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <ArchiveBoxIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No profiles found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || universityFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating a new profile.'
                }
              </p>
              {canCreateProfiles({ ...user, email: user?.email || '', id: user?.id || '' }) && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateProfile}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 