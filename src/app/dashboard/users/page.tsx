'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserRole } from '@/lib/auth'
import { UserRole } from '@/types'
import ProtectedRoute from '@/components/ProtectedRoute'
import { UserIcon, ShieldCheckIcon, BuildingOfficeIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline'

interface User {
  id: string
  email: string
  display_name?: string
  user_role?: UserRole
  created_at: string
}

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingUser(userId)
      await updateUserRole(userId, newRole)
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, user_role: newRole } : u
        )
      )
    } catch (err) {
      console.error('Error updating user role:', err)
      setError('Failed to update user role')
    } finally {
      setUpdatingUser(null)
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'platform_admin':
        return <ShieldCheckIcon className="h-5 w-5 text-red-600" />
      case 'university_admin':
        return <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
      case 'alumni':
        return <UserGroupIcon className="h-5 w-5 text-green-600" />
      case 'viewer':
        return <EyeIcon className="h-5 w-5 text-gray-600" />
      default:
        return <UserIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'platform_admin':
        return 'bg-red-100 text-red-800'
      case 'university_admin':
        return 'bg-blue-100 text-blue-800'
      case 'alumni':
        return 'bg-green-100 text-green-800'
      case 'viewer':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute requiredRole="platform_admin">
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              User Management
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage user roles and permissions
            </p>
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
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {users.map((userItem) => (
                  <li key={userItem.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {userItem.display_name || 'No name set'}
                              </p>
                              <div className="ml-2 flex items-center">
                                {getRoleIcon(userItem.user_role || 'viewer')}
                                <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userItem.user_role || 'viewer')}`}>
                                  {userItem.user_role?.replace('_', ' ').toUpperCase() || 'VIEWER'}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">{userItem.email}</p>
                            <p className="text-sm text-gray-400">
                              Joined {new Date(userItem.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={userItem.user_role || 'viewer'}
                            onChange={(e) => handleRoleUpdate(userItem.id, e.target.value as UserRole)}
                            disabled={updatingUser === userItem.id}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="alumni">Alumni</option>
                            <option value="university_admin">University Admin</option>
                            <option value="platform_admin">Platform Admin</option>
                          </select>
                          {updatingUser === userItem.id && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no users in the system yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 