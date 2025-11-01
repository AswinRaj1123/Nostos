'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Campaign {
  id: number;
  title: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  donors: number;
  daysLeft: number;
  image: string;
  featured: boolean;
  createdDate: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAmountRange, setSelectedAmountRange] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  const categories = [
    'All Categories',
    'Education',
    'Infrastructure',
    'Scholarships',
    'Sports',
    'Technology',
    'Research',
    'Events',
  ];

  const amountRanges = [
    { label: 'All Amounts', value: 'all' },
    { label: 'Under ₹1L', value: '0-100000' },
    { label: '₹1L - ₹5L', value: '100000-500000' },
    { label: '₹5L - ₹10L', value: '500000-1000000' },
    { label: 'Above ₹10L', value: '1000000+' },
  ];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterAndSortCampaigns();
  }, [campaigns, searchQuery, selectedCategory, selectedAmountRange, sortBy]);

  const fetchCampaigns = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockCampaigns: Campaign[] = [
        {
          id: 1,
          title: 'New Library Construction',
          description: 'Help us build a state-of-the-art library with modern facilities for students to learn and grow.',
          category: 'Infrastructure',
          goal: 5000000,
          raised: 3250000,
          donors: 245,
          daysLeft: 45,
          image: '/library.jpg',
          featured: true,
          createdDate: '2025-09-15',
        },
        {
          id: 2,
          title: 'Scholarship Fund 2025',
          description: 'Support deserving students from underprivileged backgrounds with scholarships.',
          category: 'Scholarships',
          goal: 2000000,
          raised: 1500000,
          donors: 180,
          daysLeft: 60,
          image: '/scholarship.jpg',
          featured: true,
          createdDate: '2025-08-20',
        },
        {
          id: 3,
          title: 'Sports Complex Renovation',
          description: 'Upgrade our sports facilities with modern equipment and infrastructure.',
          category: 'Sports',
          goal: 3000000,
          raised: 750000,
          donors: 95,
          daysLeft: 90,
          image: '/sports.jpg',
          featured: false,
          createdDate: '2025-10-01',
        },
        {
          id: 4,
          title: 'AI Research Lab Setup',
          description: 'Establish a cutting-edge AI and Machine Learning research laboratory.',
          category: 'Research',
          goal: 8000000,
          raised: 4200000,
          donors: 320,
          daysLeft: 120,
          image: '/research.jpg',
          featured: true,
          createdDate: '2025-07-10',
        },
        {
          id: 5,
          title: 'Annual Alumni Meet 2026',
          description: 'Fund the annual alumni gathering and networking event.',
          category: 'Events',
          goal: 500000,
          raised: 420000,
          donors: 156,
          daysLeft: 30,
          image: '/event.jpg',
          featured: false,
          createdDate: '2025-10-15',
        },
        {
          id: 6,
          title: 'Computer Lab Upgrade',
          description: 'Replace outdated computers with modern systems for better learning.',
          category: 'Technology',
          goal: 1500000,
          raised: 890000,
          donors: 78,
          daysLeft: 75,
          image: '/computer.jpg',
          featured: false,
          createdDate: '2025-09-05',
        },
        {
          id: 7,
          title: 'Student Hostel Renovation',
          description: 'Improve living conditions for students with hostel upgrades.',
          category: 'Infrastructure',
          goal: 6000000,
          raised: 2100000,
          donors: 210,
          daysLeft: 100,
          image: '/hostel.jpg',
          featured: false,
          createdDate: '2025-08-01',
        },
        {
          id: 8,
          title: 'Teacher Training Program',
          description: 'Professional development workshops for faculty members.',
          category: 'Education',
          goal: 800000,
          raised: 650000,
          donors: 92,
          daysLeft: 40,
          image: '/training.jpg',
          featured: false,
          createdDate: '2025-09-20',
        },
        {
          id: 9,
          title: 'Green Campus Initiative',
          description: 'Plant trees and create sustainable green spaces on campus.',
          category: 'Infrastructure',
          goal: 400000,
          raised: 380000,
          donors: 145,
          daysLeft: 15,
          image: '/green.jpg',
          featured: false,
          createdDate: '2025-10-20',
        },
        {
          id: 10,
          title: 'Digital Learning Resources',
          description: 'Subscribe to premium online learning platforms and resources.',
          category: 'Education',
          goal: 1200000,
          raised: 450000,
          donors: 67,
          daysLeft: 85,
          image: '/digital.jpg',
          featured: false,
          createdDate: '2025-09-10',
        },
        {
          id: 11,
          title: 'Medical Equipment Fund',
          description: 'Purchase essential medical equipment for the campus health center.',
          category: 'Infrastructure',
          goal: 2500000,
          raised: 1800000,
          donors: 188,
          daysLeft: 55,
          image: '/medical.jpg',
          featured: false,
          createdDate: '2025-08-15',
        },
        {
          id: 12,
          title: 'Music & Arts Department',
          description: 'Support the music and arts department with instruments and supplies.',
          category: 'Education',
          goal: 900000,
          raised: 320000,
          donors: 54,
          daysLeft: 70,
          image: '/arts.jpg',
          featured: false,
          createdDate: '2025-10-05',
        },
      ];

      setCampaigns(mockCampaigns);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setIsLoading(false);
    }
  };

  const filterAndSortCampaigns = () => {
    let filtered = [...campaigns];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(campaign => 
        campaign.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Amount range filter
    if (selectedAmountRange !== 'all') {
      filtered = filtered.filter(campaign => {
        if (selectedAmountRange === '0-100000') {
          return campaign.goal < 100000;
        } else if (selectedAmountRange === '100000-500000') {
          return campaign.goal >= 100000 && campaign.goal < 500000;
        } else if (selectedAmountRange === '500000-1000000') {
          return campaign.goal >= 500000 && campaign.goal < 1000000;
        } else if (selectedAmountRange === '1000000+') {
          return campaign.goal >= 1000000;
        }
        return true;
      });
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    } else if (sortBy === 'goal-high') {
      filtered.sort((a, b) => b.goal - a.goal);
    } else if (sortBy === 'goal-low') {
      filtered.sort((a, b) => a.goal - b.goal);
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal));
    } else if (sortBy === 'ending-soon') {
      filtered.sort((a, b) => a.daysLeft - b.daysLeft);
    }

    setFilteredCampaigns(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading campaigns...</p>
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
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Support Our Campaigns
          </h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            Discover active campaigns and make a difference in your alma mater
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-100 dark:border-gray-800">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category === 'All Categories' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Goal Amount
              </label>
              <select
                value={selectedAmountRange}
                onChange={(e) => setSelectedAmountRange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                {amountRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                <option value="recent">Most Recent</option>
                <option value="goal-high">Highest Goal</option>
                <option value="goal-low">Lowest Goal</option>
                <option value="progress">Most Progress</option>
                <option value="ending-soon">Ending Soon</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'Campaign' : 'Campaigns'} Found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        {currentCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No campaigns found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  {/* Campaign Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20">
                    {campaign.featured && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20">🎯</div>
                    </div>
                  </div>

                  {/* Campaign Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full mb-3">
                      {campaign.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {campaign.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-semibold">{formatCurrency(campaign.raised)}</span>
                        <span>{getProgressPercentage(campaign.raised, campaign.goal).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Goal: {formatCurrency(campaign.goal)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{campaign.donors} donors</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{campaign.daysLeft} days left</span>
                      </div>
                    </div>

                    {/* Donate Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      Donate Now
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first, last, current, and nearby pages
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            page === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 py-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">© 2025 NOSTOS. All rights reserved.</p>
          <p className="text-sm">Connecting alumni, building futures.</p>
        </div>
      </footer>
    </div>
  );
}
