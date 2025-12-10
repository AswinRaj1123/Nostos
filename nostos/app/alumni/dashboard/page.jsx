'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { analyticsAPI, donationsAPI, campaignsAPI, authAPI } from '@/lib/api';

interface DashboardStats {
  totalDonated: number;
  campaignsSupported: number;
  recentDonations: number;
}

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  daysLeft: number;
  image: string;
}

interface DonationActivity {
  id: number;
  campaignName: string;
  amount: number;
  date: string;
}

interface MonthlyDonation {
  month: string;
  amount: number;
}

export default function AlumniDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalDonated: 0,
    campaignsSupported: 0,
    recentDonations: 0,
  });
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [recentActivity, setRecentActivity] = useState<DonationActivity[]>([]);
  const [monthlyDonations, setMonthlyDonations] = useState<MonthlyDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check authentication
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');

        if (!token || userRole !== 'alumni') {
          router.push('/login');
          return;
        }

        // Extract name from email or get from stored data
        const name = userEmail ? userEmail.split('@')[0] : 'Alumni';
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));

        setIsLoading(true);
        
        // Fetch analytics dashboard data
        const dashboardData = await analyticsAPI.getDashboard();
        
        // Fetch donation statistics
        const donationStats = await donationsAPI.getStatistics();
        
        // Set stats from API
        setStats({
          totalDonated: dashboardData.total_donations || 0,
          campaignsSupported: donationStats.total_campaigns || 0,
          recentDonations: donationStats.recent_count || 0,
        });

        // Fetch active campaigns
        const campaignsData = await campaignsAPI.list({ status: 'active' });
        
        // Map campaigns to expected format (take first 3)
        const mappedCampaigns: Campaign[] = campaignsData.results.slice(0, 3).map((campaign: any) => {
          const deadline = new Date(campaign.end_date);
          const today = new Date();
          const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
          
          return {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            goal: parseFloat(campaign.goal_amount),
            raised: parseFloat(campaign.current_amount),
            daysLeft: daysLeft,
            image: campaign.image_url || '/campaign1.jpg',
          };
        });
        
        setActiveCampaigns(mappedCampaigns);

        // Fetch recent donations
        const recentDonationsData = await donationsAPI.list();
        
        const mappedActivity: DonationActivity[] = recentDonationsData.results.slice(0, 3).map((donation: any) => ({
          id: donation.id,
          campaignName: donation.campaign_title || 'Campaign',
          amount: parseFloat(donation.amount),
          date: donation.created_at,
        }));
        
        setRecentActivity(mappedActivity);

        // Mock monthly donations for chart (API doesn't provide this yet)
        setMonthlyDonations([
          { month: 'Jan', amount: 15000 },
          { month: 'Feb', amount: 20000 },
          { month: 'Mar', amount: 10000 },
          { month: 'Apr', amount: 25000 },
          { month: 'May', amount: 15000 },
          { month: 'Jun', amount: 30000 },
          { month: 'Jul', amount: 0 },
          { month: 'Aug', amount: 5000 },
          { month: 'Sep', amount: 50000 },
          { month: 'Oct', amount: 75000 },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/');
  };

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

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const maxDonation = Math.max(...monthlyDonations.map(d => d.amount), 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header/Navigation */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              NOSTOS
            </Link>
            <nav className="flex items-center space-x-4">
              <Link
                href="/alumni/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Profile
              </Link>
              <Link
                href="/alumni/campaigns"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Campaigns
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Hi {userName}, here&apos;s your summary! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your contributions and discover new ways to give back
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 animate-fadeIn delay-200">
          {/* Total Donated */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Donated</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalDonated)}</p>
          </div>

          {/* Campaigns Supported */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Campaigns Supported</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.campaignsSupported}</p>
          </div>

          {/* Recent Donations */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recent Donations</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.recentDonations}</p>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Donation Chart & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Donation Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-fadeIn delay-400">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Donation History</h2>
              <div className="space-y-4">
                {/* Simple Bar Chart */}
                <div className="flex items-end justify-between h-64 gap-2">
                  {monthlyDonations.map((data, index) => {
                    const heightPercent = (data.amount / maxDonation) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full flex items-end justify-center h-full">
                          {data.amount > 0 && (
                            <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {formatCurrency(data.amount)}
                            </div>
                          )}
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-cyan-600 cursor-pointer"
                            style={{ height: `${heightPercent}%`, minHeight: data.amount > 0 ? '8px' : '0' }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{data.month}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly donations for 2025</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total: {formatCurrency(monthlyDonations.reduce((sum, d) => sum + d.amount, 0))}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-fadeIn delay-600">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Donation Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{activity.campaignName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600 dark:text-green-400">{formatCurrency(activity.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Active Campaigns */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 animate-fadeIn delay-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Active Campaigns</h2>
              <div className="space-y-6">
                {activeCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <span>{formatCurrency(campaign.raised)} raised</span>
                        <span>{getProgressPercentage(campaign.raised, campaign.goal).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Goal: {formatCurrency(campaign.goal)} • {campaign.daysLeft} days left
                      </p>
                    </div>

                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm">
                      Donate Now
                    </button>
                  </div>
                ))}
              </div>

              <Link
                href="/alumni/campaigns"
                className="mt-6 block text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                View All Campaigns →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
