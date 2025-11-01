# 🚀 NOSTOS Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Clone & Navigate
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Download NLTK Data
```bash
python -m nltk.downloader vader_lexicon punkt stopwords
```

### 5. Setup Environment
```bash
# Copy example env file
copy .env.example .env   # Windows
cp .env.example .env     # Linux/Mac

# Edit .env and set:
# - SECRET_KEY (generate with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
# - DATABASE_URL (PostgreSQL connection)
# - OPENAI_API_KEY (optional, for AI features)
```

### 6. Setup Database

**Option A: SQLite (Quick Test)**
```python
# In .env, comment out DATABASE_URL
# Django will use SQLite by default
```

**Option B: PostgreSQL (Recommended)**
```sql
-- Create database
CREATE DATABASE nostos_db;
CREATE USER nostos_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE nostos_db TO nostos_user;
```

```env
# In .env
DATABASE_URL=postgresql://nostos_user:yourpassword@localhost:5432/nostos_db
```

### 7. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 8. Create Superuser
```bash
python manage.py createsuperuser
```

### 9. Start Server
```bash
python manage.py runserver
```

🎉 **Backend is running at http://localhost:8000**

## 📝 Test the API

### 1. Access Admin Panel
- URL: http://localhost:8000/admin/
- Login with superuser credentials
- Create some test campaigns

### 2. Access API Documentation
- Swagger UI: http://localhost:8000/api/docs/
- Try the endpoints interactively

### 3. Test Authentication

**Register a User:**
```bash
POST http://localhost:8000/api/users/register/
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "alumni"
}
```

**Login:**
```bash
POST http://localhost:8000/api/users/login/
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "alumni"
}
```

Response will include:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}
```

### 4. Make Authenticated Requests

Use the `access` token in headers:
```bash
GET http://localhost:8000/api/campaigns/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## 🔧 Optional: Setup Background Tasks

### Start Redis (Required for Celery)
```bash
# Windows (with WSL or Redis Windows port)
redis-server

# Linux/Mac
sudo service redis-server start
```

### Start Celery Worker
```bash
# In a new terminal (with venv activated)
celery -A core worker -l info
```

## 🧪 Quick Tests

### Test Campaigns API
```bash
# List campaigns
GET http://localhost:8000/api/campaigns/

# Filter active campaigns
GET http://localhost:8000/api/campaigns/?status=active

# Search campaigns
GET http://localhost:8000/api/campaigns/?search=scholarship

# Get statistics
GET http://localhost:8000/api/campaigns/statistics/
```

### Test Donations API
```bash
# Create donation (requires auth)
POST http://localhost:8000/api/donations/create/
Authorization: Bearer YOUR_ACCESS_TOKEN
{
  "campaign": 1,
  "amount": 1000,
  "payment_method": "upi",
  "message": "Great cause!",
  "is_anonymous": false
}

# Get donation statistics
GET http://localhost:8000/api/donations/statistics/
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Test AI Features
```bash
# Generate thank you message
POST http://localhost:8000/api/ai/generate-thank-you/
Authorization: Bearer YOUR_ACCESS_TOKEN
{
  "donor_name": "John Doe",
  "campaign_title": "Education Fund",
  "amount": 5000,
  "tone": "friendly"
}

# Analyze sentiment
POST http://localhost:8000/api/ai/analyze-sentiment/
Authorization: Bearer YOUR_ACCESS_TOKEN
{
  "text": "This is an amazing platform! Very helpful."
}

# Predict donor retention
GET http://localhost:8000/api/ai/predict-retention/
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Test Analytics
```bash
# Dashboard statistics
GET http://localhost:8000/api/analytics/dashboard/
Authorization: Bearer YOUR_ACCESS_TOKEN

# Donation trends
GET http://localhost:8000/api/analytics/donation-trends/?period=month&months=6
Authorization: Bearer YOUR_ACCESS_TOKEN

# Campaign performance
GET http://localhost:8000/api/analytics/campaign-performance/
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 🐛 Troubleshooting

### Error: "No module named 'rest_framework'"
```bash
# Ensure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Reinstall requirements
pip install -r requirements.txt
```

### Error: "NLTK data not found"
```bash
python -m nltk.downloader vader_lexicon punkt stopwords
```

### Error: "Could not connect to database"
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Or use SQLite for testing (comment out DATABASE_URL)
```

### Error: "OpenAI API error"
```bash
# AI features require valid OPENAI_API_KEY in .env
# For testing, endpoints will use fallback messages
```

## 📱 Connect to Frontend

In your Next.js app, configure API base URL:

```typescript
// lib/api.ts
const API_BASE_URL = 'http://localhost:8000/api';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role: 'alumni' })
  });
  return response.json();
}
```

## 📊 Sample Data

Create sample data via Django shell:

```bash
python manage.py shell
```

```python
from users.models import User
from campaigns.models import Campaign
from django.utils import timezone
from datetime import timedelta

# Create admin user
admin = User.objects.create_user(
    email='admin@nostos.com',
    password='Admin123!',
    name='Admin User',
    role='admin'
)

# Create campaigns
Campaign.objects.create(
    title='Annual Scholarship Fund',
    description='Supporting underprivileged students',
    category='education',
    goal=100000,
    raised=45000,
    deadline=timezone.now().date() + timedelta(days=30),
    status='active',
    created_by=admin
)

Campaign.objects.create(
    title='Medical Emergency Fund',
    description='Emergency medical assistance for alumni',
    category='healthcare',
    goal=50000,
    raised=30000,
    deadline=timezone.now().date() + timedelta(days=15),
    status='active',
    created_by=admin
)
```

## 🎯 Next Steps

1. ✅ Backend API is running
2. ✅ Test endpoints with Swagger UI
3. 🔄 Connect Next.js frontend to backend
4. 🔄 Implement payment gateway (Razorpay)
5. 🔄 Configure email service for receipts
6. 🔄 Deploy to production (AWS/Heroku/DigitalOcean)

## 📚 Resources

- **API Docs**: http://localhost:8000/api/docs/
- **Admin Panel**: http://localhost:8000/admin/
- **Full Documentation**: See `DOCUMENTATION.md`
- **Setup Guide**: See `README.md`

---

**Happy Coding! 🚀**
