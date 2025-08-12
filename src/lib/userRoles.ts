import { supabase } from './supabase'
import { UserRole } from '@/types'

export async function fetchUserRole(userId: string): Promise<UserRole | null> {
  try {
    console.log('Fetching user role for userId:', userId)
    
    // First, try to get the user role from the current session
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser && currentUser.id === userId && currentUser.user_metadata?.user_role) {
      console.log('Found user role in auth metadata:', currentUser.user_metadata.user_role)
      return currentUser.user_metadata.user_role as UserRole
    }
    
    console.log('Attempting to query users table...')
    const { data, error } = await supabase
      .from('users')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user role - Full error object:', JSON.stringify(error, null, 2))
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      
      // If user doesn't exist in public.users, try to create them
      if (error.code === 'PGRST116' || (error.message && error.message.includes('0 rows'))) {
        console.log('User not found in public.users, attempting to create...')
        const created = await ensureUserExists(userId, '', '')
        if (created) {
          // Try fetching again
          const { data: retryData, error: retryError } = await supabase
            .from('users')
            .select('user_role')
            .eq('id', userId)
            .single()
          
          if (!retryError && retryData) {
            console.log('Successfully fetched user role after creation:', retryData.user_role)
            return retryData.user_role
          } else {
            console.error('Error fetching user role after creation:', retryError)
          }
        }
      }
      
      return null
    }

    console.log('Successfully fetched user role:', data?.user_role)
    return data?.user_role || null
  } catch (error) {
    console.error('Exception in fetchUserRole:', error)
    console.error('Error type:', typeof error)
    console.error('Error stringified:', JSON.stringify(error, null, 2))
    return null
  }
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ user_role: newRole })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user role:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating user role:', error)
    return false
  }
}

export async function ensureUserExists(userId: string, email: string = '', displayName?: string): Promise<boolean> {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (existingUser) {
      return true // User already exists
    }

    // If email is not provided, try to get it from auth.users
    let userEmail = email
    let userDisplayName = displayName
    
    if (!userEmail) {
      try {
        // Try to get user info from the current session instead of admin API
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser && currentUser.id === userId) {
          userEmail = currentUser.email || ''
          userDisplayName = currentUser.user_metadata?.display_name || userEmail
        }
      } catch (authError) {
        console.error('Error getting user from auth:', authError)
      }
    }

    // Create user if they don't exist
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: userEmail,
        display_name: userDisplayName || userEmail,
        user_role: 'university_admin' // Default to university_admin for now
      })

    if (error) {
      console.error('Error creating user:', error)
      return false
    }

    console.log('User created successfully in public.users')
    return true
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    return false
  }
} 