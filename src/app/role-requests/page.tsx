'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { University, RoleRequest } from '@/types'
import { BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

export default function RoleRequestsPage() {
  const { user } = useAuth()
  const [universities, setUniversities] = useState<University[]>([])
  const [profiles, setProfiles] = useState<Array<{id: string, name: string}>>([])
  const [userRequests, setUserRequests] = useState<RoleRequest[]>([])
  const [allRequests, setAllRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [requestType, setRequestType] = useState<'role_change' | 'alumni_verification' | 'new_profile'>('role_change')
  const [selectedProfile, setSelectedProfile] = useState('')
  const [newProfileName, setNewProfileName] = useState('')

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user?.id && user?.user_role) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      // Check if user ID exists
      if (!user?.id) {
        setError('User ID not found. Please try logging in again.')
        setLoading(false)
        return
      }





      // Initialize Supabase client
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      // Load universities
      const { getUniversities } = await import('@/lib/universities')
      const universitiesData = await getUniversities()
      setUniversities(universitiesData)
      
      // Load profiles for the selected university if one is selected
      if (selectedUniversity) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('university_id', selectedUniversity)
          .order('name')
        setProfiles(profilesData || [])
      }

      // Load role requests

      if (user?.user_role === 'platform_admin') {
        // Platform admin sees all role change requests (university admin requests)
        const { data: allRequestsData, error: allRequestsError } = await supabase
          .from('role_requests')
          .select(`
            *,
            universities!university_id (
              name
            ),
            users!user_id (
              email,
              display_name
            ),
            profiles!profile_id (
              name
            )
          `)
          .eq('request_type', 'role_change')
          .order('created_at', { ascending: false })

        if (allRequestsError) {
          console.error('Error fetching all role requests:', allRequestsError)
          setError('Failed to load role requests.')
          return
        }

        setAllRequests(allRequestsData || [])
      } else if (user?.user_role === 'university_admin' && user?.university_id) {
        // University admin sees alumni requests for their university
        const { data: universityRequestsData, error: universityRequestsError } = await supabase
          .from('role_requests')
          .select(`
            *,
            universities!university_id (
              name
            ),
            users!user_id (
              email,
              display_name
            ),
            profiles!profile_id (
              name
            )
          `)
          .eq('university_id', user.university_id)
          .in('request_type', ['alumni_verification', 'new_profile'])
          .order('created_at', { ascending: false })

        if (universityRequestsError) {
          console.error('Error fetching university role requests:', universityRequestsError)
          setError('Failed to load role requests.')
          return
        }

        setAllRequests(universityRequestsData || [])
      } else {
        // Regular users see only their own requests
        const { data: userRequestsData, error: userRequestsError } = await supabase
          .from('role_requests')
          .select(`
            *,
            universities!university_id (
              name
            ),
            users!user_id (
              email,
              display_name
            ),
            profiles!profile_id (
              name
            )
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })

        if (userRequestsError) {
          console.error('Error fetching user role requests:', userRequestsError)
          setError('Failed to load your role requests.')
          return
        }

        setUserRequests(userRequestsData || [])
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadProfilesForUniversity = async (universityId: string) => {
    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('university_id', universityId)
        .order('name')
      setProfiles(profilesData || [])
    } catch (err) {
      console.error('Error loading profiles:', err)
    }
  }





  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUniversity) {
      setError('Please select a university.')
      return
    }

    // Validate based on request type
    if (requestType === 'alumni_verification' && !selectedProfile) {
      setError('Please select an existing alumni profile.')
      return
    }

    if (requestType === 'new_profile' && !newProfileName.trim()) {
      setError('Please enter a name for the new profile.')
      return
    }

    if (requestType === 'role_change' && user?.user_role !== 'viewer') {
      setError('Only viewers can request role changes.')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      const requestData: {
        user_id: string | undefined
        university_id: string
        request_type: 'role_change' | 'alumni_verification' | 'new_profile'
        status: 'pending'
        requested_role?: string
        profile_id?: string
        existing_profile_name?: string
        new_profile_name?: string
      } = {
        user_id: user?.id,
        university_id: selectedUniversity,
        request_type: requestType,
        status: 'pending'
      }

      // Set role and additional data based on request type
      if (requestType === 'role_change') {
        requestData.requested_role = 'university_admin'
      } else if (requestType === 'alumni_verification') {
        requestData.requested_role = 'alumni'
        requestData.profile_id = selectedProfile
        requestData.existing_profile_name = profiles.find(p => p.id === selectedProfile)?.name
      } else if (requestType === 'new_profile') {
        requestData.requested_role = 'alumni'
        requestData.new_profile_name = newProfileName.trim()
      }

      const { error: insertError } = await supabase
        .from('role_requests')
        .insert(requestData)

      if (insertError) {
        console.error('Error creating role request:', insertError)
        setError('Failed to submit request. Please try again.')
        return
      }

      // Reset form and reload data
      setSelectedUniversity('')
      setRequestType('role_change')
      setSelectedProfile('')
      setNewProfileName('')
      setProfiles([])
      await loadData()
    } catch (err) {
      console.error('Error submitting request:', err)
      setError('Failed to submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      // Get the request details
      const { data: request } = await supabase
        .from('role_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (!request) {
        setError('Request not found.')
        return
      }

      // Update user role and handle different request types
      const updateData: {
        user_role: string
        university_id?: string
      } = { user_role: request.requested_role }
      
      if (request.requested_role === 'university_admin' && request.university_id) {
        updateData.university_id = request.university_id
      } else if (request.requested_role === 'alumni') {
        // Always create a profile for alumni approval
        let profileName = ''
        
        if (request.request_type === 'new_profile' && request.new_profile_name) {
          profileName = request.new_profile_name
        } else if (request.request_type === 'alumni_verification' && request.existing_profile_name) {
          profileName = request.existing_profile_name
        } else {
          // Fallback: use a default name
          profileName = 'Alumni Profile'
        }
        
        // Create a new profile for the user
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            name: profileName,
            university_id: request.university_id,
            status: 'published',
            created_by: request.user_id
          })
          .select()
          .single()
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
          setError('Failed to create profile.')
          return
        }
        
        console.log('Created profile for alumni:', newProfile)
      }
      
      const { error: updateUserError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', request.user_id)

      if (updateUserError) {
        console.error('Error updating user role:', updateUserError)
        setError('Failed to approve request.')
        return
      }

      // Update request status
      const { error: updateRequestError } = await supabase
        .from('role_requests')
        .update({ status: 'approved' })
        .eq('id', requestId)

      if (updateRequestError) {
        console.error('Error updating request status:', updateRequestError)
        setError('Failed to update request status.')
        return
      }

      await loadData()
    } catch (err) {
      console.error('Error approving request:', err)
      setError('Failed to approve request.')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      const { error } = await supabase
        .from('role_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)

      if (error) {
        console.error('Error rejecting request:', error)
        setError('Failed to reject request.')
        return
      }

      await loadData()
    } catch (err) {
      console.error('Error rejecting request:', err)
      setError('Failed to reject request.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isPlatformAdmin = user?.user_role === 'platform_admin'
  const requests = isPlatformAdmin || user?.user_role === 'university_admin' ? allRequests : userRequests

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {user?.user_role === 'university_admin' ? 'Alumni Requests' : 'Role Requests'}
          </h1>
          <p className="mt-2 text-lg text-gray-800">
            {isPlatformAdmin 
              ? 'Review and manage university admin role requests from viewers'
              : user?.user_role === 'university_admin'
              ? 'Review and manage alumni verification requests for your university'
              : 'Request role changes and view your request history'
            }
          </p>

        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Request Form for Viewers */}
        {user?.user_role === 'viewer' && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Submit Request
            </h2>
            

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              {/* Request Type Selection */}
              <div>
                <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">
                  Request Type
                </label>
                <select
                  id="requestType"
                  value={requestType}
                  onChange={(e) => {
                    setRequestType(e.target.value as 'role_change' | 'alumni_verification' | 'new_profile')
                    setSelectedProfile('')
                    setNewProfileName('')
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                >
                  <option value="role_change">Request University Admin Role</option>
                  <option value="alumni_verification">Claim Existing Alumni Profile</option>
                  <option value="new_profile">Request New Alumni Profile</option>
                </select>
              </div>

              {/* University Selection */}
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                  Select University
                </label>
                <select
                  id="university"
                  value={selectedUniversity}
                  onChange={(e) => {
                    setSelectedUniversity(e.target.value)
                    if (e.target.value) {
                      loadProfilesForUniversity(e.target.value)
                    } else {
                      setProfiles([])
                    }
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                >
                  <option value="">Choose a university...</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Existing Profile Selection (for alumni verification) */}
              {requestType === 'alumni_verification' && selectedUniversity && (
                <div>
                  <label htmlFor="profile" className="block text-sm font-medium text-gray-700">
                    Select Existing Alumni Profile
                  </label>
                  <select
                    id="profile"
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    required
                  >
                    <option value="">Choose an alumni profile...</option>
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                      </option>
                    ))}
                  </select>
                  {profiles.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      No alumni profiles found for this university.
                    </p>
                  )}
                </div>
              )}

              {/* New Profile Name (for new profile requests) */}
              {requestType === 'new_profile' && selectedUniversity && (
                <div>
                  <label htmlFor="newProfileName" className="block text-sm font-medium text-gray-700">
                    Alumni Name
                  </label>
                  <input
                    type="text"
                    id="newProfileName"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter the alumni's full name"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !selectedUniversity || 
                  (requestType === 'alumni_verification' && !selectedProfile) ||
                  (requestType === 'new_profile' && !newProfileName.trim())
                }
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No role requests</h3>
            <p className="mt-1 text-sm text-gray-700">
              {isPlatformAdmin 
                ? 'No pending role requests to review.'
                : 'You haven\'t submitted any role requests yet.'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {requests.map((request) => (
                <li key={request.id}>
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
                            {request.request_type === 'role_change' && `Request for ${request.requested_role.replace('_', ' ').toUpperCase()}`}
                            {request.request_type === 'alumni_verification' && `Claim Alumni Profile: ${request.existing_profile_name || request.profiles?.name || 'Unknown Profile'}`}
                            {request.request_type === 'new_profile' && `Request New Profile: ${request.new_profile_name}`}
                          </div>
                          {isPlatformAdmin && request.users && (
                            <div className="text-sm text-gray-700">
                              Requested by: {request.users.display_name || request.users.email || 'Unknown User'}
                            </div>
                          )}
                          {request.universities?.name && (
                            <div className="text-sm text-gray-700">
                              University: {request.universities.name}
                            </div>
                          )}
                          {request.request_type === 'alumni_verification' && request.existing_profile_name && (
                            <div className="text-sm text-gray-700">
                              Profile: {request.existing_profile_name}
                            </div>
                          )}
                          {request.request_type === 'new_profile' && request.new_profile_name && (
                            <div className="text-sm text-gray-700">
                              New Profile: {request.new_profile_name}
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            Submitted: {new Date(request.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                        {(isPlatformAdmin || user?.user_role === 'university_admin') && request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        )}
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
  )
} 