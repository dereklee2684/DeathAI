'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Logo from './Logo'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

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
      // Redirect to home page after successful sign out
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      // You could show a toast notification here
      alert('Error signing out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo size="3xl" useImage={true} showText={false} />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/universities" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Universities
              </Link>
              <Link href="/training" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Training
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </Link>
                                    {user && user.user_role !== 'viewer' && user.user_role !== 'alumni' && (
                        <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Dashboard
                        </Link>
                      )}
              {user && user.user_role === 'viewer' && (
                <Link href="/role-requests" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Role Requests
                </Link>
              )}
                                    {user && user.user_role === 'platform_admin' && (
                        <Link href="/role-requests" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Manage Role Requests
                        </Link>
                      )}
                      {user && user.user_role === 'university_admin' && (
                        <Link href="/role-requests" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Manage Role Requests
                        </Link>
                      )}
                      {user && user.user_role === 'alumni' && (
                        <Link href="/alumni/profile" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Edit Profile
                        </Link>
                      )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
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
                  <span>{getDisplayName()}</span>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {user && user.user_role !== 'viewer' && user.user_role !== 'alumni' && (
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
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
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 