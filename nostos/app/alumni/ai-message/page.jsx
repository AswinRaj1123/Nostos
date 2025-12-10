'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { aiAPI } from '@/lib/api';

interface MessageParams {
  recipient: string;
  recipientType: 'admin' | 'campaign';
  donationAmount: string;
  tone: 'formal' | 'friendly' | 'emotional';
  campaignName?: string;
  additionalContext?: string;
}

export default function AIMessagePage() {
  const router = useRouter();

  // Check authentication
  const [isAuthenticated] = useState(true);

  // Form fields
  const [recipientType, setRecipientType] = useState<'admin' | 'campaign'>('campaign');
  const [recipientName, setRecipientName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [tone, setTone] = useState<'formal' | 'friendly' | 'emotional'>('friendly');
  const [additionalContext, setAdditionalContext] = useState('');

  // Generated message state
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const validateForm = () => {
    if (!recipientName.trim()) {
      alert('Please enter recipient name');
      return false;
    }

    if (recipientType === 'campaign' && !campaignName.trim()) {
      alert('Please enter campaign name');
      return false;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return false;
    }

    return true;
  };

  const generateMessage = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setGeneratedMessage('');

    try {
      // Call AI API to generate thank you message
      const result = await aiAPI.generateThankYou({
        donor_name: recipientName,
        campaign_title: recipientType === 'campaign' ? campaignName : 'General Fund',
        amount: parseFloat(donationAmount),
        tone: tone === 'emotional' ? 'friendly' : tone,
      });

      setGeneratedMessage(result.message);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating message:', error);
      alert('Failed to generate message. Please try again.');
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const regenerateMessage = () => {
    generateMessage();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please log in to access the AI Message Generator</p>
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Go to Login
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
                href="/alumni/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/campaigns"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Campaigns
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
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
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                href="/alumni/dashboard"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-2"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  AI Message Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Create personalized thank-you messages powered by AI
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Message Details</h2>

              <div className="space-y-6">
                {/* Recipient Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Recipient Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRecipientType('campaign')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                        recipientType === 'campaign'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-sm">Campaign</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecipientType('admin')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                        recipientType === 'admin'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">👔</div>
                      <div className="text-sm">Admin</div>
                    </button>
                  </div>
                </div>

                {/* Recipient Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder={recipientType === 'campaign' ? 'e.g., Dr. Sharma' : 'e.g., Dean/Principal Name'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Campaign Name (conditional) */}
                {recipientType === 'campaign' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="e.g., New Library Construction"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {/* Donation Amount */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Donation Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">₹</span>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  {donationAmount && parseFloat(donationAmount) > 0 && (
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      {formatCurrency(donationAmount)}
                    </p>
                  )}
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Message Tone *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTone('formal')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                        tone === 'formal'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">🎩</div>
                      <div className="text-sm">Formal</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTone('friendly')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                        tone === 'friendly'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">😊</div>
                      <div className="text-sm">Friendly</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTone('emotional')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                        tone === 'emotional'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">❤️</div>
                      <div className="text-sm">Emotional</div>
                    </button>
                  </div>
                </div>

                {/* Additional Context */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Add any specific details you'd like to include in the message..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateMessage}
                  disabled={isGenerating}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:scale-105'
                  } text-white`}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    '✨ Generate Message'
                  )}
                </button>
              </div>
            </div>

            {/* Generated Message Output */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Message</h2>
                {generatedMessage && (
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                    >
                      {showCopied ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={regenerateMessage}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center disabled:bg-gray-400"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </button>
                  </div>
                )}
              </div>

              {!generatedMessage && !isGenerating && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Fill in the details and click &quot;Generate Message&quot; to create your personalized thank-you message
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    AI is crafting your personalized message...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    This may take a few seconds
                  </p>
                </div>
              )}

              {generatedMessage && !isGenerating && (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                    <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-white leading-relaxed">
                      {generatedMessage}
                    </pre>
                  </div>

                  <div className="flex items-start space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Tip:</strong> Feel free to edit the message before sending. Replace &quot;[Your Name]&quot; with your actual name, and customize any parts to make it more personal.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Personalized</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI generates messages tailored to your specific donation and recipient
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Instant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate professional messages in seconds with just a few clicks
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="text-3xl mb-3">✏️</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Customizable</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose the perfect tone and add context to match your style
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
