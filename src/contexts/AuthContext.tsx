'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User, AuthError, Session } from '@supabase/supabase-js'
import { UserRole } from '@/types'

interface ExtendedUser extends User {
  user_role?: UserRole
  display_name?: string
  university_id?: string
}

interface AuthContextType {
  user: ExtendedUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, displayName: string, userRole: UserRole) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const updateUserWithBasicInfo = async (authUser: User | null) => {
    if (!authUser) {
      setUser(null)
      setLoading(false)
      return
    }

    // Set basic user info immediately
    const displayName = authUser.user_metadata?.display_name || authUser.email
    const cachedUserRole = authUser.user_metadata?.user_role || 'viewer' // Default to viewer

    const extendedUser: ExtendedUser = {
      ...authUser,
      user_role: cachedUserRole as UserRole,
      display_name: displayName
    }

    setUser(extendedUser)
    setLoading(false)

    // Fetch actual role and university_id from database to ensure accuracy (non-blocking with timeout)
    const fetchUserDataWithTimeout = async () => {
      try {
        const { fetchUserRole } = await import('@/lib/userRoles')
        const actualRole = await Promise.race([
          fetchUserRole(authUser.id),
          new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error('Role fetch timeout')), 5000)
          )
        ]) as string
        
        // Fetch university_id for university admins
        let universityId: string | undefined
        if (actualRole === 'university_admin') {
          const { data: userData } = await supabase
            .from('users')
            .select('university_id')
            .eq('id', authUser.id)
            .single()
          universityId = userData?.university_id
        }
        
        if (actualRole && (actualRole !== cachedUserRole || universityId)) {
          console.log('Updating user data from database:', { cached: cachedUserRole, actual: actualRole, universityId })
          setUser(prevUser => prevUser ? {
            ...prevUser,
            user_role: actualRole as UserRole,
            university_id: universityId
          } : null)
        }
      } catch (error) {
        console.error('Error fetching actual user data:', error)
        // Don't block the UI if data fetching fails - user can still use the app with cached data
      }
    }

    // Start data fetching in background
    fetchUserDataWithTimeout()
  }

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          await updateUserWithBasicInfo(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        if (mounted) {
          console.log('Auth state change:', event, session?.user?.email)
          await updateUserWithBasicInfo(session?.user ?? null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string, displayName: string, userRole: UserRole) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            user_role: userRole,
          },
        },
      })
      return { error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      // Clear user state immediately
      setUser(null)
      setLoading(false)
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      
      // Force a page reload to clear any cached state
      window.location.href = '/'
    } catch (error) {
      console.error('Error in signOut:', error)
      // Even if there's an error, clear the local state
      setUser(null)
      setLoading(false)
      throw error
    }
  }

  const refreshUser = async () => {
    // Refresh the session and update user info
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await updateUserWithBasicInfo(session?.user ?? null)
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 