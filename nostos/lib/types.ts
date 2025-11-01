/**
 * TypeScript types for NOSTOS Backend API
 */

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: 'alumni' | 'admin';
  department?: string;
  graduation_year?: number;
  current_company?: string;
  current_position?: string;
  location?: string;
  linkedin?: string;
  bio?: string;
  profile_picture?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  category: 'education' | 'healthcare' | 'infrastructure' | 'research' | 'sports' | 'arts' | 'environment' | 'other';
  goal: number;
  raised: number;
  deadline: string;
  status: 'draft' | 'active' | 'completed';
  image?: string;
  created_by: User;
  created_at: string;
  updated_at: string;
  progress_percentage: number;
  is_active: boolean;
  donor_count: number;
}

export interface CampaignUpdate {
  id: number;
  campaign: number;
  title: string;
  message: string;
  created_by: User;
  created_at: string;
}

export interface CampaignTestimonial {
  id: number;
  campaign: number;
  donor: User;
  message: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export interface Donation {
  id: number;
  transaction_id: string;
  donor: User;
  campaign: Campaign;
  amount: number;
  payment_method: 'upi' | 'card' | 'netbanking' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  message?: string;
  is_anonymous: boolean;
  receipt_number: string;
  receipt_sent: boolean;
  created_at: string;
  completed_at?: string;
}

export interface DonationStatistics {
  total_donated: number;
  donation_count: number;
  campaigns_supported: number;
  recent_donations: Donation[];
}

export interface DashboardStatistics {
  donations: {
    total_amount: number;
    total_count: number;
    recent_amount: number;
    recent_count: number;
  };
  campaigns: {
    total: number;
    active: number;
    completed: number;
    total_goal: number;
    total_raised: number;
  };
  alumni: {
    total_count: number;
    active_donors: number;
  };
  top_campaign?: {
    id: number;
    title: string;
    raised: number;
  };
}

export interface DonationTrend {
  period: string;
  total_amount: number;
  donation_count: number;
  avg_amount: number;
}

export interface CampaignPerformance {
  campaign_id: number;
  title: string;
  category: string;
  status: string;
  goal: number;
  raised: number;
  progress_percentage: number;
  donor_count: number;
  avg_donation: number;
  days_active: number;
  daily_donation_rate: number;
  update_count: number;
  testimonial_count: number;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
  scores: {
    vader_positive: number;
    vader_negative: number;
    vader_neutral: number;
    vader_compound: number;
    textblob_polarity: number;
    textblob_subjectivity: number;
  };
}

export interface FeedbackClassification {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: string;
  categories: string[];
  scores: any;
}

export interface TestimonialQuality {
  quality_score: number;
  word_count: number;
  sentiment: string;
  suggestions: string[];
}

export interface DonorRetentionPrediction {
  retention_probability: number;
  statistics: {
    total_donations: number;
    total_amount: number;
    avg_donation: number;
    days_since_last_donation: number;
    campaigns_supported: number;
    account_age_days: number;
  };
  recommendation: string;
}

export interface CampaignSuccessPrediction {
  campaign_id: number;
  success_probability: number;
  current_progress: number;
  days_remaining: number;
  suggestions: string[];
}

export interface APIError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
