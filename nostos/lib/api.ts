/**
 * API Client for NOSTOS Backend
 * Base URL: http://localhost:8000/api
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Token management
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// API request wrapper with automatic token refresh
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    let response = await fetch(url, config);

    // If token expired, try to refresh
    if (response.status === 401 && accessToken) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setTokens(data.access, refreshToken);
          
          // Retry original request with new token
          headers['Authorization'] = `Bearer ${data.access}`;
          response = await fetch(url, { ...config, headers });
        } else {
          // Refresh failed, logout user
          clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Session expired. Please login again.');
        }
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============= AUTH APIs =============

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    password2: string;
    name: string;
    phone: string;
    role: 'alumni' | 'admin';
    department?: string;
    graduation_year?: number;
  }) => {
    const response = await apiRequest('/users/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.access && response.refresh) {
      setTokens(response.access, response.refresh);
      setUser(response.user);
    }
    
    return response;
  },

  login: async (email: string, password: string, role: 'alumni' | 'admin') => {
    const response = await apiRequest('/users/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    
    if (response.access && response.refresh) {
      setTokens(response.access, response.refresh);
      setUser(response.user);
    }
    
    return response;
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await apiRequest('/users/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      }).catch(() => {
        // Ignore errors on logout
      });
    }
    clearTokens();
  },

  getProfile: async () => {
    return await apiRequest('/users/profile/');
  },

  updateProfile: async (data: any) => {
    return await apiRequest('/users/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return await apiRequest('/users/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password2: newPassword,
      }),
    });
  },

  forgotPassword: async (email: string) => {
    return await apiRequest('/users/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return await apiRequest('/users/reset-password/', {
      method: 'POST',
      body: JSON.stringify({
        token,
        new_password: newPassword,
        new_password2: newPassword,
      }),
    });
  },
};

// ============= CAMPAIGNS APIs =============

export const campaignsAPI = {
  list: async (params?: {
    status?: string;
    category?: string;
    search?: string;
    ordering?: string;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());

    const query = queryParams.toString();
    return await apiRequest(`/campaigns/${query ? '?' + query : ''}`);
  },

  get: async (id: number) => {
    return await apiRequest(`/campaigns/${id}/`);
  },

  create: async (data: any) => {
    return await apiRequest('/campaigns/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return await apiRequest(`/campaigns/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return await apiRequest(`/campaigns/${id}/`, {
      method: 'DELETE',
    });
  },

  getStatistics: async () => {
    return await apiRequest('/campaigns/statistics/');
  },

  getTop: async (limit: number = 10) => {
    return await apiRequest(`/campaigns/top/?limit=${limit}`);
  },

  getUpdates: async (campaignId: number) => {
    return await apiRequest(`/campaigns/${campaignId}/updates/`);
  },

  addUpdate: async (campaignId: number, data: { title: string; message: string }) => {
    return await apiRequest(`/campaigns/${campaignId}/updates/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getTestimonials: async (campaignId: number) => {
    return await apiRequest(`/campaigns/${campaignId}/testimonials/`);
  },

  addTestimonial: async (campaignId: number, data: { message: string; rating: number }) => {
    return await apiRequest(`/campaigns/${campaignId}/testimonials/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============= DONATIONS APIs =============

export const donationsAPI = {
  list: async () => {
    return await apiRequest('/donations/');
  },

  get: async (id: number) => {
    return await apiRequest(`/donations/${id}/`);
  },

  create: async (data: {
    campaign: number;
    amount: number;
    payment_method: 'upi' | 'card' | 'netbanking' | 'wallet';
    message?: string;
    is_anonymous?: boolean;
  }) => {
    return await apiRequest('/donations/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getStatistics: async () => {
    return await apiRequest('/donations/statistics/');
  },

  getHistoryChart: async (months: number = 12) => {
    return await apiRequest(`/donations/history-chart/?months=${months}`);
  },

  getCampaignLeaderboard: async (campaignId: number, limit: number = 10) => {
    return await apiRequest(`/donations/campaign/${campaignId}/leaderboard/?limit=${limit}`);
  },

  generateReceipt: async (donationId: number) => {
    return await apiRequest(`/donations/${donationId}/receipt/`, {
      method: 'POST',
    });
  },
};

// ============= AI APIs =============

export const aiAPI = {
  generateThankYou: async (data: {
    donor_name: string;
    campaign_title: string;
    amount: number;
    tone?: 'formal' | 'friendly' | 'casual';
  }) => {
    return await apiRequest('/ai/generate-thank-you/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  generateDescription: async (data: {
    title: string;
    category: string;
    goal: number;
    brief_description: string;
  }) => {
    return await apiRequest('/ai/generate-description/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  analyzeSentiment: async (text: string) => {
    return await apiRequest('/ai/analyze-sentiment/', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  analyzeFeedback: async (feedback: string) => {
    return await apiRequest('/ai/analyze-feedback/', {
      method: 'POST',
      body: JSON.stringify({ feedback }),
    });
  },

  analyzeTestimonial: async (testimonial: string) => {
    return await apiRequest('/ai/analyze-testimonial/', {
      method: 'POST',
      body: JSON.stringify({ testimonial }),
    });
  },

  predictRetention: async () => {
    return await apiRequest('/ai/predict-retention/');
  },

  predictSuccess: async (campaignId: number) => {
    return await apiRequest(`/ai/predict-success/${campaignId}/`);
  },

  getLikelyDonors: async () => {
    return await apiRequest('/ai/likely-donors/');
  },
};

// ============= ANALYTICS APIs =============

export const analyticsAPI = {
  getDashboard: async () => {
    return await apiRequest('/analytics/dashboard/');
  },

  getDonationTrends: async (period: 'day' | 'week' | 'month' = 'month', months: number = 12) => {
    return await apiRequest(`/analytics/donation-trends/?period=${period}&months=${months}`);
  },

  getCampaignPerformance: async () => {
    return await apiRequest('/analytics/campaign-performance/');
  },

  getDonorAnalytics: async () => {
    return await apiRequest('/analytics/donor-analytics/');
  },

  getSentimentReport: async () => {
    return await apiRequest('/analytics/sentiment-report/');
  },

  getCategoryBreakdown: async () => {
    return await apiRequest('/analytics/category-breakdown/');
  },

  exportReport: async (type: string = 'summary') => {
    return await apiRequest(`/analytics/export-report/?type=${type}`);
  },
};

export default {
  auth: authAPI,
  campaigns: campaignsAPI,
  donations: donationsAPI,
  ai: aiAPI,
  analytics: analyticsAPI,
};
