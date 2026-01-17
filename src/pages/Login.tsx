import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-br from-red-200 via-red-600 to-rose-100 pt-20 pb-32 lg:pt-32 lg:pb-48">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Connect, Share & Grow Together
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Join millions of people sharing moments, making friends, and building communities on SMA - where every connection matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <button className="w-full sm:w-auto bg-white text-red-600 font-bold py-4 px-8 rounded-full hover:bg-gray-50 shadow-2xl transform hover:scale-105 transition-all duration-300">
                    Get Started Free
                  </button>
                </Link>
                <Link to="/login">
                  <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white/10 transition-all duration-300">
                    Sign In
                  </button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">10M+</div>
                  <div className="text-sm text-white/80">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">50M+</div>
                  <div className="text-sm text-white/80">Posts Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">100+</div>
                  <div className="text-sm text-white/80">Countries</div>
                </div>
              </div>
            </div>

            {/* Right Image - Mock Interface */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Mock Phone Interface */}
                <div className="bg-white rounded-3xl shadow-2xl p-4 max-w-sm mx-auto">
                  {/* Mock Post Card */}
                  <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-4 mb-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      {/* <div className="w-12 h-12 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full"></div> */}
                      <img 
                      className="w-12 h-12 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full"
                      src="https://tse1.mm.bing.net/th/id/OIP.MGvQTjfEVYG733Hgm5bSWAHaDt?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
                      <div>
                        <div className="font-semibold text-gray-800">I am Batman</div>
                        <div className="text-xs text-gray-500">2 hours ago</div>
                      </div>
                    </div>
                      <img 
                      className="bg-linear-to-br from-red-100 to-rose-100 rounded-xl h-40 mb-3"
                      src="https://wallpapercave.com/wp/wp4273093.jpg" alt="" />
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-red-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        <span className="text-sm font-semibold">245</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm font-semibold">48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover powerful features designed to help you share, connect, and engage with your community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 - Add Friends */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-linear-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Add Friends</h3>
              <p className="text-gray-600 leading-relaxed">
                Find and connect with friends, family, and like-minded people from around the world instantly
              </p>
            </div>

            {/* Feature 2 - Live Chat */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-linear-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 leading-relaxed">
                Message your friends in real-time with instant notifications and multimedia support
              </p>
            </div>

            {/* Feature 3 - Share Posts */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-linear-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Share Posts</h3>
              <p className="text-gray-600 leading-relaxed">
                Share photos, videos, and thoughts with your network and reach millions of users
              </p>
            </div>

            {/* Feature 4 - Like & Comment */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-linear-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Like & Comment</h3>
              <p className="text-gray-600 leading-relaxed">
                Engage with content through likes, comments, and reactions to show your support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-gray-600">
              Join our community and start connecting today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-linear-to-br from-red-600 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up for free in seconds with your email or social media account
              </p>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-linear-to-r from-red-300 to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Customize your profile with photos, bio, and interests to express yourself
              </p>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-linear-to-r from-amber-300 to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Connecting</h3>
              <p className="text-gray-600 leading-relaxed">
                Find friends, share posts, and engage with your community right away
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 lg:py-32 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Loved by Millions Worldwide
            </h2>
            <p className="text-lg text-gray-600">
              See what our community has to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-red-500 to-rose-500 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Emma Wilson</div>
                  <div className="text-sm text-gray-500">Content Creator</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                "SMA has completely changed how I connect with my audience. The interface is intuitive and the engagement is amazing!"
              </p>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-500">Small Business Owner</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                "I've grown my business network exponentially. The chat feature and post sharing make collaboration seamless!"
              </p>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-gray-700 to-gray-900 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Sofia Rodriguez</div>
                  <div className="text-sm text-gray-500">Digital Marketer</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                "Best social platform I've used! The features are powerful yet simple to use. Highly recommend to everyone!"
              </p>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 lg:py-32 bg-linear-to-br from-red-600 via-red-500 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Start your journey today and experience the power of meaningful connections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="w-full sm:w-auto bg-white text-red-600 font-bold py-4 px-10 rounded-full hover:bg-gray-50 shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg">
                Create Free Account
              </button>
            </Link>
            <Link to="/about">
              <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-all duration-300 text-lg">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
