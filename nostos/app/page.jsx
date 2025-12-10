'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-500 hover:scale-105 transition-transform duration-300">
                NOSTOS
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login">
                <button className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 sm:mb-8 animate-fadeIn">
              Reconnect, Give Back,{' '}
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent animate-slideUp">
                Make an Impact
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto animate-fadeIn delay-200">
              NOSTOS brings alumni together through AI-powered networking, seamless donations, 
              and meaningful engagement opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn delay-400">
              <Link href="/register">
                <button className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-base sm:text-lg group">
                  Get Started
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </Link>
              <a href="#features">
                <button className="w-full sm:w-auto px-8 sm:px-10 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300 font-semibold text-base sm:text-lg">
                  Learn More
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-12 border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
              <div className="space-y-3 transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent animate-countUp">
                  ₹5 Cr+
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold tracking-wide">
                  Total Donations
                </div>
              </div>
              <div className="space-y-3 transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent animate-countUp delay-200">
                  1,000+
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold tracking-wide">
                  Active Alumni
                </div>
              </div>
              <div className="space-y-3 transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent animate-countUp delay-400">
                  50+
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold tracking-wide">
                  Funded Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Powerful Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to stay connected and give back
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* AI-Powered Networking */}
            <div className="group bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-7 h-7 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                AI-Powered Networking
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Smart matchmaking connects you with alumni based on interests, industry, and career goals. 
                Build meaningful professional relationships effortlessly.
              </p>
            </div>

            {/* Seamless Donations */}
            <div className="group bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-7 h-7 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Seamless Donations
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Support your alma mater with secure, transparent donations. Track your impact and 
                see exactly how your contributions are making a difference.
              </p>
            </div>

            {/* Community Engagement */}
            <div className="group bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-7 h-7 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Community Engagement
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Participate in events, mentorship programs, and discussions. Stay connected with 
                your alma mater community and give back through meaningful engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto">
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 sm:p-16 text-center text-white overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-ping delay-1000"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Reconnect?
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 opacity-95 max-w-2xl mx-auto">
                Join thousands of alumni making a difference. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-base sm:text-lg">
                  Contact Us
                </button>
                <button className="w-full sm:w-auto px-8 sm:px-10 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300 font-semibold text-base sm:text-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2 text-sm sm:text-base">© 2025 NOSTOS. All rights reserved.</p>
          <p className="text-xs sm:text-sm">Connecting alumni, building futures.</p>
        </div>
      </footer>
    </div>
  );
}
