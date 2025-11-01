"""
URL configuration for AI Engine API.
"""
from django.urls import path
from .views import (
    generate_thank_you,
    generate_description,
    analyze_text_sentiment,
    analyze_feedback,
    analyze_testimonial,
    predict_donor_retention,
    predict_campaign_success,
    get_likely_donors
)

app_name = 'ai_engine'

urlpatterns = [
    # AI Message Generation
    path('generate-thank-you/', generate_thank_you, name='generate-thank-you'),
    path('generate-description/', generate_description, name='generate-description'),
    
    # Sentiment Analysis
    path('analyze-sentiment/', analyze_text_sentiment, name='analyze-sentiment'),
    path('analyze-feedback/', analyze_feedback, name='analyze-feedback'),
    path('analyze-testimonial/', analyze_testimonial, name='analyze-testimonial'),
    
    # ML Predictions
    path('predict-retention/', predict_donor_retention, name='predict-retention'),
    path('predict-success/<int:campaign_id>/', predict_campaign_success, name='predict-success'),
    path('likely-donors/', get_likely_donors, name='likely-donors'),
]
