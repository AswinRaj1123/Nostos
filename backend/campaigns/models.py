"""
Models for Campaigns.
"""
from django.db import models
from django.utils import timezone
from users.models import User


class Campaign(models.Model):
    """Campaign model."""
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    )
    
    CATEGORY_CHOICES = (
        ('Infrastructure', 'Infrastructure'),
        ('Education', 'Education'),
        ('Sports', 'Sports'),
        ('Research', 'Research'),
        ('Technology', 'Technology'),
        ('Healthcare', 'Healthcare'),
        ('Environment', 'Environment'),
        ('Other', 'Other'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    goal = models.DecimalField(max_digits=12, decimal_places=2)
    raised = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    image = models.ImageField(upload_to='campaigns/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_campaigns')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'campaigns'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'deadline']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return self.title
    
    @property
    def progress_percentage(self):
        """Calculate progress percentage."""
        if self.goal > 0:
            return min((float(self.raised) / float(self.goal)) * 100, 100)
        return 0
    
    @property
    def is_active(self):
        """Check if campaign is active and not expired."""
        return self.status == 'active' and self.deadline >= timezone.now().date()
    
    @property
    def donor_count(self):
        """Get total number of donors."""
        return self.donations.values('donor').distinct().count()


class CampaignUpdate(models.Model):
    """Campaign update/news model."""
    
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=255)
    message = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'campaign_updates'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.campaign.title} - {self.title}"


class CampaignTestimonial(models.Model):
    """Campaign testimonial/review model."""
    
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='testimonials')
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='testimonials')
    message = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'campaign_testimonials'
        ordering = ['-created_at']
        unique_together = ['campaign', 'donor']
    
    def __str__(self):
        return f"{self.donor.name} - {self.campaign.title}"
