'use client'

import { useAuth } from '@/contexts/AuthContext'
import { University, Profile } from '@/types'
import { BuildingOfficeIcon, UserGroupIcon, EyeIcon, PencilIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardNavbar from '@/components/DashboardNavbar'

interface ProfileWithUniversity extends Profile {
  universities?: {
    name: string
  }
}

export default function UniversityAlumniPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const universityId = params.id as string
  
  const [university, setUniversity] = useState<University | null>(null)
  const [alumni, setAlumni] = useState<ProfileWithUniversity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (universityId) {
      // Check if university admin is trying to access a university they don't belong to
      if (user?.user_role === 'university_admin' && user?.university_id && universityId !== user.university_id) {
        setError('You can only access alumni profiles for your assigned university.')
        setLoading(false)
        return
      }
      
      loadUniversityAndAlumni()
    }
  }, [universityId, user])

  const loadUniversityAndAlumni = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load university details
      const { getUniversityById } = await import('@/lib/universities')
      const universityData = await getUniversityById(universityId)
      setUniversity(universityData)
      
      // Load alumni profiles for this university
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          universities!university_id (
            name
          )
        `)
        .eq('university_id', universityId)
        .order('created_at', { ascending: false })
      
      if (profilesError) {
        console.error('Error fetching alumni profiles:', profilesError)
        setError('Failed to load alumni profiles.')
        return
      }
      
      setAlumni(profiles || [])
    } catch (err) {
      console.error('Error loading university and alumni:', err)
      setError('Failed to load university data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredAlumni = alumni.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || profile.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewProfile = (id: string) => {
    router.push(`/dashboard/profiles/${id}`)
  }

  const handleEditProfile = (id: string) => {
    router.push(`/dashboard/profiles/${id}/edit`)
  }

  const handleCreateProfile = () => {
    router.push(`/dashboard/profiles/create?university_id=${universityId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'archived':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute requireDashboardAccess>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </button>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {university?.name || 'University'} Alumni
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage alumni profiles for this university
                </p>
                {university && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    University ID: {university.id}
                  </div>
                )}
              </div>
              <button
                onClick={handleCreateProfile}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Alumni Profile
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search Alumni
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-600 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status Filter
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Alumni List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No alumni found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating the first alumni profile for this university.'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreateProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Alumni Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredAlumni.map((profile) => (
                  <li key={profile.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <UserGroupIcon className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {profile.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {profile.id}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                            {profile.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleViewProfile(profile.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="View profile"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditProfile(profile.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit profile"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              Created: {new Date(profile.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Updated: {new Date(profile.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          {!loading && alumni.length > 0 && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600">
                Showing {filteredAlumni.length} of {alumni.length} alumni profiles
                {searchTerm && ` matching "${searchTerm}"`}
                {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 