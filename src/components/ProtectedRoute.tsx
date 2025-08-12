'use client'

import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import { hasHigherOrEqualRole, canAccessDashboard } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requireAuth?: boolean
  requireDashboardAccess?: boolean
  fallback?: React.ReactNode
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
  requireDashboardAccess = false,
  fallback
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Debug logging
      console.log('ProtectedRoute check:', {
        user: user?.email,
        userRole: user?.user_role,
        requireAuth,
        requireDashboardAccess,
        requiredRole,
        canAccessDashboard: canAccessDashboard({ ...user, email: user?.email || '', id: user?.id || '' }),
        hasHigherOrEqualRole: requiredRole ? hasHigherOrEqualRole({ ...user, email: user?.email || '', id: user?.id || '' }, requiredRole) : 'N/A'
      })

      // If authentication is required and user is not logged in
      if (requireAuth && !user) {
        console.log('Redirecting to signin - no user')
        router.push('/auth/signin')
        return
      }

      // If dashboard access is required and user doesn't have it
      if (requireDashboardAccess && !canAccessDashboard({ ...user, email: user?.email || '', id: user?.id || '' })) {
        console.log('Redirecting to home - no dashboard access')
        router.push('/')
        return
      }

      // If a specific role is required and user doesn't have it
      if (requiredRole && !hasHigherOrEqualRole({ ...user, email: user?.email || '', id: user?.id || '' }, requiredRole)) {
        console.log('Redirecting to home - insufficient role')
        router.push('/')
        return
      }
    }
  }, [user, loading, requireAuth, requireDashboardAccess, requiredRole, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // If dashboard access is required and user doesn't have it
  if (requireDashboardAccess && !canAccessDashboard({ ...user, email: user?.email || '', id: user?.id || '' })) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access the dashboard.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && !hasHigherOrEqualRole({ ...user, email: user?.email || '', id: user?.id || '' }, requiredRole)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need {requiredRole.replace('_', ' ')} privileges to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // User has required permissions, render children
  return <>{children}</>
} 