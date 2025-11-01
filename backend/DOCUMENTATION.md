# NOSTOS Alumni Platform - Complete Backend Documentation

## 📋 Project Overview

The NOSTOS Alumni Platform backend is a comprehensive Django REST API that powers a modern alumni engagement and fundraising platform. Built with Django 5.0, Django REST Framework, PostgreSQL, and integrated AI capabilities.

## 🏗️ Architecture

```
backend/
├── core/                    # Django project settings
│   ├── settings.py         # Main configuration
│   ├── urls.py             # URL routing
│   ├── celery.py           # Background tasks
│   ├── wsgi.py             # Production WSGI
│   └── asgi.py             # ASGI support
│
├── users/                   # User authentication & profiles
│   ├── models.py           # Custom User model, PasswordResetToken
│   ├── serializers.py      # 6 serializers (Register, Login, Profile, etc.)
│   ├── views.py            # 8 API endpoints
│   ├── urls.py             # User routes
│   └── admin.py            # Admin customization
│
├── campaigns/               # Campaign management
│   ├── models.py           # Campaign, CampaignUpdate, CampaignTestimonial
│   ├── serializers.py      # 4 serializers
│   ├── views.py            # 6 API endpoints + custom permissions
│   ├── urls.py             # Campaign routes
│   └── admin.py            # Admin with filters & actions
│
├── donations/               # Donation processing
│   ├── models.py           # Donation, DonationReceipt
│   ├── serializers.py      # 3 serializers
│   ├── views.py            # 7 API endpoints
│   ├── urls.py             # Donation routes
│   └── admin.py            # Donation admin
│
├── ai_engine/               # AI & ML features
│   ├── ai_message.py       # OpenAI integration (GPT-3.5)
│   ├── sentiment.py        # VADER + TextBlob sentiment analysis
│   ├── predictions.py      # ML predictions (donor retention, campaign success)
│   ├── views.py            # 8 AI endpoints
│   └── urls.py             # AI routes
│
├── analytics/               # Analytics & reporting
│   ├── views.py            # 7 analytics endpoints
│   └── urls.py             # Analytics routes
│
├── requirements.txt         # Python dependencies (30+ packages)
├── .env.example            # Environment variables template
├── manage.py               # Django management script
├── README.md               # Setup instructions
└── .gitignore              # Git ignore rules

```

## 🔧 Technology Stack

### Core Framework
- **Django 5.0.1**: Web framework
- **Django REST Framework 3.14.0**: REST API toolkit
- **PostgreSQL**: Primary database (via psycopg2-binary)

### Authentication
- **djangorestframework-simplejwt 5.3.1**: JWT authentication
  - 60-minute access tokens
  - 1440-minute refresh tokens
  - Token rotation & blacklisting

### AI & Machine Learning
- **OpenAI 1.10.0**: GPT-3.5 for message generation
- **scikit-learn 1.4.0**: ML predictions (Random Forest)
- **NLTK 3.8.1**: Natural language processing
- **transformers 4.36.2**: Hugging Face models
- **torch 2.1.2**: PyTorch for deep learning
- **vaderSentiment 3.3.2**: Social media sentiment analysis
- **textblob 0.17.1**: Text processing & sentiment

### Background Tasks
- **Celery 5.3.6**: Async task queue
- **Redis 5.0.1**: Message broker for Celery

### Utilities
- **django-cors-headers**: CORS support for Next.js frontend
- **django-filter 23.5**: Advanced filtering
- **drf-spectacular 0.27.0**: OpenAPI/Swagger documentation
- **python-decouple 3.8**: Environment variable management
- **Pillow 10.2.0**: Image processing

## 📊 Database Schema

### Users App
```python
User (Custom AbstractBaseUser):
  - id: AutoField (PK)
  - email: EmailField (unique)
  - name: CharField
  - phone: CharField
  - role: CharField (choices: alumni, admin)
  - department: CharField
  - graduation_year: IntegerField
  - current_company: CharField
  - current_position: CharField
  - location: CharField
  - linkedin: URLField
  - bio: TextField
  - profile_picture: ImageField
  - is_active: BooleanField
  - created_at: DateTimeField
  - updated_at: DateTimeField

PasswordResetToken:
  - id: AutoField (PK)
  - user: ForeignKey(User)
  - token: CharField (unique)
  - expires_at: DateTimeField
  - is_used: BooleanField
  - created_at: DateTimeField
```

