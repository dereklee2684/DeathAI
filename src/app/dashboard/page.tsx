'use client'

import { useAuth } from '@/contexts/AuthContext'
import { isPlatformAdmin, isUniversityAdmin, isAlumni, canManageUniversities, canCreateProfiles } from '@/lib/auth'
import { UserRole } from '@/types'
import { PlusIcon, EyeIcon, Cog6ToothIcon, ShieldCheckIcon, UserGroupIcon, UsersIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { fetchUserRole } from '@/lib/userRoles'
import { useEffect, useState } from 'react'

import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardNavbar from '@/components/DashboardNavbar'

export default function DashboardPage() {
  const { user, refreshUser } = useAuth()
  const [actualUserRole, setActualUserRole] = useState<string | null>(null)
  const [loadingRole, setLoadingRole] = useState(false)

  useEffect(() => {
    // Debug logging
    console.log('Dashboard useEffect triggered:', {
      userId: user?.id,
      userRole: user?.user_role,
      userEmail: user?.email
    })

    // Fetch the actual user role from database if user exists
    if (user?.id) {
      setLoadingRole(true)
      fetchUserRole(user.id)
        .then(role => {
          console.log('Fetched role from database:', role)
          if (role) {
            setActualUserRole(role)
            // Update the user context with the actual role
            if (role !== user.user_role) {
              console.log('Role mismatch, refreshing user context')
              refreshUser()
            }
          }
        })
        .catch(error => {
          console.error('Error fetching user role:', error)
        })
        .finally(() => {
          setLoadingRole(false)
        })
    }
  }, [user?.id, user?.user_role, user?.email, refreshUser])

  if (!user) {
    return null // ProtectedRoute will handle the redirect
  }

  // Use actual role from database if available, otherwise fall back to auth metadata
  const effectiveRole = actualUserRole || user.user_role || 'viewer'

  return (
    <ProtectedRoute requireDashboardAccess>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Welcome back, {user.display_name || user.email}
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {effectiveRole.replace('_', ' ').toUpperCase()}
              </span>
              {loadingRole && (
                <span className="text-xs text-gray-500">(Updating role...)</span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Alumni Profiles - Available to all dashboard users */}
            <Link href="/dashboard/profiles" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Alumni Profiles</h3>
                  <p className="text-sm text-gray-600">
                                {isPlatformAdmin({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) || isUniversityAdmin({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) 
              ? 'Manage and review alumni profiles' 
              : 'View and edit your profile'}
                  </p>
                </div>
              </div>
            </Link>
            
            {/* Create Profile - Available to alumni and admins */}
            {canCreateProfiles({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) && (
              <Link href="/dashboard/profiles/create" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <PlusIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Create Profile</h3>
                    <p className="text-sm text-gray-600">Create a new alumni profile</p>
                  </div>
                </div>
              </Link>
            )}

            {/* User Management - Platform Admin Only */}
            {isPlatformAdmin({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) && (
              <Link href="/dashboard/users" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-600">Manage all users and roles</p>
                  </div>
                </div>
              </Link>
            )}

            {/* University Management - Platform Admin Only */}
            {canManageUniversities({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) && (
              <Link href="/dashboard/universities" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Universities</h3>
                    <p className="text-sm text-gray-600">Manage universities</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Settings - Available to all dashboard users */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Configure your settings</p>
                </div>
              </div>
            </div>
            
            {/* Analytics - Available to admins */}
            {(isPlatformAdmin({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) || isUniversityAdmin({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' })) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <EyeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-600">View engagement metrics</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role-specific content */}
          {isPlatformAdmin({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Platform Administrator</h3>
                  <p className="text-yellow-700">
                    You have full system access. You can manage all users, universities, and content.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isUniversityAdmin({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">University Administrator</h3>
                  <p className="text-blue-700">
                    You can manage users and content within your university.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isAlumni({ ...user, user_role: effectiveRole as UserRole, email: user.email || '' }) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Alumni</h3>
                  <p className="text-green-700">
                    You can create and manage your alumni profile. Contact an administrator to get approval for publishing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 