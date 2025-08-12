import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getUserRoleDisplayName(role: string) {
  switch (role) {
    case 'viewer':
      return 'Student'
    case 'alumni':
      return 'Alumni'
    case 'university_admin':
      return 'University Admin'
    case 'contributor':
      return 'Contributor'
    case 'editor':
      return 'Editor'
    case 'platform_admin':
      return 'Platform Admin'
    default:
      return role
  }
} 