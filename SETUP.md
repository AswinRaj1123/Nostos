# 🚀 NOSTOS Complete Setup & Integration Script

## Quick Start (Windows PowerShell)

Run these commands in order to get the full stack running:

### 1. Backend Setup

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -m nltk.downloader vader_lexicon punkt stopwords

# Create .env file
Copy-Item .env.example .env

# Open .env and configure:
# - SECRET_KEY (generate with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
# - DATABASE_URL (or comment out for SQLite)
# - OPENAI_API_KEY (optional)

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Enter: admin@nostos.com / password of your choice

# Start Django server
python manage.py runserver
```

**Backend will run at: http://localhost:8000**

---

### 2. Frontend Setup

Open a **NEW PowerShell terminal**:

```powershell
# Navigate to frontend
cd nostos

# Install dependencies (if not already done)
npm install

# Verify .env.local exists with:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start Next.js dev server
npm run dev
```

**Frontend will run at: http://localhost:3000**

---

### 3. Optional: Start Celery (for background tasks)

Open a **THIRD PowerShell terminal**:

```powershell
# Start Redis (if installed)
redis-server

# Or using WSL
wsl redis-server

# In backend directory with venv activated
cd backend
.\venv\Scripts\activate

# Start Celery worker
celery -A core worker -l info
```

---

## ✅ Verification Steps

### 1. Test Backend
```powershell
# Test API is accessible
curl http://localhost:8000/api/campaigns/statistics/

# Access Swagger docs
# Open in browser: http://localhost:8000/api/docs/

# Access Django admin
# Open in browser: http://localhost:8000/admin/
# Login with superuser credentials
```

### 2. Test Frontend
```powershell
# Open in browser: http://localhost:3000
# You should see the NOSTOS home page

# Try registering: http://localhost:3000/register
# Try logging in: http://localhost:3000/login
```

### 3. Test Integration
```powershell
# Open browser DevTools (F12)
# Go to Network tab
# Login at http://localhost:3000/login
# You should see API call to http://localhost:8000/api/users/login/
# Check Application → Local Storage → you should see access_token, refresh_token, user
```

---

## 🎯 Create Sample Data

In Django shell:

```powershell
cd backend
.\venv\Scripts\activate
python manage.py shell
```

Then in the Python shell:

```python
from users.models import User
from campaigns.models import Campaign
from django.utils import timezone
from datetime import timedelta

# Create an admin user (if not created via createsuperuser)
admin = User.objects.create_user(
    email='admin@nostos.com',
    password='Admin123!',
    name='Admin User',
    phone='+1234567890',
    role='admin'
)

# Create sample campaigns
Campaign.objects.create(
    title='Annual Scholarship Fund 2024',
    description='Supporting underprivileged students with full tuition scholarships. Help us provide quality education to deserving students from low-income families.',
    category='education',
    goal=100000,
    raised=45000,
    deadline=timezone.now().date() + timedelta(days=30),
    status='active',
    created_by=admin
)

Campaign.objects.create(
    title='Medical Emergency Fund',
    description='Emergency medical assistance for alumni and their families. Quick financial support during medical crises.',
    category='healthcare',
    goal=50000,
    raised=30000,
    deadline=timezone.now().date() + timedelta(days=15),
    status='active',
    created_by=admin
)

Campaign.objects.create(
    title='Library Infrastructure Upgrade',
    description='Modernize our library with digital resources, comfortable seating, and state-of-the-art facilities.',
    category='infrastructure',
    goal=200000,
    raised=85000,
    deadline=timezone.now().date() + timedelta(days=60),
    status='active',
    created_by=admin
)

Campaign.objects.create(
    title='AI Research Lab Setup',
    description='Establish a cutting-edge AI research laboratory with latest GPUs and research tools.',
    category='research',
    goal=500000,
    raised=150000,
    deadline=timezone.now().date() + timedelta(days=90),
    status='active',
    created_by=admin
)

print("Sample data created successfully!")
```

---

## 🧪 Test the Complete Flow

### Test 1: Register & Login
1. Open http://localhost:3000/register
2. Register as: test@nostos.com / TestPass123!
3. Should auto-login and redirect to /alumni/dashboard

### Test 2: View Campaigns
1. Go to http://localhost:3000/campaigns
2. Should see the 4 sample campaigns
3. Click on a campaign to view details

### Test 3: Admin Functions
1. Logout and login as admin
2. Email: admin@nostos.com
3. Go to http://localhost:3000/admin/dashboard
4. Should see admin statistics

### Test 4: Django Admin
1. Go to http://localhost:8000/admin/
2. Login with superuser credentials
3. View/edit users, campaigns, donations

---

## 📂 Project Structure

```
NOSTOS/
├── backend/                    # Django Backend
│   ├── core/                  # Project settings
│   ├── users/                 # Authentication & users
│   ├── campaigns/             # Campaign management
│   ├── donations/             # Donation processing
│   ├── ai_engine/             # AI features (OpenAI, ML)
│   ├── analytics/             # Analytics & reports
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Environment template
│   └── manage.py              # Django management
│
├── nostos/                     # Next.js Frontend
│   ├── app/                   # Pages & routes
│   │   ├── login/            # Login page ✅ Integrated
│   │   ├── register/         # Register page ✅ Integrated
│   │   ├── logout/           # Logout page ✅ Integrated
│   │   ├── campaigns/        # Campaign pages
│   │   ├── donate/           # Donation flow
│   │   ├── alumni/           # Alumni dashboard & features
│   │   ├── admin/            # Admin dashboard & analytics
│   │   └── profile/          # User profile
│   ├── lib/                  # Integration layer ✅
│   │   ├── api.ts           # API client with 40+ endpoints
│   │   ├── types.ts         # TypeScript types
│   │   └── hooks/           # React hooks (useAuth)
│   ├── .env.local           # Environment variables
│   └── package.json         # Node dependencies
│
├── INTEGRATION_GUIDE.md       # Complete integration docs
├── TESTING.md                 # Testing checklist
└── README.md                  # This file
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (comment out to use SQLite)
# DATABASE_URL=postgresql://user:password@localhost:5432/nostos_db

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# OpenAI (optional)
# OPENAI_API_KEY=sk-your-key