### Campaigns App
```python
Campaign:
  - id: AutoField (PK)
  - title: CharField
  - description: TextField
  - category: CharField (8 choices: education, healthcare, etc.)
  - goal: DecimalField
  - raised: DecimalField
  - deadline: DateField
  - status: CharField (draft, active, completed)
  - image: ImageField
  - created_by: ForeignKey(User)
  - created_at: DateTimeField
  - updated_at: DateTimeField
  
  @property progress_percentage
  @property is_active
  @property donor_count

CampaignUpdate:
  - id: AutoField (PK)
  - campaign: ForeignKey(Campaign)
  - title: CharField
  - message: TextField
  - created_by: ForeignKey(User)
  - created_at: DateTimeField

CampaignTestimonial:
  - id: AutoField (PK)
  - campaign: ForeignKey(Campaign)
  - donor: ForeignKey(User)
  - message: TextField
  - rating: IntegerField (1-5)
  - is_approved: BooleanField
  - created_at: DateTimeField
  
  unique_together: (campaign, donor)
```

### Donations App
```python
Donation:
  - id: AutoField (PK)
  - transaction_id: CharField (unique, UUID)
  - donor: ForeignKey(User)
  - campaign: ForeignKey(Campaign)
  - amount: DecimalField
  - payment_method: CharField (upi, card, netbanking, wallet)
  - status: CharField (pending, completed, failed, refunded)
  - payment_gateway_id: CharField
  - payment_gateway_response: JSONField
  - message: TextField
  - is_anonymous: BooleanField
  - receipt_number: CharField (unique)
  - receipt_sent: BooleanField
  - created_at: DateTimeField
  - completed_at: DateTimeField

DonationReceipt:
  - id: AutoField (PK)
  - donation: OneToOneField(Donation)
  - receipt_file: FileField
  - generated_at: DateTimeField
```

## 🔌 API Endpoints

### Authentication & Users (`/api/users/`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| POST | `/register/` | Register new user | Public |
| POST | `/login/` | Login & get JWT tokens | Public |
| POST | `/logout/` | Logout & blacklist token | Authenticated |
| GET/PUT | `/profile/` | View/update profile | Authenticated |
| POST | `/change-password/` | Change password | Authenticated |
| POST | `/forgot-password/` | Request password reset | Public |
| POST | `/reset-password/` | Reset password with token | Public |
| GET | `/list/` | List all users | Admin |

### Campaigns (`/api/campaigns/`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/` | List campaigns | Public |
| POST | `/` | Create campaign | Admin |
| GET | `/{id}/` | Campaign details | Public |
| PUT | `/{id}/` | Update campaign | Admin |
| DELETE | `/{id}/` | Delete campaign | Admin |
| GET | `/{id}/updates/` | List updates | Public |
| POST | `/{id}/updates/` | Add update | Admin |
| GET | `/{id}/testimonials/` | List testimonials | Public |
| POST | `/{id}/testimonials/` | Add testimonial | Authenticated |
| GET | `/statistics/` | Overall statistics | Public |
| GET | `/top/` | Top campaigns | Public |

**Features:**
- Filtering: `?status=active&category=education`
- Search: `?search=scholarship`
- Ordering: `?ordering=-raised`
- Pagination: 20 items per page

### Donations (`/api/donations/`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/` | List donations | Authenticated |
| POST | `/create/` | Make donation | Authenticated |
| GET | `/{id}/` | Donation details | Authenticated |
| GET | `/statistics/` | Donation statistics | Authenticated |
| GET | `/history-chart/` | Chart data | Authenticated |
| GET | `/campaign/{id}/leaderboard/` | Top donors | Public |
| POST | `/{id}/receipt/` | Generate receipt | Authenticated |

### AI Engine (`/api/ai/`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| POST | `/generate-thank-you/` | Generate thank you message | Authenticated |
| POST | `/generate-description/` | Generate campaign description | Admin |
| POST | `/analyze-sentiment/` | Analyze text sentiment | Authenticated |
| POST | `/analyze-feedback/` | Classify feedback | Authenticated |
| POST | `/analyze-testimonial/` | Analyze testimonial quality | Authenticated |
| GET | `/predict-retention/` | Predict donor retention | Authenticated |
| GET | `/predict-success/{id}/` | Predict campaign success | Authenticated |
| GET | `/likely-donors/` | Get likely donors | Admin |

### Analytics (`/api/analytics/`)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/dashboard/` | Dashboard statistics | Authenticated |
| GET | `/donation-trends/` | Donation trends | Authenticated |
| GET | `/campaign-performance/` | Campaign performance | Authenticated |
| GET | `/donor-analytics/` | Donor analytics | Admin |
| GET | `/sentiment-report/` | Sentiment analysis | Authenticated |
| GET | `/category-breakdown/` | Category breakdown | Authenticated |
| GET | `/export-report/` | Export full report | Admin |

## 🤖 AI Features

### 1. Message Generation (OpenAI GPT-3.5)
- **Thank You Messages**: Personalized donor appreciation
- **Campaign Descriptions**: AI-generated compelling content
- **Improvement Suggestions**: Campaign optimization advice

### 2. Sentiment Analysis
- **VADER**: Social media sentiment (compound score)
- **TextBlob**: Polarity & subjectivity analysis
- **Feedback Classification**: Auto-categorize by keywords
- **Testimonial Quality**: Score quality (0-100)

