'use client'

import Navigation from '@/components/Navigation'
import Logo from '@/components/Logo'
import { ArrowRightIcon, HeartIcon, UsersIcon, BookOpenIcon, LinkIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 opacity-10"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-8 w-48 h-48 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-20 blur-sm animate-float-1"></div>
        <div className="absolute top-32 right-16 w-40 h-40 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-25 blur-md animate-float-2"></div>
        <div className="absolute bottom-16 left-1/3 w-36 h-36 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-sm animate-float-3"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-15 blur-lg animate-float-4"></div>
        <div className="absolute bottom-1/3 right-1/4 w-44 h-44 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full opacity-20 blur-md animate-float-5"></div>
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center -ml-2">
              <Logo size="7xl" useImage={true} showText={false} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <div className="pl-4">Connect Your Community,</div>
              <div className="pr-4">
                <span className="text-purple-600">Strengthen Your Network</span>
              </div>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Storiats transforms outdated alumni directories into engaged networks, helping organizations strengthen ties and create lasting value with their alumni.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                Get Started
              </Link>
              <Link href="/about" className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
              <span>✨</span>
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Storiats?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Build stronger alumni and member communities, all in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LinkIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Reconnect & Unify</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Transform scattered spreadsheets and outdated directories into a single, unified platform with profiles, groups, and events that bring members back together
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Keep Voices Alive</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Enhance member profiles with AI chatbots that reflect their voices, stories, and experiences — creating more natural ways for communities to interact and engage
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-green-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Measure What Matters</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Simplify admin work with clean data and integrations, while engagement analytics show clear impact — from return visits to event participation
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.08) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
              <span>📋</span>
              <span>Step-by-Step</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              How Storiats Rebuilds the Sense of Community
            </p>
          </div>
          
          {/* Timeline Layout */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-emerald-400 to-teal-400 h-full hidden md:block"></div>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Create Profile</h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Start by creating an alumni profile with basic information and achievements
                    </p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                
                <div className="md:w-1/2 md:pl-8">
                  {/* Empty space for alignment */}
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                  {/* Empty space for alignment */}
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                
                <div className="md:w-1/2 md:pl-8">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Enrich with Stories & Voices</h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Enrich profiles with photos, videos, and personal stories, and create AI chatbots that carry alumni voices forward.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Engage & Reconnect</h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                    Members and organizations interact with these AI-powered alumni, sparking conversations, sharing inspiration, and building stronger connections across generations.
                    </p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                
                <div className="md:w-1/2 md:pl-8">
                  {/* Empty space for alignment */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Partners Say
              </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20 flex flex-col hover:shadow-xl transition-shadow">
              <p className="text-gray-700 mb-4 flex-grow">
                &ldquo;Storiats helped us create a beautiful alumni profile for our distinguished graduate. 
                The stories and achievements we collected from colleagues and faculty 
                gave us a complete picture of their impact and legacy.&rdquo;
              </p>
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                  <span className="text-white font-semibold">S</span>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-600 text-sm">Alumni Relations Director</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20 flex flex-col hover:shadow-xl transition-shadow">
              <p className="text-gray-700 mb-4 flex-grow">
                &ldquo;The platform made it easy for our entire university community to contribute 
                stories and achievements. It&apos;s become a treasured digital archive 
                that inspires our current students.&rdquo;
              </p>
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                  <span className="text-white font-semibold">M</span>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-600 text-sm">University Archivist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Activate Your Alumni Network?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Launch Storiats to transform alumni records into living, interactive networks. Keep voices alive, preserve stories, and make connections that last.
          </p>
          <Link href="/auth/signup" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-flex items-center">
            Get Started Now
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