# Email (optional)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_HOST_USER=your-email@gmail.com
# EMAIL_HOST_PASSWORD=your-app-password

# Celery (optional)
# CELERY_BROKER_URL=redis://localhost:6379/0
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🌐 Available URLs

### Frontend
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- Campaigns: http://localhost:3000/campaigns
- Alumni Dashboard: http://localhost:3000/alumni/dashboard
- Admin Dashboard: http://localhost:3000/admin/dashboard

### Backend
- API Base: http://localhost:8000/api/
- Swagger Docs: http://localhost:8000/api/docs/
- Django Admin: http://localhost:8000/admin/

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Check Python version
python --version  # Should be 3.10+

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Check database migrations
python manage.py showmigrations

# Reset database (CAUTION: Deletes all data)
python manage.py flush
```

### Frontend won't start
```powershell
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# Clear Next.js cache
Remove-Item -Recurse -Force .next
```

### CORS Errors
- Ensure backend has `CORS_ALLOWED_ORIGINS = ['http://localhost:3000']`
- Restart both servers

### 401 Errors
- Clear browser localStorage
- Login again
- Check token expiry in backend settings

---

## 📚 API Endpoints Reference

### Authentication (`/api/users/`)
- POST `/register/` - Register new user
- POST `/login/` - Login & get JWT tokens
- POST `/logout/` - Logout & blacklist token
- GET/PUT `/profile/` - View/update profile
- POST `/change-password/` - Change password
- POST `/forgot-password/` - Request reset
- POST `/reset-password/` - Reset with token

### Campaigns (`/api/campaigns/`)
- GET `/` - List campaigns (supports filters, search, ordering)
- POST `/` - Create campaign (admin only)
- GET `/{id}/` - Campaign details
- PUT `/{id}/` - Update campaign (admin only)
- DELETE `/{id}/` - Delete campaign (admin only)
- GET `/{id}/updates/` - Campaign updates
- POST `/{id}/updates/` - Add update (admin only)
- GET `/{id}/testimonials/` - Testimonials
- POST `/{id}/testimonials/` - Add testimonial
- GET `/statistics/` - Overall statistics
- GET `/top/` - Top campaigns

### Donations (`/api/donations/`)
- GET `/` - List donations
- POST `/create/` - Make donation
- GET `/{id}/` - Donation details
- GET `/statistics/` - User statistics
- GET `/history-chart/` - Chart data
- GET `/campaign/{id}/leaderboard/` - Top donors
- POST `/{id}/receipt/` - Generate receipt

### AI Engine (`/api/ai/`)
- POST `/generate-thank-you/` - Generate message
- POST `/generate-description/` - Generate description
- POST `/analyze-sentiment/` - Analyze sentiment
- POST `/analyze-feedback/` - Classify feedback
- POST `/analyze-testimonial/` - Analyze quality
- GET `/predict-retention/` - Predict donor retention
- GET `/predict-success/{id}/` - Predict campaign success
- GET `/likely-donors/` - Get likely donors (admin)

### Analytics (`/api/analytics/`)
- GET `/dashboard/` - Dashboard stats
- GET `/donation-trends/` - Donation trends
- GET `/campaign-performance/` - Campaign performance
- GET `/donor-analytics/` - Donor analytics (admin)
- GET `/sentiment-report/` - Sentiment report
- GET `/category-breakdown/` - Category breakdown
- GET `/export-report/` - Export report (admin)

---

## 🎉 You're All Set!

The NOSTOS platform is now fully integrated and ready for development!

**Next Steps:**
1. ✅ Backend is running with 40+ API endpoints
2. ✅ Frontend is integrated with authentication
3. ✅ Sample data created
4. 🔄 Update remaining pages to use API
5. 🔄 Add payment integration
6. 🔄 Implement real-time features
7. 🔄 Deploy to production

---

**Need Help?**
- Check `INTEGRATION_GUIDE.md` for detailed integration docs
- Check `TESTING.md` for testing checklist
- Check backend `DOCUMENTATION.md` for API details
- Open browser DevTools to inspect network requests
- Check Django logs in terminal
- View Swagger docs at http://localhost:8000/api/docs/

**Happy Coding! 🚀**