### 3. Machine Learning Predictions
- **Donor Retention**: Random Forest classifier
  - Features: donation count, amount, recency, engagement
  - Output: Probability (0-1) of donor returning
  
- **Campaign Success**: Random Forest regressor
  - Features: goal, raised, donors, days remaining, engagement
  - Output: Success probability (0-1)
  
- **Heuristic Fallback**: Rule-based predictions when ML not trained

## 🔐 Security Features

- JWT authentication with token rotation
- Password hashing with Django's PBKDF2
- CORS configured for localhost:3000 (Next.js)
- Role-based access control (alumni vs admin)
- Custom permissions (IsAdminOrReadOnly)
- Password reset with secure tokens (32 chars, 24hr expiry)
- Input validation with DRF serializers
- SQL injection protection via Django ORM
- XSS protection with Django templates

## 🚀 Performance Optimizations

- Database indexing on frequently queried fields
- Pagination (20 items/page) for all list endpoints
- Database connection pooling (600s max age)
- Celery for async tasks (emails, reports)
- Redis caching for message broker
- Select/prefetch related for query optimization
- Aggregation at database level (Sum, Count, Avg)

## 📝 Admin Interface

Customized Django admin for each app:

### Users Admin
- Fieldsets: Personal Info, Contact, Professional, Permissions
- List filters: role, is_active, graduation_year
- Search: name, email, department

### Campaigns Admin
- Fieldsets: Basic Info, Financial, Status, Metadata
- List filters: status, category, created_at
- Search: title, description
- Actions: Activate, Complete, Mark as Draft

### Donations Admin
- Fieldsets: Donation Info, Payment, Additional Info
- List filters: status, payment_method, created_at
- Search: transaction_id, donor name, campaign title
- Date hierarchy: created_at

## 🧪 Testing Approach

Recommended test coverage:

1. **Unit Tests**:
   - Model methods (progress_percentage, is_active)
   - Serializer validation (password confirmation, amount > 0)
   - Permission classes (IsAdminOrReadOnly)
   - AI functions with mocked APIs

2. **Integration Tests**:
   - API endpoint responses
   - Authentication flows (register, login, logout)
   - CRUD operations with permissions
   - Filter/search/ordering functionality

3. **End-to-End Tests**:
   - Complete donation flow
   - Campaign creation to completion
   - Password reset flow
   - AI message generation with mocked OpenAI

## 🔄 Celery Tasks (Future)

Potential async tasks:

```python
# Send email receipts
@shared_task
def send_donation_receipt(donation_id):
    pass

# Generate AI predictions batch
@shared_task
def update_donor_retention_scores():
    pass

# Send campaign reminders
@shared_task
def send_campaign_deadline_reminders():
    pass

# Generate monthly reports
@shared_task
def generate_monthly_analytics_report():
    pass
```

## 📦 Environment Variables

Required in `.env`:

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nostos_db

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# OpenAI
OPENAI_API_KEY=sk-...

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## 🌐 CORS Configuration

Frontend allowed origins:
- `http://localhost:3000` (Next.js dev)
- Add production domain when deploying

Allowed methods: GET, POST, PUT, DELETE, OPTIONS

## 📖 API Documentation

Interactive documentation at:
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

Features:
- Try-it-out functionality
- Schema validation
- Authentication support
- Response examples

## 🎯 Next Steps

1. **Database Setup**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

2. **NLTK Data**:
   ```bash
   python -m nltk.downloader vader_lexicon punkt stopwords
   ```

3. **Start Services**:
   ```bash
   # Terminal 1: Redis
   redis-server
   
   # Terminal 2: Celery
   celery -A core worker -l info
   
   # Terminal 3: Django
   python manage.py runserver
   ```

4. **Test Endpoints**:
   - Register user via `/api/users/register/`
   - Login via `/api/users/login/`
   - Create campaign (admin) via `/api/campaigns/`
   - Make donation via `/api/donations/create/`
   - Generate AI message via `/api/ai/generate-thank-you/`
   - View analytics via `/api/analytics/dashboard/`

## 🔗 Frontend Integration

The backend is designed to integrate seamlessly with the Next.js frontend at `http://localhost:3000`:

- **Authentication**: JWT tokens stored in localStorage/cookies
- **API Calls**: Axios/Fetch with bearer token in headers
- **Real-time Updates**: Polling or WebSocket integration possible
- **File Uploads**: Multipart form data for images
- **Pagination**: Meta info in responses for "Load More"

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [OpenAI API](https://platform.openai.com/docs/)
- [Scikit-learn](https://scikit-learn.org/)
- [NLTK](https://www.nltk.org/)
- [Celery](https://docs.celeryproject.org/)

---

**Built with ❤️ for NOSTOS Alumni Network**
