import { UserRole } from '@/types'

// Extended user type that matches what AuthContext provides
interface ExtendedUser {
  id: string
  email: string
  display_name?: string
  user_role?: UserRole
  created_at?: string
  updated_at?: string
}

// Role checking utilities
export function hasRole(user: ExtendedUser | null, role: UserRole): boolean {
  return user?.user_role === role
}

export function hasAnyRole(user: ExtendedUser | null, roles: UserRole[]): boolean {
  return user?.user_role ? roles.includes(user.user_role) : false
}

export function isPlatformAdmin(user: ExtendedUser | null): boolean {
  return hasRole(user, 'platform_admin')
}

export function isUniversityAdmin(user: ExtendedUser | null): boolean {
  return hasRole(user, 'university_admin')
}

export function isAlumni(user: ExtendedUser | null): boolean {
  return hasRole(user, 'alumni')
}

export function isViewer(user: ExtendedUser | null): boolean {
  return hasRole(user, 'viewer')
}

// Permission checking utilities
export function canManageAllUsers(user: ExtendedUser | null): boolean {
  return isPlatformAdmin(user)
}

export function canManageUniversityUsers(user: ExtendedUser | null): boolean {
  return isPlatformAdmin(user) || isUniversityAdmin(user)
}

export function canEditProfile(user: ExtendedUser | null, profileCreatedBy: string): boolean {
  return isPlatformAdmin(user) || 
         isUniversityAdmin(user) || 
         (isAlumni(user) && user?.id === profileCreatedBy)
}

export function canViewProfile(user: ExtendedUser | null, profileStatus: string, profileCreatedBy: string): boolean {
  // Platform admins can view all profiles
  if (isPlatformAdmin(user)) return true
  
  // University admins can view profiles from their university
  if (isUniversityAdmin(user)) return true
  
  // Alumni can view their own profile regardless of status
  if (isAlumni(user) && user?.id === profileCreatedBy) return true
  
  // Everyone can view published profiles
  if (profileStatus === 'published') return true
  
  return false
}

export function canAccessDashboard(user: ExtendedUser | null): boolean {
  // Debug logging
  console.log('canAccessDashboard check:', {
    user: user?.email,
    role: user?.user_role,
    isPlatformAdmin: isPlatformAdmin(user),
    isUniversityAdmin: isUniversityAdmin(user),
    isAlumni: isAlumni(user)
  })
  
  return isPlatformAdmin(user) || isUniversityAdmin(user) || isAlumni(user)
}

export function canCreateProfiles(user: ExtendedUser | null): boolean {
  return isPlatformAdmin(user) || isUniversityAdmin(user) || isAlumni(user)
}

export function canApproveProfiles(user: ExtendedUser | null): boolean {
  return isPlatformAdmin(user) || isUniversityAdmin(user)
}

export function canManageUniversities(user: ExtendedUser | null): boolean {
  return isPlatformAdmin(user)
}

// Role hierarchy utilities
export function getRoleHierarchy(role: UserRole): number {
  const hierarchy = {
    'platform_admin': 4,
    'university_admin': 3,
    'alumni': 2,
    'viewer': 1,
    'editor': 2,
    'contributor': 1
  }
  return hierarchy[role] || 0
}

export function hasHigherOrEqualRole(user: ExtendedUser | null, requiredRole: UserRole): boolean {
  if (!user?.user_role) return false
  return getRoleHierarchy(user.user_role) >= getRoleHierarchy(requiredRole)
}

// User role management
export async function updateUserRole(userId: string, newRole: UserRole) {
  const { supabase } = await import('./supabase')
  
  const { data, error } = await supabase
    .from('users')
    .update({ user_role: newRole })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating user role:', error)
    throw error
  }
  
  return data
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { supabase } = await import('./supabase')
  
  const { data, error } = await supabase
    .from('users')
    .select('user_role')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error getting user role:', error)
    return null
  }
  
  return data?.user_role || null
} 