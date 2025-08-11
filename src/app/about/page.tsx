import Navigation from '@/components/Navigation'
import { HeartIcon, UsersIcon, BookOpenIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-purple-600">Storiats</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;re dedicated to preserving and sharing university alumni stories through beautiful, 
              engaging digital profiles that connect communities across generations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.06) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission Statement Card */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Preserve & Share</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    At Storiats, we believe that every alumni story deserves to be preserved and shared. 
                    Our platform provides a beautiful, engaging way to create digital profiles that celebrate 
                    the achievements and legacies of university alumni and community members.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Vision Card */}
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-8 rounded-2xl shadow-xl text-white">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="text-purple-100 leading-relaxed">
                  To become the leading platform for preserving institutional memory and connecting 
                  university communities across generations.
                </p>
              </div>
            </div>
          </div>
          
          {/* Impact Statement */}
          <div className="mt-12 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Building Lasting Connections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">📚</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Institutional Memory</h4>
                  <p className="text-gray-600">Preserving precious stories and achievements for future generations</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">🤝</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Community Connection</h4>
                  <p className="text-gray-600">Connecting current students with alumni legacies across time</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">💡</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Inspiration</h4>
                  <p className="text-gray-600">Creating lasting connections that inspire future generations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Respect</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We approach every alumni story with the utmost care and attention, 
                understanding the importance of preserving institutional history and personal achievements.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Connection</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We believe in the power of shared stories to connect current students 
                with alumni across time, creating meaningful bonds through shared institutional experiences.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpenIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Preservation</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We&apos;re committed to preserving precious alumni stories and achievements for 
                future generations, ensuring that important institutional legacies live on.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Community</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We foster supportive university communities where students, alumni, and faculty 
                can come together to celebrate achievements and inspire future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.08) 1px, transparent 0)`,
          backgroundSize: '25px 25px'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Story content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-8"></div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">The Beginning</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Storiats was born from a simple yet powerful idea: that every alumni has a story worth telling, 
                        and every story deserves to be preserved.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">The Mission</h3>
                      <p className="text-gray-700 leading-relaxed">
                        We understand the profound impact that institutional memory and alumni connections 
                        can have on university communities.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">The Solution</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Our platform was designed with care and attention to detail, providing universities 
                        with a beautiful way to celebrate and preserve alumni achievements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Visual element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <BookOpenIcon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Preserving Legacies</h3>
                  <p className="text-purple-100 leading-relaxed">
                    Through technology, we&apos;re helping to ensure that precious institutional stories 
                    and connections are never lost.
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full opacity-60 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Preserve Alumni Stories?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Start creating beautiful alumni profiles today and preserve institutional stories forever.
          </p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  )
} 