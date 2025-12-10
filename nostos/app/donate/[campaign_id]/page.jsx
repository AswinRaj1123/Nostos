'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { campaignsAPI, donationsAPI } from '@/lib/api';

interface Campaign {
  id: number;
  title: string;
  category: string;
  goal: number;
  raised: number;
  image: string;
}

interface DonationReceipt {
  receiptId: string;
  campaignTitle: string;
  amount: number;
  transactionId: string;
  donorName: string;
  date: string;
  paymentMethod: string;
}

export default function DonatePage() {
  const params = useParams();
  const campaignId = params.campaign_id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  // Form fields
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // Receipt
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);

  const predefinedAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch campaign details from API
        const apiCampaign = await campaignsAPI.get(parseInt(campaignId));

        const mappedCampaign: Campaign = {
          id: apiCampaign.id,
          title: apiCampaign.title,
          category: apiCampaign.category,
          goal: parseFloat(apiCampaign.goal_amount),
          raised: parseFloat(apiCampaign.current_amount),
          image: apiCampaign.image_url || '/library.jpg',
        };

        setCampaign(mappedCampaign);
        setIsLoading(false);

        // Pre-fill donor info if logged in
        const token = localStorage.getItem('token');
        if (token) {
          // TODO: Fetch user details from API
          setDonorName('John Doe');
          setDonorEmail('john@example.com');
          setDonorPhone('9876543210');
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
        setIsLoading(false);
      }
    };
    
    fetchCampaignDetails();
  }, [campaignId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSelectedAmount = () => {
    if (customAmount) return parseFloat(customAmount);
    if (donationAmount) return parseFloat(donationAmount);
    return 0;
  };

  const validateForm = () => {
    const amount = getSelectedAmount();

    if (!amount || amount < 100) {
      alert('Minimum donation amount is ₹100');
      return false;
    }

    if (!isAnonymous) {
      if (!donorName.trim()) {
        alert('Please enter your name');
        return false;
      }
      if (!donorEmail.trim() || !donorEmail.includes('@')) {
        alert('Please enter a valid email address');
        return false;
      }
      if (!donorPhone.trim() || donorPhone.length < 10) {
        alert('Please enter a valid phone number');
        return false;
      }
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Please enter a valid card number');
        return false;
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        alert('Please enter card expiry (MM/YY)');
        return false;
      }
      if (!cardCvv || cardCvv.length !== 3) {
        alert('Please enter valid CVV');
        return false;
      }
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      alert('Please enter your UPI ID');
      return false;
    }

    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStep('processing');

    try {
      const amount = getSelectedAmount();

      // Create donation via API
      const donationData = {
        campaign: parseInt(campaignId),
        amount: amount,
        payment_method: paymentMethod,
        message: message,
        is_anonymous: isAnonymous,
      };

      const donation = await donationsAPI.create(donationData);

      // Generate receipt from API response
      const mockReceipt: DonationReceipt = {
        receiptId: `RCPT${donation.id}`,
        campaignTitle: campaign?.title || '',
        amount: parseFloat(donation.amount),
        transactionId: donation.transaction_id || `TXN${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        donorName: donation.donor_name,
        date: donation.created_at,
        paymentMethod: paymentMethod.toUpperCase(),
      };

      setReceipt(mockReceipt);
      setStep('success');
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Payment failed. Please try again.');
      setStep('form');
    }
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setCardExpiry(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  const downloadReceipt = () => {
    alert('Receipt download functionality will be implemented with backend integration');
    // TODO: Generate and download PDF receipt
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading donation page...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Unable to load campaign details.</p>
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
            <Link
              href={`/campaigns/${campaignId}`}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              ← Back to Campaign
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {step === 'form' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Donation Form */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Make a Donation</h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">Support this campaign and make a difference</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campaign Info */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Donating to:</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{campaign.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{campaign.category}</p>
                    </div>

                    {/* Amount Selection */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Select Donation Amount *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {predefinedAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              setDonationAmount(amount.toString());
                              setCustomAmount('');
                            }}
                            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                              donationAmount === amount.toString() && !customAmount
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {formatCurrency(amount)}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">₹</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setDonationAmount('');
                          }}
                          placeholder="Or enter custom amount"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                      </div>
                      {getSelectedAmount() > 0 && (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                          You are donating: {formatCurrency(getSelectedAmount())}
                        </p>
                      )}
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
                        Make my donation anonymous
                      </label>
                    </div>

                    {/* Donor Information */}
                    {!isAnonymous && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Information</h3>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                              placeholder="your@email.com"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={donorPhone}
                              onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, '').substring(0, 10))}
                              placeholder="9876543210"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share why you're supporting this campaign..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Payment Method *
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`py-4 px-4 rounded-lg font-semibold transition-all border-2 ${
                            paymentMethod === 'upi'
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">📱</div>
                          <div className="text-sm">UPI</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`py-4 px-4 rounded-lg font-semibold transition-all border-2 ${
                            paymentMethod === 'card'
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">💳</div>
                          <div className="text-sm">Card</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('netbanking')}
                          className={`py-4 px-4 rounded-lg font-semibold transition-all border-2 ${
                            paymentMethod === 'netbanking'
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">🏦</div>
                          <div className="text-sm">Net Banking</div>
                        </button>
                      </div>

                      {/* Payment Details */}
                      {paymentMethod === 'upi' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            UPI ID *
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="yourname@upi"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                          />
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => handleCardNumberChange(e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Expiry (MM/YY) *
                              </label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => handleExpiryChange(e.target.value)}
                                placeholder="12/25"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                CVV *
                              </label>
                              <input
                                type="password"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                placeholder="123"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'netbanking' && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-400">
                            You will be redirected to your bank&apos;s website to complete the payment securely.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <label htmlFor="terms" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        I agree to the terms and conditions and confirm that all information provided is accurate. *
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      Donate {getSelectedAmount() > 0 && formatCurrency(getSelectedAmount())}
                    </button>
                  </form>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 lg:sticky lg:top-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Donation Summary</h3>
                  
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Campaign:</span>
                      <span className="text-gray-900 dark:text-white font-semibold text-right">{campaign.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {getSelectedAmount() > 0 ? formatCurrency(getSelectedAmount()) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                      <span className="text-gray-900 dark:text-white font-semibold uppercase">{paymentMethod}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Secure payment gateway</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>100% tax deductible</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Instant receipt via email</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-12 border border-gray-100 dark:border-gray-800 text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing Payment</h2>
              <p className="text-gray-600 dark:text-gray-400">Please wait while we process your donation...</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">Do not refresh or close this page</p>
            </div>
          )}

          {step === 'success' && receipt && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100 dark:border-gray-800">
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">Your donation was successful</p>
              </div>

              {/* Receipt */}
              <div className="max-w-2xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 sm:p-8 mb-6">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Donation Receipt</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(receipt.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receipt ID</p>
                      <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">{receipt.receiptId}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Donor Name:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{receipt.donorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Campaign:</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-right">{receipt.campaignTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                      <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{receipt.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{receipt.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300 dark:border-gray-700">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Amount Donated:</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(receipt.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      A copy of this receipt has been sent to your email address
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={downloadReceipt}
                    className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Receipt
                  </button>
                  <Link
                    href="/campaigns"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all text-center"
                  >
                    Browse More Campaigns
                  </Link>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/alumni/dashboard"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    View Donation History →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
