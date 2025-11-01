"""
Views for Donation API.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import Donation, DonationReceipt
from .serializers import DonationSerializer, DonationCreateSerializer, DonationReceiptSerializer
from campaigns.models import Campaign


class DonationListView(generics.ListAPIView):
    """API endpoint for listing donations."""
    
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admins can see all donations
        if user.role == 'admin':
            return Donation.objects.all()
        
        # Alumni can only see their own donations
        return Donation.objects.filter(donor=user)


class DonationCreateView(generics.CreateAPIView):
    """API endpoint for creating donation."""
    
    serializer_class = DonationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        donation = serializer.save(donor=self.request.user)
        
        # TODO: Integrate with payment gateway (Razorpay/Stripe)
        # For now, mark as completed
        donation.status = 'completed'
        donation.completed_at = timezone.now()
        donation.save()
        
        # Update campaign raised amount
        donation.campaign.raised += donation.amount
        donation.campaign.save(update_fields=['raised'])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return full donation details
        donation_serializer = DonationSerializer(serializer.instance)
        return Response(donation_serializer.data, status=status.HTTP_201_CREATED)


class DonationDetailView(generics.RetrieveAPIView):
    """API endpoint for donation detail."""
    
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'admin':
            return Donation.objects.all()
        
        return Donation.objects.filter(donor=user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def donation_statistics(request):
    """Get donation statistics for current user."""
    
    user = request.user
    
    if user.role == 'admin':
        # Admin sees overall stats
        donations = Donation.objects.filter(status='completed')
    else:
        # Alumni sees their own stats
        donations = Donation.objects.filter(donor=user, status='completed')
    
    total_donated = donations.aggregate(total=Sum('amount'))['total'] or 0
    donation_count = donations.count()
    campaigns_supported = donations.values('campaign').distinct().count()
    
    # Recent donations (last 10)
    recent_donations = donations.order_by('-created_at')[:10]
    recent_serializer = DonationSerializer(recent_donations, many=True)
    
    return Response({
        'total_donated': float(total_donated),
        'donation_count': donation_count,
        'campaigns_supported': campaigns_supported,
        'recent_donations': recent_serializer.data,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def donation_history_chart(request):
    """Get donation history data for charts."""
    
    user = request.user
    months = int(request.GET.get('months', 12))
    
    # Calculate date range
    end_date = timezone.now()
    start_date = end_date - timedelta(days=30 * months)
    
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
    
    # Group by month
    monthly_data = {}
    for donation in donations:
        month_key = donation.completed_at.strftime('%Y-%m')
        if month_key not in monthly_data:
            monthly_data[month_key] = 0
        monthly_data[month_key] += float(donation.amount)
    
    # Format response
    chart_data = [
        {'month': month, 'amount': amount}
        for month, amount in sorted(monthly_data.items())
    ]
    
    return Response(chart_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def campaign_leaderboard(request, campaign_id):
    """Get top donors for a specific campaign."""
    
    limit = int(request.GET.get('limit', 10))
    
    top_donors = Donation.objects.filter(
        campaign_id=campaign_id,
        status='completed',
        is_anonymous=False
    ).values('donor__id', 'donor__name').annotate(
        total_amount=Sum('amount'),
        donation_count=Count('id')
    ).order_by('-total_amount')[:limit]
    
    return Response(list(top_donors))


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_receipt(request, donation_id):
    """Generate receipt for a donation."""
    
    try:
        donation = Donation.objects.get(id=donation_id)
        
        # Check permission
        if request.user != donation.donor and request.user.role != 'admin':
            return Response({
                'error': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if donation.status != 'completed':
            return Response({
                'error': 'Can only generate receipt for completed donations'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or get receipt
        receipt, created = DonationReceipt.objects.get_or_create(donation=donation)
        
        # TODO: Generate PDF receipt
        # For now, just mark as sent
        donation.receipt_sent = True
        donation.save(update_fields=['receipt_sent'])
        
        serializer = DonationReceiptSerializer(receipt)
        return Response(serializer.data)
    
    except Donation.DoesNotExist:
        return Response({
            'error': 'Donation not found'
        }, status=status.HTTP_404_NOT_FOUND)
