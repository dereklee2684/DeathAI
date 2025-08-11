'use client'

import Navigation from '@/components/Navigation'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Error Loading Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            There was an error loading the university data. Please try again.
          </p>
          <div className="mt-6">
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 