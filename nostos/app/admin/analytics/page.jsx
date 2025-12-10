'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { analyticsAPI } from '@/lib/api';

interface DonationTrendData {
  month: string;
  actual: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

interface LikelyDonor {
  id: number;
  name: string;
  email: string;
  lastDonation: string;
  totalDonated: number;
  donationCount: number;
  probability: number;
  predictedAmount: number;
  engagementScore: number;
}

interface SentimentData {
  sentiment: string;
  count: number;
  percentage: number;
  color: string;
}

interface CampaignPrediction {
  id: number;
  campaignName: string;
  currentProgress: number;
  predictedSuccess: number;
  confidenceLevel: number;
  recommendation: string;
  status: 'high' | 'medium' | 'low';
}

export default function AdminAnalyticsPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [donationTrends, setDonationTrends] = useState<DonationTrendData[]>([]);
  const [likelyDonors, setLikelyDonors] = useState<LikelyDonor[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [campaignPredictions, setCampaignPredictions] = useState<CampaignPrediction[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'6m' | '12m' | '24m'>('12m');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Check authentication and role
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'admin') {
          router.push('/login');
          return;
        }

        setIsLoading(true);
        
        // Fetch trends from analytics API
        const trendsData = await analyticsAPI.getTrends();
        
        // Mock donation trend data with ML regression
        const mockTrends: DonationTrendData[] = [
        { month: 'Nov 2024', actual: 850000, predicted: 820000, lowerBound: 780000, upperBound: 860000 },
        { month: 'Dec 2024', actual: 1200000, predicted: 1150000, lowerBound: 1100000, upperBound: 1200000 },
        { month: 'Jan 2025', actual: 950000, predicted: 980000, lowerBound: 930000, upperBound: 1030000 },
        { month: 'Feb 2025', actual: 1100000, predicted: 1080000, lowerBound: 1030000, upperBound: 1130000 },
        { month: 'Mar 2025', actual: 1350000, predicted: 1320000, lowerBound: 1270000, upperBound: 1370000 },
        { month: 'Apr 2025', actual: 1150000, predicted: 1180000, lowerBound: 1130000, upperBound: 1230000 },
        { month: 'May 2025', actual: 1400000, predicted: 1380000, lowerBound: 1330000, upperBound: 1430000 },
        { month: 'Jun 2025', actual: 1250000, predicted: 1280000, lowerBound: 1230000, upperBound: 1330000 },
        { month: 'Jul 2025', actual: 1500000, predicted: 1480000, lowerBound: 1430000, upperBound: 1530000 },
        { month: 'Aug 2025', actual: 1350000, predicted: 1400000, lowerBound: 1350000, upperBound: 1450000 },
        { month: 'Sep 2025', actual: 1600000, predicted: 1580000, lowerBound: 1530000, upperBound: 1630000 },
        { month: 'Oct 2025', actual: 1700000, predicted: 1720000, lowerBound: 1670000, upperBound: 1770000 },
        { month: 'Nov 2025', actual: 0, predicted: 1850000, lowerBound: 1800000, upperBound: 1900000 },
        { month: 'Dec 2025', actual: 0, predicted: 2100000, lowerBound: 2000000, upperBound: 2200000 },
      ];

      // Mock likely donors with probability scores
      const mockDonors: LikelyDonor[] = [
        {
          id: 1,
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          lastDonation: '2025-09-15',
          totalDonated: 450000,
          donationCount: 8,
          probability: 94.5,
          predictedAmount: 75000,
          engagementScore: 92,
        },
        {
          id: 2,
          name: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          lastDonation: '2025-10-02',
          totalDonated: 380000,
          donationCount: 6,
          probability: 91.2,
          predictedAmount: 65000,
          engagementScore: 88,
        },
        {
          id: 3,
          name: 'Amit Patel',
          email: 'amit.patel@email.com',
          lastDonation: '2025-08-20',
          totalDonated: 520000,
          donationCount: 10,
          probability: 89.8,
          predictedAmount: 80000,
          engagementScore: 85,
        },
        {
          id: 4,
          name: 'Sneha Reddy',
          email: 'sneha.reddy@email.com',
          lastDonation: '2025-09-28',
          totalDonated: 290000,
          donationCount: 5,
          probability: 86.3,
          predictedAmount: 50000,
          engagementScore: 82,
        },
        {
          id: 5,
          name: 'Vikram Singh',
          email: 'vikram.singh@email.com',
          lastDonation: '2025-07-10',
          totalDonated: 410000,
          donationCount: 7,
          probability: 83.7,
          predictedAmount: 60000,
          engagementScore: 79,
        },
        {
          id: 6,
          name: 'Ananya Gupta',
          email: 'ananya.gupta@email.com',
          lastDonation: '2025-10-15',
          totalDonated: 325000,
          donationCount: 6,
          probability: 81.4,
          predictedAmount: 55000,
          engagementScore: 77,
        },
        {
          id: 7,
          name: 'Karthik Iyer',
          email: 'karthik.iyer@email.com',
          lastDonation: '2025-06-25',
          totalDonated: 270000,
          donationCount: 4,
          probability: 78.9,
          predictedAmount: 45000,
          engagementScore: 74,
        },
        {
          id: 8,
          name: 'Deepa Nair',
          email: 'deepa.nair@email.com',
          lastDonation: '2025-09-05',
          totalDonated: 195000,
          donationCount: 3,
          probability: 76.2,
          predictedAmount: 40000,
          engagementScore: 71,
        },
      ];

      // Mock sentiment analytics
      const mockSentiment: SentimentData[] = [
        { sentiment: 'Very Positive', count: 342, percentage: 45.6, color: '#10b981' },
        { sentiment: 'Positive', count: 256, percentage: 34.1, color: '#3b82f6' },
        { sentiment: 'Neutral', count: 98, percentage: 13.1, color: '#f59e0b' },
        { sentiment: 'Negative', count: 38, percentage: 5.1, color: '#ef4444' },
        { sentiment: 'Very Negative', count: 16, percentage: 2.1, color: '#dc2626' },
      ];

      // Mock campaign predictions
      const mockPredictions: CampaignPrediction[] = [
        {
          id: 1,
          campaignName: 'New Library Construction',
          currentProgress: 65,
          predictedSuccess: 92.8,
          confidenceLevel: 88,
          recommendation: 'On track to exceed goal. Consider extending to add digital resources.',
          status: 'high',
        },
        {
          id: 2,
          campaignName: 'Scholarship Fund 2025',
          currentProgress: 72.5,
          predictedSuccess: 85.3,
          confidenceLevel: 82,
          recommendation: 'Strong momentum. Increase social media engagement for final push.',
          status: 'high',
        },
        {
          id: 3,
          campaignName: 'Research Lab Upgrade',
          currentProgress: 30,
          predictedSuccess: 68.4,
          confidenceLevel: 75,
          recommendation: 'Moderate risk. Launch targeted email campaign to past donors.',
          status: 'medium',
        },
        {
          id: 4,
          campaignName: 'Alumni Networking Platform',
          currentProgress: 15,
          predictedSuccess: 45.2,
          confidenceLevel: 70,
          recommendation: 'Low engagement. Consider revising messaging and adding success stories.',
          status: 'low',
        },
      ];

      setDonationTrends(mockTrends);
      setLikelyDonors(mockDonors);
      setSentimentData(mockSentiment);
      setCampaignPredictions(mockPredictions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setIsLoading(false);
    }
  };
  
