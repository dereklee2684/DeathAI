'use client'

import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import { hasHigherOrEqualRole, canAccessDashboard } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [dashboardAccess, setDashboardAccess] = useState<boolean | null>(null)
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false)

  useEffect(() => {
    if (!loading) {
      // Debug logging
      console.log('ProtectedRoute check:', {
        user: user?.email,
        userRole: user?.user_role,
        requireAuth,
        requireDashboardAccess,
        requiredRole,
        hasCheckedAccess,
        dashboardAccess,
        hasHigherOrEqualRole: requiredRole ? hasHigherOrEqualRole(user, requiredRole) : 'N/A'
      })

      // If authentication is required and user is not logged in
      if (requireAuth && !user) {
        console.log('Redirecting to signin - no user')
        router.replace('/auth/signin')
        return
      }

      // If dashboard access is required, check it asynchronously (only once)
      if (requireDashboardAccess && !hasCheckedAccess && user?.id) {
        setHasCheckedAccess(true)
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Dashboard access check timeout')), 5000)
        )
        
        Promise.race([
          canAccessDashboard(user),
          timeoutPromise
        ])
          .then(hasAccess => {
            console.log('Dashboard access check result:', hasAccess)
            setDashboardAccess(hasAccess as boolean)
          })
          .catch(error => {
            console.error('Error checking dashboard access:', error)
            setDashboardAccess(false)
          })
        return
      }

      // If a specific role is required and user doesn't have it
      if (requiredRole && !hasHigherOrEqualRole(user, requiredRole)) {
        console.log('Redirecting to home - insufficient role')
        router.replace('/')
        return
      }
    }
  }, [user?.id, user?.email, loading, requireAuth, requireDashboardAccess, requiredRole, router, hasCheckedAccess])

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
            onClick={() => router.replace('/auth/signin')}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // If dashboard access is still being checked, show loading
  if (requireDashboardAccess && dashboardAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // If dashboard access is required and user doesn't have it
  if (requireDashboardAccess && dashboardAccess === false) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access the dashboard.</p>
          <button
            onClick={() => router.replace('/')}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }



  // If a specific role is required and user doesn't have it
  if (requiredRole && !hasHigherOrEqualRole(user, requiredRole)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need {requiredRole.replace('_', ' ')} privileges to access this page.
          </p>
          <button
            onClick={() => router.replace('/')}
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