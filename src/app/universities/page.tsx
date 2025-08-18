'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline'

interface University {
  id: string
  name: string
  code?: string
  logo_url?: string
}

export default function UniversitiesPage() {
  const router = useRouter()
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUniversities()
  }, [])

  const loadUniversities = async () => {
    try {
      setLoading(true)
      setError('')

      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from('universities')
        .select('*')
        .order('name', { ascending: true })

      if (fetchError) {
        console.error('Error loading universities:', fetchError)
        setError('Failed to load universities.')
        return
      }

      setUniversities(data || [])
    } catch (err) {
      console.error('Error loading universities:', err)
      setError('Failed to load universities.')
    } finally {
      setLoading(false)
    }
  }

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (university.code && university.code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleUniversityClick = (universityId: string) => {
    router.push(`/universities/${universityId}/alumni`)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Universities
          </h1>
          <p className="mt-2 text-lg text-gray-800">
            Browse universities and discover their alumni
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Universities Grid */}
        {filteredUniversities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((university) => (
              <div
                key={university.id}
                onClick={() => handleUniversityClick(university.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {university.name}
                  </h3>
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                </div>
                {university.code && (
                  <p className="text-sm text-gray-600 mb-4">
                    Code: {university.code}
                  </p>
                )}
                <div className="flex items-center text-sm text-purple-600 hover:text-purple-700">
                  <span>View Alumni</span>
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
                  <p className="text-lg">No universities found</p>
                  <p className="mt-2">Try adjusting your search terms.</p>
                </>
              ) : (
                <>
                  <p className="text-lg">No universities available</p>
                  <p className="mt-2">Check back later for updates.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 