'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalDonations: number;
  activeCampaigns: number;
  alumniCount: number;
  recentTransactions: number;
  thisMonthDonations: number;
  lastMonthDonations: number;
}

interface Transaction {
  id: number;
  donorName: string;
  amount: number;
  campaign: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DonationTrend {
  month: string;
  amount: number;
}

interface SentimentData {
  month: string;
  positive: number;
  neutral: number;
  negative: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);
  const [sentimentTrends, setSentimentTrends] = useState<SentimentData[]>([]);
  const [retentionPrediction, setRetentionPrediction] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock stats
      const mockStats: DashboardStats = {
        totalDonations: 12750000,
        activeCampaigns: 15,
        alumniCount: 1247,
        recentTransactions: 342,
        thisMonthDonations: 2450000,
        lastMonthDonations: 1980000,
      };

      // Mock recent transactions
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          donorName: 'Rajesh Kumar',
          amount: 250000,
          campaign: 'New Library Construction',
          date: '2025-10-31',
          status: 'completed',
        },
        {
          id: 2,
          donorName: 'Priya Sharma',
          amount: 100000,
          campaign: 'Scholarship Fund',
          date: '2025-10-31',
          status: 'completed',
        },
        {
          id: 3,
          donorName: 'Anonymous',
          amount: 50000,
          campaign: 'Sports Complex',
          date: '2025-10-30',
          status: 'completed',
        },
        {
          id: 4,
          donorName: 'Amit Patel',
          amount: 150000,
          campaign: 'Research Lab Upgrade',
          date: '2025-10-30',
          status: 'pending',
        },
        {
          id: 5,
          donorName: 'Sneha Gupta',
          amount: 75000,
          campaign: 'New Library Construction',
          date: '2025-10-29',
          status: 'completed',
        },
      ];

      // Mock donation trends (last 12 months)
      const mockDonationTrends: DonationTrend[] = [
        { month: 'Nov 24', amount: 850000 },
        { month: 'Dec 24', amount: 1200000 },
        { month: 'Jan 25', amount: 950000 },
        { month: 'Feb 25', amount: 1100000 },
        { month: 'Mar 25', amount: 1350000 },
        { month: 'Apr 25', amount: 980000 },
        { month: 'May 25', amount: 1150000 },
        { month: 'Jun 25', amount: 1400000 },
        { month: 'Jul 25', amount: 1250000 },
        { month: 'Aug 25', amount: 1600000 },
        { month: 'Sep 25', amount: 1450000 },
        { month: 'Oct 25', amount: 1700000 },
      ];

      // Mock sentiment trends
      const mockSentimentTrends: SentimentData[] = [
        { month: 'May', positive: 75, neutral: 20, negative: 5 },
        { month: 'Jun', positive: 80, neutral: 15, negative: 5 },
        { month: 'Jul', positive: 70, neutral: 25, negative: 5 },
        { month: 'Aug', positive: 85, neutral: 12, negative: 3 },
        { month: 'Sep', positive: 82, neutral: 15, negative: 3 },
        { month: 'Oct', positive: 88, neutral: 10, negative: 2 },
      ];

      // Mock AI prediction
      const mockRetentionPrediction = 87.5;

      setStats(mockStats);
      setRecentTransactions(mockTransactions);
      setDonationTrends(mockDonationTrends);
      setSentimentTrends(mockSentimentTrends);
      setRetentionPrediction(mockRetentionPrediction);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const getGrowthPercentage = () => {
    if (!stats) return '0';
    const growth = ((stats.thisMonthDonations - stats.lastMonthDonations) / stats.lastMonthDonations) * 100;
    return growth.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Unable to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              NOSTOS
            </Link>
            <nav className="flex items-center space-x-4">
              <Link
                href="/admin/campaigns"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Campaigns
              </Link>
              <Link
                href="/admin/alumni"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Alumni
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  router.push('/login');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back! Here&apos;s what&apos;s happening today
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Donations */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${parseFloat(getGrowthPercentage()) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {parseFloat(getGrowthPercentage()) >= 0 ? '+' : ''}{getGrowthPercentage()}%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Total Donations</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(stats.totalDonations)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +{formatCurrency(stats.thisMonthDonations)} this month
            </p>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Live
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Active Campaigns</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.activeCampaigns}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Raising funds currently
            </p>
          </div>

          {/* Alumni Count */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                +47
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Registered Alumni</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatNumber(stats.alumniCount)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total members
            </p>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-xl">
                <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                30 days
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Transactions</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {formatNumber(stats.recentTransactions)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last month
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Donations Over Time Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Donations Over Time</h2>
                <select className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>

              {/* Bar Chart */}
              <div className="space-y-3">
                {donationTrends.map((trend, index) => {
                  const maxAmount = Math.max(...donationTrends.map(t => t.amount));
                  const percentage = (trend.amount / maxAmount) * 100;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-16">
                        {trend.month}
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 30 && (
                            <span className="text-xs font-bold text-white">
                              {formatCurrency(trend.amount)}
                            </span>
                          )}
                        </div>
                      </div>
                      {percentage <= 30 && (
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-32">
                          {formatCurrency(trend.amount)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Average Monthly Donation:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(donationTrends.reduce((acc, t) => acc + t.amount, 0) / donationTrends.length)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sentiment Trends Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Alumni Sentiment Trends</h2>

              {/* Stacked Bar Chart */}
              <div className="space-y-4">
                {sentimentTrends.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {data.month}
                      </span>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="flex items-center">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                          {data.positive}%
                        </span>
                        <span className="flex items-center">
                          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                          {data.neutral}%
                        </span>
                        <span className="flex items-center">
                          <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                          {data.negative}%
                        </span>
                      </div>
                    </div>
                    <div className="flex h-8 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 flex items-center justify-center text-xs font-bold text-white"
                        style={{ width: `${data.positive}%` }}
                      >
                        {data.positive > 15 && `${data.positive}%`}
                      </div>
                      <div
                        className="bg-yellow-500 flex items-center justify-center text-xs font-bold text-white"
                        style={{ width: `${data.neutral}%` }}
                      >
                        {data.neutral > 15 && `${data.neutral}%`}
                      </div>
                      <div
                        className="bg-red-500 flex items-center justify-center text-xs font-bold text-white"
                        style={{ width: `${data.negative}%` }}
                      >
                        {data.negative > 15 && `${data.negative}%`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(sentimentTrends.reduce((acc, s) => acc + s.positive, 0) / sentimentTrends.length)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {Math.round(sentimentTrends.reduce((acc, s) => acc + s.neutral, 0) / sentimentTrends.length)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {Math.round(sentimentTrends.reduce((acc, s) => acc + s.negative, 0) / sentimentTrends.length)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Negative</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Prediction Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI-Powered Prediction</h3>
                  <p className="text-sm text-white/80">Donor Retention Forecast</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-4">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-sm text-white/80 mb-1">Predicted Retention Rate</p>
                    <p className="text-5xl font-bold">{retentionPrediction}%</p>
                  </div>
                  <div className="text-6xl">📈</div>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-4">
                  <div
                    className="bg-white h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${retentionPrediction}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-lg">
                  <span className="text-white/90">Expected to continue donating</span>
                  <span className="font-bold">{Math.round((stats.alumniCount * retentionPrediction) / 100)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur rounded-lg">
                  <span className="text-white/90">At risk of churn</span>
                  <span className="font-bold">{Math.round((stats.alumniCount * (100 - retentionPrediction)) / 100)}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-white/70">
                Based on historical donation patterns, engagement metrics, and sentiment analysis
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {transaction.donorName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {transaction.campaign}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/transactions"
                className="block mt-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View All Transactions →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/campaigns/create"
                  className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Create Campaign</span>
                </Link>

                <Link
                  href="/admin/alumni"
                  className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Manage Alumni</span>
                </Link>

                <Link
                  href="/admin/reports"
                  className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Generate Report</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
