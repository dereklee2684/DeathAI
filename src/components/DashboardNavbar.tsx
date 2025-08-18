'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Logo from './Logo'
import { 
  ChevronDownIcon, 
  HomeIcon, 
  BellIcon
} from '@heroicons/react/24/outline'
import { fetchUserRole } from '@/lib/userRoles'

export default function DashboardNavbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [actualUserRole, setActualUserRole] = useState<string | null>(null)

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase()
  }

  const getDisplayName = () => {
    if (!user) return ''
    return user.display_name || user.user_metadata?.display_name || user.email || 'User'
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      setIsDropdownOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error signing out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  // Fetch actual user role from database
  useEffect(() => {
    if (user?.id) {
      fetchUserRole(user.id)
        .then(role => {
          if (role) {
            setActualUserRole(role)
          }
        })
        .catch(error => {
          console.error('Error fetching user role in navbar:', error)
        })
    }
  }, [user?.id])

  // Get breadcrumb based on current path
  const getBreadcrumb = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname.includes('/profiles')) return 'Alumni Profiles'
    if (pathname.includes('/users')) return 'User Management'
    if (pathname.includes('/universities')) return 'Universities'
    if (pathname.includes('/analytics')) return 'Analytics'
    if (pathname.includes('/settings')) return 'Settings'
    return 'Dashboard'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Breadcrumb */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <Logo size="3xl" useImage={true} showText={false} />
            </Link>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <HomeIcon className="h-4 w-4" />
              <span>/</span>
              <span className="font-medium text-gray-900">{getBreadcrumb()}</span>
            </div>
          </div>

          {/* Center - Dashboard Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              <Link 
                href="/" 
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-purple-600 hover:bg-gray-50"
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/dashboard' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/profiles" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.includes('/profiles') 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                Profiles
              </Link>

              {user?.user_role === 'platform_admin' && (
                <>
                  <Link 
                    href="/dashboard/users" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname.includes('/users') 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    Users
                  </Link>
                  <Link 
                    href="/dashboard/universities" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname.includes('/universities') 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    Universities
                  </Link>
                </>
              )}
              <Link 
                href="/dashboard/analytics" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.includes('/analytics') 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                Analytics
              </Link>
            </div>
          </div>

          {/* Right side - User menu and notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors">
              <BellIcon className="h-5 w-5" />
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getInitials(getDisplayName())}
                  </span>
                </div>
                <span className="hidden md:block">{getDisplayName()}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-purple-600 font-medium mt-1">
                      {(actualUserRole || user?.user_role || 'viewer').replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/dashboard/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <Link 
                    href="/" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Back to Site
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 