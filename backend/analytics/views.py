"""
Views for Analytics API.
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Sum, Count, Avg, Q
from django.db.models.functions import TruncMonth, TruncWeek, TruncDay
from django.utils import timezone
from datetime import timedelta

from users.models import User
from campaigns.models import Campaign, CampaignTestimonial
from donations.models import Donation


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_statistics(request):
    """Get overall dashboard statistics."""
    
    user = request.user
    
    # Admin sees all data, alumni see their own
    if user.role == 'admin':
        donations = Donation.objects.filter(status='completed')
        campaigns = Campaign.objects.all()
        alumni = User.objects.filter(role='alumni')
    else:
        donations = Donation.objects.filter(donor=user, status='completed')
        campaigns = Campaign.objects.filter(created_by=user)
        alumni = User.objects.filter(id=user.id)
    
    # Calculate statistics
    total_donations = donations.aggregate(
        total_amount=Sum('amount'),
        count=Count('id')
    )
    
    campaign_stats = campaigns.aggregate(
        total_campaigns=Count('id'),
        active_campaigns=Count('id', filter=Q(status='active')),
        completed_campaigns=Count('id', filter=Q(status='completed')),
        total_goal=Sum('goal'),
        total_raised=Sum('raised')
    )
    
    # Recent activity (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_donations = donations.filter(completed_at__gte=thirty_days_ago)
    recent_amount = recent_donations.aggregate(total=Sum('amount'))['total'] or 0
    recent_count = recent_donations.count()
    
    # Top campaign
    top_campaign = campaigns.filter(status__in=['active', 'completed']).order_by('-raised').first()
    
    return Response({
        'donations': {
            'total_amount': float(total_donations['total_amount'] or 0),
            'total_count': total_donations['count'],
            'recent_amount': float(recent_amount),
            'recent_count': recent_count,
        },
        'campaigns': {
            'total': campaign_stats['total_campaigns'],
            'active': campaign_stats['active_campaigns'],
            'completed': campaign_stats['completed_campaigns'],
            'total_goal': float(campaign_stats['total_goal'] or 0),
            'total_raised': float(campaign_stats['total_raised'] or 0),
        },
        'alumni': {
            'total_count': alumni.count(),
            'active_donors': donations.values('donor').distinct().count()
        },
        'top_campaign': {
            'id': top_campaign.id,
            'title': top_campaign.title,
            'raised': float(top_campaign.raised)
        } if top_campaign else None
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def donation_trends(request):
    """Get donation trends over time."""
    
    user = request.user
    period = request.GET.get('period', 'month')  # day, week, month
    months = int(request.GET.get('months', 12))
    
    # Calculate date range
    end_date = timezone.now()
    start_date = end_date - timedelta(days=30 * months)
    
    # Get donations
    if user.role == 'admin':
        donations = Donation.objects.filter(
            status='completed',
            completed_at__gte=start_date,
            completed_at__lte=end_date
        )
    else:
        donations = Donation.objects.filter(
            donor=user,
            status='completed',
            completed_at__gte=start_date,
            completed_at__lte=end_date
        )
    
    # Group by period
    if period == 'day':
        trunc_func = TruncDay('completed_at')
    elif period == 'week':
        trunc_func = TruncWeek('completed_at')
    else:
        trunc_func = TruncMonth('completed_at')
    
    trends = donations.annotate(
        period=trunc_func
    ).values('period').annotate(
        total_amount=Sum('amount'),
        donation_count=Count('id'),
        avg_amount=Avg('amount')
    ).order_by('period')
    
    # Format response
    trend_data = []
    for item in trends:
        trend_data.append({
            'period': item['period'].isoformat(),
            'total_amount': float(item['total_amount']),
            'donation_count': item['donation_count'],
            'avg_amount': float(item['avg_amount'])
        })
    
    return Response({
        'period': period,
        'data': trend_data
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def campaign_performance(request):
    """Get campaign performance metrics."""
    
    user = request.user
    
    if user.role == 'admin':
        campaigns = Campaign.objects.all()
    else:
        campaigns = Campaign.objects.filter(created_by=user)
    
    # Calculate performance metrics for each campaign
    performance_data = []
    
    for campaign in campaigns:
        donations = Donation.objects.filter(campaign=campaign, status='completed')
        
        total_donated = donations.aggregate(total=Sum('amount'))['total'] or 0
        donor_count = donations.values('donor').distinct().count()
        avg_donation = donations.aggregate(avg=Avg('amount'))['avg'] or 0
        
        days_active = (timezone.now().date() - campaign.created_at.date()).days
        daily_rate = float(total_donated) / max(days_active, 1)
        
        performance_data.append({
            'campaign_id': campaign.id,
            'title': campaign.title,
            'category': campaign.category,
            'status': campaign.status,
            'goal': float(campaign.goal),
            'raised': float(total_donated),
            'progress_percentage': campaign.progress_percentage,
            'donor_count': donor_count,
            'avg_donation': float(avg_donation),
            'days_active': days_active,
            'daily_donation_rate': daily_rate,
            'update_count': campaign.updates.count(),
            'testimonial_count': campaign.testimonials.filter(is_approved=True).count()
        })
    
    # Sort by performance
    performance_data.sort(key=lambda x: x['progress_percentage'], reverse=True)
    
    return Response(performance_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def donor_analytics(request):
    """Get donor behavior analytics."""
    
    if request.user.role != 'admin':
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get all donors
    donors = User.objects.filter(role='alumni')
    
    # Donor segments
    active_donors = set()
    regular_donors = set()
    high_value_donors = set()
    
    donor_data = []
    
    for donor in donors:
        donations = Donation.objects.filter(donor=donor, status='completed')
        
        if not donations.exists():
            continue
        
        total_donated = donations.aggregate(total=Sum('amount'))['total'] or 0
        donation_count = donations.count()
        avg_donation = total_donated / donation_count if donation_count > 0 else 0
        
        last_donation = donations.order_by('-completed_at').first()
        days_since_last = (timezone.now() - last_donation.completed_at).days if last_donation else 365
        
        campaigns_supported = donations.values('campaign').distinct().count()
        
        # Categorize donors
        if days_since_last < 90:
            active_donors.add(donor.id)
        
        if donation_count >= 3:
            regular_donors.add(donor.id)
        
        if total_donated > 10000:
            high_value_donors.add(donor.id)
        
        donor_data.append({
            'donor_id': donor.id,
            'donor_name': donor.name,
            'total_donated': float(total_donated),
            'donation_count': donation_count,
            'avg_donation': float(avg_donation),
            'campaigns_supported': campaigns_supported,
            'days_since_last_donation': days_since_last,
            'is_active': days_since_last < 90,
            'is_regular': donation_count >= 3,
            'is_high_value': total_donated > 10000
        })
    
    # Sort by total donated
    donor_data.sort(key=lambda x: x['total_donated'], reverse=True)
    
    return Response({
        'total_donors': len(donor_data),
        'active_donors': len(active_donors),
        'regular_donors': len(regular_donors),
        'high_value_donors': len(high_value_donors),
        'top_donors': donor_data[:20],  # Top 20 donors
        'all_donors': donor_data
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def sentiment_analysis_report(request):
    """Get sentiment analysis report for testimonials."""
    
    user = request.user
    
    if user.role == 'admin':
        testimonials = CampaignTestimonial.objects.filter(is_approved=True)
    else:
        # Get testimonials for user's campaigns
        user_campaigns = Campaign.objects.filter(created_by=user)
        testimonials = CampaignTestimonial.objects.filter(
            campaign__in=user_campaigns,
            is_approved=True
        )
    
    # Analyze sentiment (using simple keyword-based approach)
    positive_count = 0
    neutral_count = 0
    negative_count = 0
    
    positive_keywords = ['great', 'excellent', 'amazing', 'wonderful', 'thank', 'grateful', 'love', 'best']
    negative_keywords = ['bad', 'poor', 'disappointing', 'waste', 'unfortunate', 'issue', 'problem']
    
    testimonial_data = []
    
    for testimonial in testimonials:
        message_lower = testimonial.message.lower()
        
        positive_score = sum(1 for word in positive_keywords if word in message_lower)
        negative_score = sum(1 for word in negative_keywords if word in message_lower)
        
        if positive_score > negative_score:
            sentiment = 'positive'
            positive_count += 1
        elif negative_score > positive_score:
            sentiment = 'negative'
            negative_count += 1
        else:
            sentiment = 'neutral'
            neutral_count += 1
        
        testimonial_data.append({
            'campaign_id': testimonial.campaign.id,
            'campaign_title': testimonial.campaign.title,
            'donor_name': testimonial.donor.name,
            'rating': testimonial.rating,
            'sentiment': sentiment,
            'message_length': len(testimonial.message),
            'created_at': testimonial.created_at.isoformat()
        })
    
    total = len(testimonial_data)
    
    return Response({
        'total_testimonials': total,
        'sentiment_distribution': {
            'positive': positive_count,
            'neutral': neutral_count,
            'negative': negative_count,
            'positive_percentage': (positive_count / total * 100) if total > 0 else 0,
            'neutral_percentage': (neutral_count / total * 100) if total > 0 else 0,
            'negative_percentage': (negative_count / total * 100) if total > 0 else 0,
        },
        'testimonials': testimonial_data
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def category_breakdown(request):
    """Get breakdown of campaigns and donations by category."""
    
    user = request.user
    
    if user.role == 'admin':
        campaigns = Campaign.objects.all()
    else:
        campaigns = Campaign.objects.filter(created_by=user)
    
    # Group by category
    category_data = campaigns.values('category').annotate(
        campaign_count=Count('id'),
        total_goal=Sum('goal'),
        total_raised=Sum('raised'),
        avg_progress=Avg('raised') * 100 / Avg('goal')
    ).order_by('-total_raised')
    
    # Get donation count per category
    result = []
    for item in category_data:
        category = item['category']
        category_campaigns = campaigns.filter(category=category)
        
        donation_count = Donation.objects.filter(
            campaign__in=category_campaigns,
            status='completed'
        ).count()
        
        result.append({
            'category': category,
            'campaign_count': item['campaign_count'],
            'total_goal': float(item['total_goal'] or 0),
            'total_raised': float(item['total_raised'] or 0),
            'donation_count': donation_count,
            'avg_progress': float(item['avg_progress'] or 0)
        })
    
    return Response(result)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_report(request):
    """Export comprehensive analytics report."""
    
    if request.user.role != 'admin':
        return Response({
            'error': 'Admin access required'
        }, status=status.HTTP_403_FORBIDDEN)
    
    report_type = request.GET.get('type', 'summary')
    
    # Generate comprehensive report
    total_donations = Donation.objects.filter(status='completed')
    total_campaigns = Campaign.objects.all()
    total_alumni = User.objects.filter(role='alumni')
    
    report = {
        'generated_at': timezone.now().isoformat(),
        'report_type': report_type,
        'summary': {
            'total_donations_amount': float(total_donations.aggregate(total=Sum('amount'))['total'] or 0),
            'total_donation_count': total_donations.count(),
            'total_campaigns': total_campaigns.count(),
            'active_campaigns': total_campaigns.filter(status='active').count(),
            'total_alumni': total_alumni.count(),
            'active_donors': total_donations.values('donor').distinct().count()
        },
        'top_campaigns': [],
        'top_donors': [],
        'category_breakdown': []
    }
    
    # Top campaigns
    for campaign in total_campaigns.order_by('-raised')[:10]:
        report['top_campaigns'].append({
            'title': campaign.title,
            'category': campaign.category,
            'goal': float(campaign.goal),
            'raised': float(campaign.raised),
            'progress': campaign.progress_percentage
        })
    
    # Top donors
    donor_totals = total_donations.values('donor__id', 'donor__name').annotate(
        total=Sum('amount'),
        count=Count('id')
    ).order_by('-total')[:10]
    
    for donor in donor_totals:
        report['top_donors'].append({
            'name': donor['donor__name'],
            'total_donated': float(donor['total']),
            'donation_count': donor['count']
        })
    
    return Response(report)
