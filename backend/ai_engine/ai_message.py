"""
OpenAI Integration for AI-powered messages.
"""
import os
from openai import OpenAI
from django.conf import settings

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def generate_thank_you_message(donor_name, campaign_title, amount, tone='formal'):
    """
    Generate personalized thank you message using OpenAI.
    
    Args:
        donor_name: Name of the donor
        campaign_title: Title of the campaign
        amount: Donation amount
        tone: Message tone (formal, friendly, casual)
    
    Returns:
        Generated message string
    """
    
    prompt = f"""
    Generate a heartfelt thank you message for a donation.
    
    Details:
    - Donor Name: {donor_name}
    - Campaign: {campaign_title}
    - Amount: ₹{amount}
    - Tone: {tone}
    
    The message should:
    - Express genuine gratitude
    - Mention the impact of their contribution
    - Be warm and personal
    - Be 2-3 paragraphs long
    - End with a positive note
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates heartfelt thank you messages for charitable donations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        # Fallback message if OpenAI fails
        return f"Dear {donor_name},\n\nThank you so much for your generous donation of ₹{amount} to {campaign_title}. Your support makes a real difference and helps us achieve our goals. We are truly grateful for your contribution.\n\nWith warm regards,\nNOSTOS Team"


def generate_campaign_description(title, category, goal, brief_description):
    """
    Generate detailed campaign description using AI.
    
    Args:
        title: Campaign title
        category: Campaign category
        goal: Fundraising goal
        brief_description: Brief overview
    
    Returns:
        Detailed description string
    """
    
    prompt = f"""
    Create a compelling campaign description for a fundraising campaign.
    
    Details:
    - Title: {title}
    - Category: {category}
    - Goal: ₹{goal}
    - Brief: {brief_description}
    
    The description should:
    - Be engaging and persuasive
    - Explain the importance of the cause
    - Include a call to action
    - Be 3-4 paragraphs
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a skilled fundraising copywriter who creates compelling campaign descriptions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        return brief_description


def suggest_campaign_improvements(campaign_data):
    """
    Suggest improvements for a campaign based on performance.
    
    Args:
        campaign_data: Dictionary with campaign details
    
    Returns:
        List of suggestions
    """
    
    prompt = f"""
    Analyze this fundraising campaign and suggest improvements:
    
    Campaign Details:
    - Title: {campaign_data.get('title')}
    - Goal: ₹{campaign_data.get('goal')}
    - Raised: ₹{campaign_data.get('raised')}
    - Progress: {campaign_data.get('progress')}%
    - Donor Count: {campaign_data.get('donor_count')}
    - Days Remaining: {campaign_data.get('days_remaining')}
    
    Provide 3-5 actionable suggestions to improve the campaign's success.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a fundraising consultant who provides actionable advice."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        
        content = response.choices[0].message.content.strip()
        # Split into list of suggestions
        suggestions = [s.strip() for s in content.split('\n') if s.strip()]
        return suggestions
    
    except Exception as e:
        return [
            "Update your campaign description with more compelling details",
            "Share regular updates to keep donors engaged",
            "Add testimonials from beneficiaries",
            "Promote on social media platforms",
            "Thank donors publicly to encourage more contributions"
        ]
