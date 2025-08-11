import Navigation from '@/components/Navigation'
import { getUniversities } from '@/lib/universities'
import { testDatabaseConnection } from '@/lib/test-db'

export default async function DashboardDebugPage() {
  const universities = await getUniversities()
  const dbTest = await testDatabaseConnection()
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard Debug
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Debug information for university data
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900">Database Connection Test:</h3>
              <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto text-black">
                {JSON.stringify(dbTest, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Universities Array:</h3>
              <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto text-black">
                {JSON.stringify(universities, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Array Length:</h3>
              <p className="text-lg font-mono text-black">{universities.length}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Array Type:</h3>
              <p className="text-lg font-mono text-black">{typeof universities}</p>
            </div>
            
            {universities.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900">First University:</h3>
                <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto text-black">
                  {JSON.stringify(universities[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 