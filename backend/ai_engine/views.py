"""
Views for AI Engine API.
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .ai_message import (
    generate_thank_you_message,
    generate_campaign_description,
    suggest_campaign_improvements
)
from .sentiment import (
    analyze_sentiment,
    classify_feedback,
    analyze_testimonial_quality
)
from .predictions import (
    donor_retention_predictor,
    campaign_success_predictor
)

from donations.models import Donation
from campaigns.models import Campaign
from django.db.models import Sum, Count, Avg
from datetime import datetime, timedelta
from django.utils import timezone


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_thank_you(request):
    """Generate personalized thank you message."""
    
    donor_name = request.data.get('donor_name')
    campaign_title = request.data.get('campaign_title')
    amount = request.data.get('amount')
    tone = request.data.get('tone', 'formal')
    
    if not all([donor_name, campaign_title, amount]):
        return Response({
            'error': 'Missing required fields: donor_name, campaign_title, amount'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    message = generate_thank_you_message(donor_name, campaign_title, amount, tone)
    
    return Response({
        'message': message,
        'tone': tone
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_description(request):
    """Generate campaign description."""
    
    if request.user.role != 'admin':
        return Response({
            'error': 'Only admins can generate campaign descriptions'
        }, status=status.HTTP_403_FORBIDDEN)
    
    title = request.data.get('title')
    category = request.data.get('category')
    goal = request.data.get('goal')
    brief = request.data.get('brief_description')
    
    if not all([title, category, goal, brief]):
        return Response({
            'error': 'Missing required fields'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    description = generate_campaign_description(title, category, goal, brief)
    
    return Response({
        'description': description
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def analyze_text_sentiment(request):
    """Analyze sentiment of text."""
    
    text = request.data.get('text')
    
    if not text:
        return Response({
            'error': 'Text is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    result = analyze_sentiment(text)
    
    return Response(result)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def analyze_feedback(request):
    """Classify and analyze feedback."""
    
    feedback = request.data.get('feedback')
    
    if not feedback:
        return Response({
            'error': 'Feedback text is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    result = classify_feedback(feedback)
    
    return Response(result)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def analyze_testimonial(request):
    """Analyze testimonial quality."""
    
    testimonial = request.data.get('testimonial')
    
    if not testimonial:
        return Response({
            'error': 'Testimonial text is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    result = analyze_testimonial_quality(testimonial)
    
    return Response(result)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def predict_donor_retention(request):
    """Predict donor retention probability."""
    
    user = request.user
    
    # Get donor statistics
    donations = Donation.objects.filter(donor=user, status='completed')
    
    if not donations.exists():
        return Response({
            'retention_probability': 0.5,
            'message': 'Not enough data for accurate prediction',
            'recommendation': 'Make your first donation to start building your impact profile!'
        })
    
    total_donations = donations.count()
    total_amount = donations.aggregate(total=Sum('amount'))['total'] or 0
    avg_donation = total_amount / total_donations if total_donations > 0 else 0
    
    last_donation = donations.order_by('-completed_at').first()
    days_since_last = (timezone.now() - last_donation.completed_at).days if last_donation else 365
    
    campaigns_supported = donations.values('campaign').distinct().count()
    account_age = (timezone.now() - user.created_at).days
    
    donor_data = {
        'total_donations': total_donations,
        'total_amount': float(total_amount),
        'avg_donation': float(avg_donation),
        'days_since_last_donation': days_since_last,
        'campaigns_supported': campaigns_supported,
        'account_age_days': account_age,
        'has_profile_picture': bool(user.profile_picture),
        'bio': user.bio or ''
    }
    
    probability = donor_retention_predictor.predict(donor_data)
    
    # Generate recommendation
    if probability > 0.7:
        recommendation = "You're an amazing supporter! Keep up the great work."
    elif probability > 0.5:
        recommendation = "Consider supporting more campaigns to increase your impact."
    else:
        recommendation = "We'd love to see you back! Explore our active campaigns."
    
    return Response({
        'retention_probability': probability,
        'statistics': donor_data,
        'recommendation': recommendation
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def predict_campaign_success(request, campaign_id):
    """Predict campaign success probability."""
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return Response({
            'error': 'Campaign not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate campaign statistics
    days_remaining = (campaign.deadline - timezone.now().date()).days
    donor_count = campaign.donations.filter(status='completed').count()
    update_count = campaign.updates.count()
    testimonial_count = campaign.testimonials.filter(is_approved=True).count()
    
    campaign_data = {
        'goal': float(campaign.goal),
        'raised': float(campaign.raised),
        'donor_count': donor_count,
        'days_remaining': days_remaining,
        'update_count': update_count,
        'testimonial_count': testimonial_count,
        'description': campaign.description,
        'has_image': bool(campaign.image)
    }
    
    probability = campaign_success_predictor.predict(campaign_data)
    
    # Generate suggestions
    suggestions = suggest_campaign_improvements({
        'title': campaign.title,
        'goal': float(campaign.goal),
        'raised': float(campaign.raised),
        'progress': campaign.progress_percentage,
        'donor_count': donor_count,
        'days_remaining': days_remaining
    })
    
    return Response({
        'campaign_id': campaign_id,
        'success_probability': probability,
        'current_progress': campaign.progress_percentage,
        'days_remaining': days_remaining,
        'suggestions': suggestions
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_likely_donors(request):
    """Get list of donors likely to donate again."""
    
    if request.user.role != 'admin':
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get all donors with their statistics
    from users.models import User
    
    donors = User.objects.filter(role='alumni', donations__isnull=False).distinct()
    
    likely_donors = []
    
    for donor in donors:
        donations = Donation.objects.filter(donor=donor, status='completed')
        
        if not donations.exists():
            continue
        
        total_donations = donations.count()
        total_amount = donations.aggregate(total=Sum('amount'))['total'] or 0
        avg_donation = total_amount / total_donations if total_donations > 0 else 0
        
        last_donation = donations.order_by('-completed_at').first()
        days_since_last = (timezone.now() - last_donation.completed_at).days if last_donation else 365
        
        campaigns_supported = donations.values('campaign').distinct().count()
        account_age = (timezone.now() - donor.created_at).days
        
        donor_data = {
            'total_donations': total_donations,
            'total_amount': float(total_amount),
            'avg_donation': float(avg_donation),
            'days_since_last_donation': days_since_last,
            'campaigns_supported': campaigns_supported,
            'account_age_days': account_age,
            'has_profile_picture': bool(donor.profile_picture),
            'bio': donor.bio or ''
        }
        
        probability = donor_retention_predictor.predict(donor_data)
        
        if probability > 0.5:  # Only include likely donors
            likely_donors.append({
                'donor_id': donor.id,
                'donor_name': donor.name,
                'donor_email': donor.email,
                'retention_probability': probability,
                'total_donations': total_donations,
                'total_amount': float(total_amount),
                'days_since_last_donation': days_since_last
            })
    
    # Sort by probability
    likely_donors.sort(key=lambda x: x['retention_probability'], reverse=True)
    
    return Response({
        'count': len(likely_donors),
        'donors': likely_donors[:50]  # Limit to top 50
    })
