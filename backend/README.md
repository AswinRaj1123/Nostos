# NOSTOS Backend - Setup Instructions

## Prerequisites

- Python 3.10 or higher
- PostgreSQL 14 or higher
- pip (Python package manager)
- Virtual environment tool (venv or virtualenv)

## Installation Steps

### 1. Create Virtual Environment

```bash
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix/MacOS:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Download NLTK Data

```bash
python -m nltk.downloader vader_lexicon punkt stopwords
```

### 4. Set Up PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE nostos_db;
CREATE USER nostos_user WITH PASSWORD 'your_secure_password';
ALTER ROLE nostos_user SET client_encoding TO 'utf8';
ALTER ROLE nostos_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE nostos_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE nostos_db TO nostos_user;
```

### 5. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Django secret key (generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- `OPENAI_API_KEY`: Your OpenAI API key
- `EMAIL_*`: Email configuration for sending receipts
- `RAZORPAY_*`: Payment gateway credentials

### 6. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
```

### 8. Start Redis (for Celery)

```bash
# On Windows with Redis installed:
redis-server

# On Unix/MacOS:
redis-server
```

### 9. Start Celery Worker (in separate terminal)

```bash
# Activate virtual environment first
celery -A core worker -l info
```

### 10. Run Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000/api/`

## API Documentation

Once the server is running, access:

- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/
- **Django Admin**: http://localhost:8000/admin/

## API Endpoints Overview

### Users & Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login
- `POST /api/users/logout/` - Logout
- `GET/PUT /api/users/profile/` - View/update profile
- `POST /api/users/change-password/` - Change password
- `POST /api/users/forgot-password/` - Request password reset
- `POST /api/users/reset-password/` - Reset password
- `GET /api/users/list/` - List users (admin)

### Campaigns
- `GET /api/campaigns/` - List campaigns (with filters, search, ordering)
- `POST /api/campaigns/` - Create campaign (admin only)
- `GET /api/campaigns/{id}/` - Campaign details
- `PUT /api/campaigns/{id}/` - Update campaign (admin only)
- `DELETE /api/campaigns/{id}/` - Delete campaign (admin only)
- `GET /api/campaigns/{id}/updates/` - Campaign updates
- `POST /api/campaigns/{id}/updates/` - Add update (admin only)
- `GET /api/campaigns/{id}/testimonials/` - Campaign testimonials
- `POST /api/campaigns/{id}/testimonials/` - Add testimonial
- `GET /api/campaigns/statistics/` - Overall statistics
- `GET /api/campaigns/top/` - Top campaigns

### Donations
- `GET /api/donations/` - List donations
- `POST /api/donations/create/` - Make donation
- `GET /api/donations/{id}/` - Donation details
- `GET /api/donations/statistics/` - Donation statistics
- `GET /api/donations/history-chart/` - Donation history for charts
- `GET /api/donations/campaign/{id}/leaderboard/` - Campaign leaderboard
- `POST /api/donations/{id}/receipt/` - Generate receipt

### AI Engine
- `POST /api/ai/generate-thank-you/` - Generate thank you message
- `POST /api/ai/generate-description/` - Generate campaign description
- `POST /api/ai/analyze-sentiment/` - Analyze text sentiment
- `POST /api/ai/analyze-feedback/` - Classify feedback
- `POST /api/ai/analyze-testimonial/` - Analyze testimonial quality
- `GET /api/ai/predict-retention/` - Predict donor retention
- `GET /api/ai/predict-success/{id}/` - Predict campaign success
- `GET /api/ai/likely-donors/` - Get likely donors (admin)

### Analytics
- `GET /api/analytics/dashboard/` - Dashboard statistics
- `GET /api/analytics/donation-trends/` - Donation trends over time
- `GET /api/analytics/campaign-performance/` - Campaign performance
- `GET /api/analytics/donor-analytics/` - Donor behavior analytics (admin)
- `GET /api/analytics/sentiment-report/` - Sentiment analysis report
- `GET /api/analytics/category-breakdown/` - Category breakdown
- `GET /api/analytics/export-report/` - Export report (admin)

## Testing

Run tests:

```bash
python manage.py test
```

## Production Deployment

For production:

1. Set `DEBUG=False` in `.env`
2. Update `ALLOWED_HOSTS` with your domain
3. Configure proper PostgreSQL server
4. Set up Redis server
5. Use production WSGI server (gunicorn):
   ```bash
   pip install gunicorn
   gunicorn core.wsgi:application --bind 0.0.0.0:8000
   ```
6. Set up Nginx as reverse proxy
7. Configure SSL certificate
8. Set up Celery as system service
9. Configure proper email backend
10. Set up static/media file serving

## Development Tips

- Use Swagger UI at `/api/docs/` to test endpoints interactively
- Check Django admin at `/admin/` for data management
- Monitor Celery worker output for background task logs
- Use `python manage.py shell` for interactive testing
- Run `python manage.py check` to verify configuration

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database and user exist

### Import Errors
- Make sure virtual environment is activated
- Reinstall requirements: `pip install -r requirements.txt`

### NLTK Data Not Found
- Run: `python -m nltk.downloader vader_lexicon punkt stopwords`

### Celery Not Working
- Ensure Redis is running
- Check `CELERY_BROKER_URL` in `.env`
- Restart Celery worker

## License

See LICENSE file
