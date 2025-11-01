'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keywords: string[];
  summary: string;
}

interface FeedbackHistory {
  id: number;
  feedback: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  date: string;
}

export default function FeedbackPage() {
  const router = useRouter();

  // Check authentication
  const [isAuthenticated] = useState(true);

  // Form state
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState<'general' | 'campaign' | 'facility' | 'event'>('general');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  // History state
  const [feedbackHistory] = useState<FeedbackHistory[]>([
    {
      id: 1,
      feedback: 'The new library construction campaign is amazing! So proud to contribute.',
      sentiment: 'positive',
      date: '2025-10-28',
    },
    {
      id: 2,
      feedback: 'Would be great to have more transparency about how funds are being used.',
      sentiment: 'neutral',
      date: '2025-10-25',
    },
    {
      id: 3,
      feedback: 'The campus infrastructure needs urgent attention in some areas.',
      sentiment: 'negative',
      date: '2025-10-20',
    },
  ]);

  const analyzeSentiment = async () => {
    if (!feedback.trim()) {
      alert('Please enter some feedback to analyze');
      return;
    }

    setIsAnalyzing(true);
    setSentimentResult(null);

    try {
      // TODO: Replace with actual sentiment analysis API call
      console.log('Analyzing feedback:', feedback);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock sentiment analysis based on keywords
      const feedbackLower = feedback.toLowerCase();
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      let confidence = 0;
      const keywords: string[] = [];

      // Positive keywords
      const positiveWords = ['great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'proud', 'love', 'perfect', 'outstanding', 'impressed', 'grateful', 'thankful', 'happy', 'appreciate'];
      const positiveCount = positiveWords.filter(word => {
        if (feedbackLower.includes(word)) {
          keywords.push(word);
          return true;
        }
        return false;
      }).length;

      // Negative keywords
      const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointing', 'disappointed', 'issue', 'problem', 'concern', 'urgent', 'lacking', 'needs improvement', 'worst'];
      const negativeCount = negativeWords.filter(word => {
        if (feedbackLower.includes(word)) {
          keywords.push(word);
          return true;
        }
        return false;
      }).length;

      // Neutral keywords
      const neutralWords = ['okay', 'fine', 'average', 'suggestion', 'recommend', 'could', 'should', 'would', 'maybe'];
      neutralWords.forEach(word => {
        if (feedbackLower.includes(word) && !keywords.includes(word)) {
          keywords.push(word);
        }
      });

      // Determine sentiment
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        confidence = Math.min(50 + (positiveCount * 15), 95);
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        confidence = Math.min(50 + (negativeCount * 15), 95);
      } else {
        sentiment = 'neutral';
        confidence = 60 + Math.random() * 20;
      }

      const mockResult: SentimentResult = {
        sentiment,
        confidence: Math.round(confidence),
        keywords: keywords.slice(0, 5),
        summary: sentiment === 'positive' 
          ? 'Your feedback expresses appreciation and positive sentiment towards the institution/campaign.'
          : sentiment === 'negative'
          ? 'Your feedback highlights areas of concern that need attention.'
          : 'Your feedback provides constructive suggestions and observations.',
      };

      setSentimentResult(mockResult);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      alert('Failed to analyze sentiment. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      alert('Please enter your feedback');
      return;
    }

    if (!sentimentResult) {
      alert('Please analyze sentiment before submitting');
      return;
    }

    try {
      // TODO: Replace with actual API call to submit feedback
      const feedbackData = {
        feedback,
        category,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        is_anonymous: isAnonymous,
      };

      console.log('Submitting feedback:', feedbackData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowSubmitSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFeedback('');
        setSentimentResult(null);
        setShowSubmitSuccess(false);
        setCategory('general');
        setIsAnonymous(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'negative':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'neutral':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    }
  };

  const getSentimentEmoji = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      case 'neutral':
        return '😐';
    }
  };

  const getSentimentLabel = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'Positive';
      case 'negative':
        return 'Negative';
      case 'neutral':
        return 'Neutral';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please log in to submit feedback</p>
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
        <div className="max-w-6xl mx-auto">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  Feedback & Sentiment Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Share your thoughts and get AI-powered sentiment insights
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feedback Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submit Your Feedback</h2>

                <div className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Feedback Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => setCategory('general')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                          category === 'general'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">💬</div>
                        <div className="text-xs">General</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategory('campaign')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                          category === 'campaign'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="text-xs">Campaign</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategory('facility')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                          category === 'facility'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">🏢</div>
                        <div className="text-xs">Facility</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategory('event')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                          category === 'event'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">🎉</div>
                        <div className="text-xs">Event</div>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or concerns about the institution, campaigns, facilities, or events..."
                      rows={8}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {feedback.length} characters
                      </span>
                      {feedback.length < 20 && feedback.length > 0 && (
                        <span className="text-sm text-yellow-600 dark:text-yellow-400">
                          Please provide more details for better analysis
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Anonymous Option */}
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="anonymous" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      Submit feedback anonymously
                    </label>
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={analyzeSentiment}
                    disabled={isAnalyzing || !feedback.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                      isAnalyzing || !feedback.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 hover:shadow-xl hover:scale-105'
                    } text-white`}
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      '🔍 Analyze Sentiment'
                    )}
                  </button>

                  {/* Sentiment Result */}
                  {sentimentResult && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className={`p-6 rounded-xl border-2 ${getSentimentColor(sentimentResult.sentiment)}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-5xl">{getSentimentEmoji(sentimentResult.sentiment)}</span>
                            <div>
                              <h3 className="text-xl font-bold">
                                {getSentimentLabel(sentimentResult.sentiment)} Sentiment
                              </h3>
                              <p className="text-sm opacity-80">
                                Confidence: {sentimentResult.confidence}%
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">{sentimentResult.confidence}%</div>
                          </div>
                        </div>

                        {/* Confidence Bar */}
                        <div className="w-full bg-white dark:bg-gray-800 rounded-full h-3 mb-4">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              sentimentResult.sentiment === 'positive' ? 'bg-green-600' :
                              sentimentResult.sentiment === 'negative' ? 'bg-red-600' :
                              'bg-yellow-600'
                            }`}
                            style={{ width: `${sentimentResult.confidence}%` }}
                          ></div>
                        </div>

                        <p className="text-sm mb-4">{sentimentResult.summary}</p>

                        {sentimentResult.keywords.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-2">Key Words Detected:</p>
                            <div className="flex flex-wrap gap-2">
                              {sentimentResult.keywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-semibold"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={submitFeedback}
                        disabled={showSubmitSuccess}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                          showSubmitSuccess
                            ? 'bg-green-600'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:scale-105'
                        } text-white`}
                      >
                        {showSubmitSuccess ? (
                          <span className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Feedback Submitted Successfully!
                          </span>
                        ) : (
                          '📤 Submit Feedback'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Info Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Write Feedback</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Share your thoughts and experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Analyze Sentiment</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">AI detects the tone of your feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Submit</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Your feedback helps us improve</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Feedback History */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Recent Feedback</h3>
                <div className="space-y-3">
                  {feedbackHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{getSentimentEmoji(item.sentiment)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.date).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {item.feedback}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          item.sentiment === 'positive' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                          item.sentiment === 'negative' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                          'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {getSentimentLabel(item.sentiment)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
