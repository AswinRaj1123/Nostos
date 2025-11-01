"""
Admin configuration for Campaigns app.
"""
from django.contrib import admin
from .models import Campaign, CampaignUpdate, CampaignTestimonial


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    """Campaign admin."""
    
    list_display = ('title', 'category', 'goal', 'raised', 'progress_percentage', 'deadline', 'status', 'created_at')
    list_filter = ('status', 'category', 'deadline')
    search_fields = ('title', 'description')
    readonly_fields = ('raised', 'created_at', 'updated_at', 'progress_percentage')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'image')
        }),
        ('Financial Details', {
            'fields': ('goal', 'raised', 'progress_percentage')
        }),
        ('Status & Timeline', {
            'fields': ('status', 'deadline')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )


@admin.register(CampaignUpdate)
class CampaignUpdateAdmin(admin.ModelAdmin):
    """Campaign update admin."""
    
    list_display = ('campaign', 'title', 'created_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'message', 'campaign__title')
    readonly_fields = ('created_at',)


@admin.register(CampaignTestimonial)
class CampaignTestimonialAdmin(admin.ModelAdmin):
    """Campaign testimonial admin."""
    
    list_display = ('campaign', 'donor', 'rating', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'rating', 'created_at')
    search_fields = ('message', 'campaign__title', 'donor__name')
    readonly_fields = ('created_at',)
    actions = ['approve_testimonials', 'reject_testimonials']
    
    def approve_testimonials(self, request, queryset):
        queryset.update(is_approved=True)
    approve_testimonials.short_description = "Approve selected testimonials"
    
    def reject_testimonials(self, request, queryset):
        queryset.update(is_approved=False)
    reject_testimonials.short_description = "Reject selected testimonials"
