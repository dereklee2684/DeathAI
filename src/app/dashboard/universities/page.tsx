'use client'

import { useAuth } from '@/contexts/AuthContext'
import { canManageUniversities } from '@/lib/auth'
import { University } from '@/types'
import { BuildingOfficeIcon, PlusIcon, TrashIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardNavbar from '@/components/DashboardNavbar'

export default function UniversitiesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [universities, setUniversities] = useState<University[]>([])
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUniversities()
  }, [])

  const loadUniversities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { getUniversities } = await import('@/lib/universities')
      let data = await getUniversities()
      
      // For university admins, only show their assigned university
      if (user?.user_role === 'university_admin' && user?.university_id) {
        data = data.filter(university => university.id === user.university_id)
      }
      
      setUniversities(data)
      setFilteredUniversities(data)
    } catch (err) {
      console.error('Error loading universities:', err)
      setError('Failed to load universities. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUniversity = () => {
    router.push('/dashboard/universities/create')
  }

  const handleEditUniversity = (id: string) => {
    router.push(`/dashboard/universities/${id}/alumni`)
  }

  const handleDeleteUniversity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university? This action cannot be undone.')) {
      return
    }

    try {
      const { deleteUniversity } = await import('@/lib/universities')
      const success = await deleteUniversity(id)
      
      if (success) {
        await loadUniversities() // Refresh the list
      } else {
        setError('Failed to delete university. Please try again.')
      }
    } catch (err) {
      console.error('Error deleting university:', err)
      setError('Failed to delete university. Please try again.')
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === '') {
      setFilteredUniversities(universities)
    } else {
      const filtered = universities.filter(university =>
        university.name.toLowerCase().includes(term.toLowerCase()) ||
        (university.code && university.code.toLowerCase().includes(term.toLowerCase()))
      )
      setFilteredUniversities(filtered)
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
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Universities
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage universities in the system
                </p>
              </div>
              {canManageUniversities({ ...user, email: user.email || '' }) && (
                <button
                  onClick={handleCreateUniversity}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add University
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Search Filter */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search universities by name or code..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredUniversities.length} of {universities.length} universities
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'No universities found' : 'No universities'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? `No universities match "${searchTerm}". Try adjusting your search terms.`
                  : 'Get started by creating a new university.'
                }
              </p>
              {canManageUniversities({ ...user, email: user.email || '' }) && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateUniversity}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add University
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredUniversities.map((university) => (
                  <li key={university.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {university.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {university.code && (
                                <span className="mr-2">Code: {university.code}</span>
                              )}
                              <span>ID: {university.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {canManageUniversities({ ...user, email: user.email || '' }) && (
                            <>
                              <button
                                onClick={() => handleEditUniversity(university.id)}
                                className="text-gray-400 hover:text-gray-600"
                                title="View alumni"
                              >
                                <UserGroupIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUniversity(university.id)}
                                className="text-gray-400 hover:text-red-600"
                                title="Delete university"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              Created: {new Date(university.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Updated: {new Date(university.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 