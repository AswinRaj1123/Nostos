'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call backend logout API
        await authAPI.logout();

        setIsLoggingOut(false);

        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              router.push('/');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      } catch (error) {
        console.error('Logout error:', error);
        // Even if API call fails, clear local data and redirect
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100 dark:border-gray-800 text-center">
          {isLoggingOut ? (
            // Logging Out State
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full mb-6">
                  <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Logging Out...
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Clearing your session and securing your data
              </p>

              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </>
          ) : (
            // Logged Out State
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full mb-6 animate-fadeIn">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
                You&apos;re Logged Out! 👋
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8 animate-fadeIn">
                Thank you for using NOSTOS. Your session has been securely ended.
              </p>

              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Redirecting to home page in <span className="font-bold text-xl">{countdown}</span> seconds...
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl transition-all duration-300 text-center"
                  >
                    Go to Home
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Login Again
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 animate-fadeIn">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Quick Links
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Link
                    href="/campaigns"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    View Campaigns
                  </Link>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <Link
                    href="/register"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    Register
                  </Link>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 NOSTOS Alumni Network. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
