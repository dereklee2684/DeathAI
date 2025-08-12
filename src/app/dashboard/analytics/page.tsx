'use client'

import { useAuth } from '@/contexts/AuthContext'
import { isPlatformAdmin, isUniversityAdmin } from '@/lib/auth'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardNavbar from '@/components/DashboardNavbar'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  EyeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  // Mock data - replace with real data from your backend
  const mockStats = {
    totalProfiles: 1247,
    publishedProfiles: 892,
    pendingReview: 156,
    draftProfiles: 199,
    totalUsers: 456,
    activeUsers: 234,
    universities: 12,
    pageViews: 15420
  }

  const recentActivity = [
    { id: 1, action: 'Profile published', user: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'New user registered', user: 'Jane Smith', time: '4 hours ago' },
    { id: 3, action: 'Profile updated', user: 'Mike Johnson', time: '6 hours ago' },
    { id: 4, action: 'University added', user: 'Admin', time: '1 day ago' },
  ]

  return (
    <ProtectedRoute requireDashboardAccess>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Analytics
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              View engagement metrics and platform statistics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Profiles</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalProfiles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.publishedProfiles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.pageViews.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Universities</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.universities}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Status Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Published</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{mockStats.publishedProfiles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Pending Review</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{mockStats.pendingReview}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Draft</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{mockStats.draftProfiles}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin-only section */}
          {(isPlatformAdmin({ ...user, email: user?.email || '' }) || isUniversityAdmin({ ...user, email: user?.email || '' })) && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.activeUsers}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((mockStats.activeUsers / mockStats.totalUsers) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Coming Soon Notice */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Enhanced Analytics Coming Soon</h3>
                <p className="text-blue-700">
                  We&apos;re working on adding more detailed analytics including user engagement trends, 
                  profile completion rates, and university-specific metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 