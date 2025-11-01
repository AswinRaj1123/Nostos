'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Campaign {
  id: number;
  title: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  deadline: string;
  status: 'active' | 'completed' | 'draft';
  createdDate: string;
}

export default function AdminCampaignsPage() {
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    goal: '',
    deadline: '',
    status: 'draft' as 'active' | 'completed' | 'draft',
  });

  const fetchCampaigns = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCampaigns: Campaign[] = [
        {
          id: 1,
          title: 'New Library Construction',
          description: 'Build a state-of-the-art library with modern facilities and digital resources',
          category: 'Infrastructure',
          goal: 5000000,
          raised: 3250000,
          deadline: '2025-12-15',
          status: 'active',
          createdDate: '2025-09-15',
        },
        {
          id: 2,
          title: 'Scholarship Fund 2025',
          description: 'Provide financial assistance to deserving students from economically weaker sections',
          category: 'Education',
          goal: 2000000,
          raised: 1450000,
          deadline: '2025-11-30',
          status: 'active',
          createdDate: '2025-08-01',
        },
        {
          id: 3,
          title: 'Sports Complex Renovation',
          description: 'Upgrade sports facilities including new equipment and infrastructure',
          category: 'Sports',
          goal: 3000000,
          raised: 2850000,
          deadline: '2025-10-31',
          status: 'completed',
          createdDate: '2025-07-10',
        },
        {
          id: 4,
          title: 'Research Lab Upgrade',
          description: 'Install cutting-edge research equipment for science and technology departments',
          category: 'Research',
          goal: 4000000,
          raised: 1200000,
          deadline: '2026-01-31',
          status: 'active',
          createdDate: '2025-10-01',
        },
        {
          id: 5,
          title: 'Alumni Networking Platform',
          description: 'Develop a comprehensive digital platform for alumni engagement',
          category: 'Technology',
          goal: 1500000,
          raised: 0,
          deadline: '2026-03-15',
          status: 'draft',
          createdDate: '2025-10-20',
        },
      ];

      setCampaigns(mockCampaigns);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchCampaigns();
  }, [router]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    setFormData({
      title: '',
      description: '',
      category: 'Infrastructure',
      goal: '',
      deadline: '',
      status: 'draft',
    });
    setShowModal(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      goal: campaign.goal.toString(),
      deadline: campaign.deadline,
      status: campaign.status,
    });
    setShowModal(true);
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      console.log('Deleting campaign:', id);
      
      setCampaigns(campaigns.filter(c => c.id !== id));
      alert('Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter campaign title');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter campaign description');
      return;
    }

    if (!formData.goal || parseFloat(formData.goal) <= 0) {
      alert('Please enter a valid goal amount');
      return;
    }

    if (!formData.deadline) {
      alert('Please select a deadline');
      return;
    }

    try {
      // TODO: Replace with actual API call
      if (editingCampaign) {
        console.log('Updating campaign:', editingCampaign.id, formData);
        
        setCampaigns(campaigns.map(c => 
          c.id === editingCampaign.id 
            ? {
                ...c,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                goal: parseFloat(formData.goal),
                deadline: formData.deadline,
                status: formData.status,
              }
            : c
        ));
        
        alert('Campaign updated successfully');
      } else {
        console.log('Creating new campaign:', formData);
        
        const newCampaign: Campaign = {
          id: Date.now(),
          title: formData.title,
          description: formData.description,
          category: formData.category,
          goal: parseFloat(formData.goal),
          raised: 0,
          deadline: formData.deadline,
          status: formData.status,
          createdDate: new Date().toISOString().split('T')[0],
        };
        
        setCampaigns([newCampaign, ...campaigns]);
        alert('Campaign created successfully');
      }

      setShowModal(false);
      setEditingCampaign(null);
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Failed to save campaign');
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
                href="/admin/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Dashboard
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
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Campaign Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and monitor all fundraising campaigns
              </p>
            </div>
          </div>
          <button
            onClick={handleAddCampaign}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl transition-all duration-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Campaign
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Campaigns</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{campaigns.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {campaigns.filter(c => c.status === 'completed').length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Draft</div>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {campaigns.filter(c => c.status === 'draft').length}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-800 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search campaigns..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'completed' | 'draft')}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-semibold"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredCampaigns.length}</span> of {campaigns.length} campaigns
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {campaign.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {campaign.description}
                        </div>
                        <div className="mt-1">
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full font-semibold">
                            {campaign.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(campaign.raised)}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            / {formatCurrency(campaign.goal)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getProgressPercentage(campaign.raised, campaign.goal).toFixed(0)}% achieved
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(campaign.deadline)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(campaign.deadline) > new Date() 
                          ? `${Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`
                          : 'Expired'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditCampaign(campaign)}
                          className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {searchQuery || statusFilter !== 'all' ? 'No campaigns match your filters' : 'No campaigns yet'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <button
                    onClick={handleAddCampaign}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Create Your First Campaign
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., New Library Construction"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the campaign goals and impact..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              {/* Category and Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Education">Education</option>
                    <option value="Sports">Sports</option>
                    <option value="Research">Research</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Goal Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="5000000"
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Deadline and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'draft' })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl transition-all duration-300"
                >
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
