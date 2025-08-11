import Navigation from '@/components/Navigation'
import { PlusIcon, EyeIcon, Cog6ToothIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { getUniversities } from '@/lib/universities'
import { University } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default async function DashboardPage() {
  const universities = await getUniversities()
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            University Management
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your university profiles and settings
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/profiles" className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Alumni Profiles</h3>
                <p className="text-sm text-gray-600">Manage and review alumni profiles</p>
              </div>
            </div>
          </Link>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Configure university settings</p>
              </div>
            </div>
          </div>
          
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
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Universities</h2>
            <p className="text-gray-600">Manage your university connections</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add University
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((university: University) => (
            <div key={university.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {university.logo_url ? (
                    <Image 
                      src={university.logo_url} 
                      alt={`${university.name} logo`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {university.name.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {university.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <ShieldCheckIcon className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600 font-medium">Admin</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Public Page
                </button>
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <Cog6ToothIcon className="h-4 w-4 mr-2" />
                  Manage University
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 