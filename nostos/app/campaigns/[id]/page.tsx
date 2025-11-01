'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Campaign {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  goal: number;
  raised: number;
  donors: number;
  daysLeft: number;
  deadline: string;
  image: string;
  organizer: string;
  createdDate: string;
}

interface Donor {
  id: number;
  name: string;
  amount: number;
  date: string;
  message?: string;
}

interface Comment {
  id: number;
  name: string;
  message: string;
  date: string;
  avatar: string;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [topDonors, setTopDonors] = useState<Donor[]>([]);
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const fetchCampaignDetails = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock campaign data
      const mockCampaign: Campaign = {
        id: parseInt(campaignId),
        title: 'New Library Construction',
        description: 'Help us build a state-of-the-art library with modern facilities',
        fullDescription: `We are embarking on an ambitious project to construct a new, state-of-the-art library that will serve as a beacon of knowledge and learning for our students. This modern facility will feature:

• Digital Learning Zones with cutting-edge technology
• Collaborative study spaces for group projects
• Quiet reading rooms for focused study
• Research labs with access to global databases
• Accessibility features for students with disabilities
• Energy-efficient design with sustainable materials

The new library will span 50,000 square feet and will house over 100,000 books, along with digital resources, multimedia equipment, and comfortable seating for 500+ students. This project represents our commitment to providing world-class educational infrastructure.

Your contribution will directly impact:
- Enhanced learning opportunities for 5,000+ students
- Improved research capabilities for faculty
- Community engagement through public programs
- Long-term value for future generations of alumni

Join us in building a legacy that will inspire learning for decades to come!`,
        category: 'Infrastructure',
        goal: 5000000,
        raised: 3250000,
        donors: 245,
        daysLeft: 45,
        deadline: '2025-12-15',
        image: '/library.jpg',
        organizer: 'Alumni Association',
        createdDate: '2025-09-15',
      };

      // Mock top donors
      const mockTopDonors: Donor[] = [
        { id: 1, name: 'Rajesh Kumar', amount: 500000, date: '2025-10-25', message: 'Proud to contribute to our alma mater!' },
        { id: 2, name: 'Priya Sharma', amount: 300000, date: '2025-10-20', message: 'Education is the key to future success.' },
        { id: 3, name: 'Anonymous', amount: 250000, date: '2025-10-18' },
        { id: 4, name: 'Amit Patel', amount: 200000, date: '2025-10-15', message: 'Happy to support this initiative!' },
        { id: 5, name: 'Sneha Gupta', amount: 150000, date: '2025-10-12' },
      ];

      // Mock recent donors
      const mockRecentDonors: Donor[] = [
        { id: 6, name: 'Vikram Singh', amount: 50000, date: '2025-10-28' },
        { id: 7, name: 'Meera Reddy', amount: 75000, date: '2025-10-27', message: 'Great cause!' },
        { id: 8, name: 'Arjun Malhotra', amount: 25000, date: '2025-10-26' },
        { id: 9, name: 'Kavya Nair', amount: 100000, date: '2025-10-25' },
        { id: 10, name: 'Anonymous', amount: 30000, date: '2025-10-24' },
      ];

      // Mock comments
      const mockComments: Comment[] = [
        {
          id: 1,
          name: 'Rohit Verma',
          message: 'This is an excellent initiative! The new library will truly transform the learning experience for students. Proud to be part of this.',
          date: '2025-10-26',
          avatar: 'RV',
        },
        {
          id: 2,
          name: 'Ananya Iyer',
          message: 'As an alumna, I remember spending countless hours in the old library. Excited to see the next generation have access to world-class facilities!',
          date: '2025-10-24',
          avatar: 'AI',
        },
        {
          id: 3,
          name: 'Karthik Ramesh',
          message: 'Already donated and encouraging my batchmates to contribute as well. Let\'s make this happen!',
          date: '2025-10-22',
          avatar: 'KR',
        },
      ];

      setCampaign(mockCampaign);
      setTopDonors(mockTopDonors);
      setRecentDonors(mockRecentDonors);
      setComments(mockComments);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

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
      month: 'long',
      year: 'numeric',
    });
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    try {
      // TODO: Integrate with payment gateway and backend API
      console.log({
        campaignId,
        amount: parseFloat(donationAmount),
        message: donationMessage,
        anonymous: isAnonymous,
      });

      alert(`Thank you for your donation of ${formatCurrency(parseFloat(donationAmount))}!`);
      setShowDonateModal(false);
      setDonationAmount('');
      setDonationMessage('');
      setIsAnonymous(false);
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Failed to process donation. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The campaign you're looking for doesn't exist.</p>
          <Link href="/campaigns" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Campaigns
          </Link>
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
                href="/campaigns"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                All Campaigns
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/campaigns" className="hover:text-blue-600 dark:hover:text-blue-400">Campaigns</Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">{campaign.title}</span>
            </nav>

            {/* Campaign Image */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="relative h-64 sm:h-96 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl opacity-20">📚</div>
                </div>
              </div>
            </div>

            {/* Campaign Info */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
              {/* Category Badge */}
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
                {campaign.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {campaign.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>By {campaign.organizer}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Created {formatDate(campaign.createdDate)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Campaign</h2>
                <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {campaign.fullDescription}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Testimonials ({comments.length})
              </h2>
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {comment.avatar}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{comment.name}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(comment.date)}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{comment.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Donation Card & Leaderboard */}
          <div className="lg:col-span-1 space-y-6">
            {/* Donation Card - Sticky */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 lg:sticky lg:top-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(campaign.raised)}
                  </h3>
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    {getProgressPercentage(campaign.raised, campaign.goal).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  raised of {formatCurrency(campaign.goal)} goal
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.donors}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Donors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.daysLeft}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Days Left</p>
                </div>
              </div>

              {/* Deadline */}
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center text-yellow-800 dark:text-yellow-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold">
                    Campaign ends on {formatDate(campaign.deadline)}
                  </span>
                </div>
              </div>

              {/* Donate Button */}
              <button
                onClick={() => setShowDonateModal(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Donate Now
              </button>

              {/* Share */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">Share this campaign</p>
                <div className="flex justify-center space-x-3">
                  <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Top Donors Leaderboard */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Top Donors 🏆
              </h3>
              <div className="space-y-3">
                {topDonors.map((donor, index) => (
                  <div
                    key={donor.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{donor.name}</p>
                        {donor.message && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{donor.message}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                      {formatCurrency(donor.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Donors */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Donors
              </h3>
              <div className="space-y-3">
                {recentDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{donor.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(donor.date)}</p>
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(donor.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Make a Donation</h2>
              <button
                onClick={() => setShowDonateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[5000, 10000, 25000, 50000, 100000, 250000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        donationAmount === amount.toString()
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Or Enter Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₹</span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  placeholder="Share why you're supporting this campaign..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Anonymous */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Make my donation anonymous
                </label>
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl transition-all duration-300"
              >
                Donate {donationAmount && `${formatCurrency(parseFloat(donationAmount))}`}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Your donation is secure and will be processed immediately
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
