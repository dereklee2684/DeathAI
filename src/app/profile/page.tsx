import Navigation from '@/components/Navigation'
import { PencilIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <Link href="/alumni/profile" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">user@example.com</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <p className="mt-1 text-sm text-gray-900">John Doe</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900">Platform Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 