"""
Sentiment Analysis for feedback and messages.
"""
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import nltk

# Download required NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Initialize VADER
vader_analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(text):
    """
    Analyze sentiment of text using multiple methods.
    
    Args:
        text: Input text to analyze
    
    Returns:
        Dictionary with sentiment scores and classification
    """
    
    # VADER sentiment (good for social media, short texts)
    vader_scores = vader_analyzer.polarity_scores(text)
    
    # TextBlob sentiment (general purpose)
    blob = TextBlob(text)
    textblob_polarity = blob.sentiment.polarity
    textblob_subjectivity = blob.sentiment.subjectivity
    
    # Determine overall sentiment
    vader_compound = vader_scores['compound']
    
    if vader_compound >= 0.05:
        sentiment = 'positive'
    elif vader_compound <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    # Calculate confidence based on agreement between methods
    agreement = abs(vader_compound - textblob_polarity) < 0.3
    confidence = 'high' if agreement else 'medium'
    
    return {
        'sentiment': sentiment,
        'confidence': confidence,
        'scores': {
            'vader_positive': vader_scores['pos'],
            'vader_negative': vader_scores['neg'],
            'vader_neutral': vader_scores['neu'],
            'vader_compound': vader_compound,
            'textblob_polarity': textblob_polarity,
            'textblob_subjectivity': textblob_subjectivity
        }
    }


def classify_feedback(feedback_text):
    """
    Classify feedback into categories with sentiment.
    
    Args:
        feedback_text: Feedback message
    
    Returns:
        Classification result
    """
    
    sentiment_result = analyze_sentiment(feedback_text)
    
    # Simple keyword-based category detection
    text_lower = feedback_text.lower()
    
    categories = []
    if any(word in text_lower for word in ['donate', 'payment', 'transaction', 'money']):
        categories.append('payment')
    if any(word in text_lower for word in ['campaign', 'cause', 'project']):
        categories.append('campaign')
    if any(word in text_lower for word in ['website', 'app', 'ui', 'interface', 'bug']):
        categories.append('technical')
    if any(word in text_lower for word in ['thank', 'grateful', 'appreciate', 'happy']):
        categories.append('appreciation')
    if any(word in text_lower for word in ['problem', 'issue', 'error', 'complaint']):
        categories.append('complaint')
    
    if not categories:
        categories.append('general')
    
    return {
        'sentiment': sentiment_result['sentiment'],
        'confidence': sentiment_result['confidence'],
        'categories': categories,
        'scores': sentiment_result['scores']
    }


def analyze_testimonial_quality(testimonial_text):
    """
    Analyze quality of a testimonial.
    
    Args:
        testimonial_text: Testimonial message
    
    Returns:
        Quality score and suggestions
    """
    
    sentiment = analyze_sentiment(testimonial_text)
    blob = TextBlob(testimonial_text)
    
    # Quality metrics
    word_count = len(testimonial_text.split())
    sentence_count = len(blob.sentences)
    avg_sentence_length = word_count / max(sentence_count, 1)
    
    # Calculate quality score (0-100)
    quality_score = 0
    
    # Length factor (optimal: 50-150 words)
    if 50 <= word_count <= 150:
        quality_score += 30
    elif 30 <= word_count < 50 or 150 < word_count <= 200:
        quality_score += 20
    else:
        quality_score += 10
    
    # Sentiment factor (positive testimonials are better)
    if sentiment['sentiment'] == 'positive':
        quality_score += 40
    elif sentiment['sentiment'] == 'neutral':
        quality_score += 20
    
    # Readability factor
    if 10 <= avg_sentence_length <= 20:
        quality_score += 20
    elif 5 <= avg_sentence_length < 10 or 20 < avg_sentence_length <= 25:
        quality_score += 10
    
    # Subjectivity factor (more subjective = more personal)
    if sentiment['scores']['textblob_subjectivity'] > 0.5:
        quality_score += 10
    
    # Suggestions
    suggestions = []
    if word_count < 30:
        suggestions.append("Consider adding more details to make the testimonial more impactful")
    if sentiment['sentiment'] != 'positive':
        suggestions.append("Highlight positive aspects of your experience")
    if avg_sentence_length > 25:
        suggestions.append("Break down long sentences for better readability")
    
    return {
        'quality_score': min(quality_score, 100),
        'word_count': word_count,
        'sentiment': sentiment['sentiment'],
        'suggestions': suggestions
    }