  fetchAnalyticsData();
}, [router, selectedTimeframe]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 90) return 'text-green-600 dark:text-green-400';
    if (probability >= 80) return 'text-blue-600 dark:text-blue-400';
    if (probability >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getProbabilityBg = (probability: number) => {
    if (probability >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (probability >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (probability >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-orange-100 dark:bg-orange-900/20';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading AI analytics...</p>
        </div>
      </div>
    );
  }

  const maxActual = Math.max(...donationTrends.filter(d => d.actual > 0).map(d => d.actual));
  const maxPredicted = Math.max(...donationTrends.map(d => d.upperBound));
  const maxValue = Math.max(maxActual, maxPredicted);

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
                href="/admin/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                AI Donor Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Machine learning insights and predictions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setSelectedTimeframe('6m')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTimeframe === '6m'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              6M
            </button>
            <button
              onClick={() => setSelectedTimeframe('12m')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTimeframe === '12m'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              12M
            </button>
            <button
              onClick={() => setSelectedTimeframe('24m')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTimeframe === '24m'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              24M
            </button>
          </div>
        </div>

        {/* AI Insights Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">🤖 AI-Powered Insights</h3>
              <p className="text-purple-100 mb-4">
                Our machine learning models analyze donation patterns, donor behavior, and campaign performance to provide accurate predictions and actionable recommendations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold">94.2%</div>
                  <div className="text-sm text-purple-100">Prediction Accuracy</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-purple-100">Donors Analyzed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm text-purple-100">Active Models</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Trend Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3">📈</span>
                Donation Trend Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                ML Regression Model with 95% confidence intervals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Actual</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Predicted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-200 dark:bg-purple-900/30 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {donationTrends.map((trend, index) => {
              const actualHeight = trend.actual > 0 ? (trend.actual / maxValue) * 100 : 0;
              const predictedHeight = (trend.predicted / maxValue) * 100;
              const lowerHeight = (trend.lowerBound / maxValue) * 100;
              const upperHeight = (trend.upperBound / maxValue) * 100;

              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-20 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {trend.month}
                  </div>
                  <div className="flex-1 relative h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {/* Confidence Interval (background) */}
                    <div
                      className="absolute top-0 left-0 h-full bg-purple-200 dark:bg-purple-900/30 transition-all duration-500 rounded-lg"
                      style={{
                        width: `${upperHeight}%`,
                      }}
                    ></div>
                    
                    {/* Actual Value */}
                    {trend.actual > 0 && (
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 rounded-lg"
                        style={{
                          width: `${actualHeight}%`,
                        }}
                      ></div>
                    )}
                    
                    {/* Predicted Value */}
                    <div
                      className="absolute top-0 left-0 h-full border-2 border-purple-600 transition-all duration-500 rounded-lg"
                      style={{
                        width: `${predictedHeight}%`,
                      }}
                    ></div>

                    {/* Value Labels */}
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      {trend.actual > 0 && (
                        <span className="text-sm font-bold text-white drop-shadow-lg">
                          {formatCurrency(trend.actual)}
                        </span>
                      )}
                      <span className={`text-sm font-bold ${trend.actual > 0 ? 'text-purple-700 dark:text-purple-300' : 'text-purple-600 dark:text-purple-400'} ml-auto`}>
                        {formatCurrency(trend.predicted)}
                      </span>
                    </div>
                  </div>
                  <div className="w-32 text-xs text-gray-500 dark:text-gray-400 text-right">
                    {trend.actual > 0 
                      ? `${((Math.abs(trend.predicted - trend.actual) / trend.actual) * 100).toFixed(1)}% variance`
                      : 'Forecast'
                    }
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-1">Model Insights</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  The regression model predicts a <strong>23.5% increase</strong> in donations over the next quarter. 
                  Key factors: seasonal trends, campaign launches, and alumni engagement rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Likely Donors Table */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3">🎯</span>
                Likely Donors (Next 30 Days)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                AI-ranked donors with probability scores
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      History
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Predicted Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {likelyDonors.map((donor, index) => (
                    <tr key={donor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                          index === 1 ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400' :
                          index === 2 ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {donor.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {donor.email}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Last: {formatDate(donor.lastDonation)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(donor.totalDonated)}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {donor.donationCount} donations
                          </div>
                          <div className="mt-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">Engagement:</span>
                              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full max-w-[60px]">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                                  style={{ width: `${donor.engagementScore}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{donor.engagementScore}%</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getProbabilityBg(donor.probability)}`}>
                          <span className={`text-lg font-bold ${getProbabilityColor(donor.probability)}`}>
                            {donor.probability.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              donor.probability >= 90 ? 'bg-green-500' :
                              donor.probability >= 80 ? 'bg-blue-500' :
                              donor.probability >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${donor.probability}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-purple-600 dark:text-purple-400">
                          {formatCurrency(donor.predictedAmount)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Total Predicted:</strong> {formatCurrency(likelyDonors.reduce((sum, d) => sum + d.predictedAmount, 0))} from {likelyDonors.length} high-probability donors
              </div>
            </div>
          </div>

          {/* Sentiment Analytics */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <span className="mr-3">😊</span>
              Sentiment Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Alumni feedback analysis
            </p>

            <div className="space-y-4 mb-6">
              {sentimentData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {item.sentiment}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pie Chart Visualization */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              <svg viewBox="0 0 200 200" className="transform -rotate-90">
                {(() => {
                  let cumulativePercent = 0;
                  return sentimentData.map((item, index) => {
                    const percent = item.percentage / 100;
                    const angle = percent * 360;
                    const startAngle = (cumulativePercent / 100) * 360;
                    
                    const x1 = 100 + 90 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 100 + 90 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 100 + 90 * Math.cos((Math.PI * (startAngle + angle)) / 180);
                    const y2 = 100 + 90 * Math.sin((Math.PI * (startAngle + angle)) / 180);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    const path = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;
                    
                    cumulativePercent += item.percentage;
                    
                    return (
                      <path
                        key={index}
                        d={path}
                        fill={item.color}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {sentimentData.reduce((sum, item) => sum + item.count, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Responses
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm">
                <div className="font-bold text-green-900 dark:text-green-100 mb-1">
                  ⭐ Overall Sentiment: Very Positive
                </div>
                <div className="text-green-700 dark:text-green-300">
                  {((sentimentData[0].percentage + sentimentData[1].percentage)).toFixed(1)}% positive feedback
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Success Predictions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="mr-3">🚀</span>
              Campaign Success Predictions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              AI-powered campaign performance forecasts with actionable recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaignPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className={`p-6 rounded-xl border-2 ${getStatusColor(prediction.status)} transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {prediction.campaignName}
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Current Progress: <strong>{prediction.currentProgress}%</strong>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    prediction.status === 'high' ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100' :
                    prediction.status === 'medium' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100' :
                    'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100'
                  }`}>
                    {prediction.status}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Success Probability
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {prediction.predictedSuccess.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        prediction.status === 'high' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        prediction.status === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${prediction.predictedSuccess}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Confidence: {prediction.confidenceLevel}%</span>
                    <span>Model v2.1</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${
                  prediction.status === 'high' ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800' :
                  prediction.status === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800' :
                  'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start space-x-2">
                    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      prediction.status === 'high' ? 'text-green-600 dark:text-green-400' :
                      prediction.status === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className={`text-sm ${
                      prediction.status === 'high' ? 'text-green-700 dark:text-green-300' :
                      prediction.status === 'medium' ? 'text-yellow-700 dark:text-yellow-300' :
                      'text-red-700 dark:text-red-300'
                    }`}>
                      <strong>Recommendation:</strong> {prediction.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
