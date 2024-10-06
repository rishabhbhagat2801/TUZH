from flask import Flask, render_template, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the sentiment analysis model
model_name = 'distilbert/distilbert-base-uncased-finetuned-sst-2-english'
sentiment_analyzer = pipeline('sentiment-analysis', model=model_name)

# 10 Predefined Well-being Questions
questions = [
    "On a scale of 1-10, how stressed do you feel today?",
    "How would you describe your mood today (happy, sad, neutral)?",
    "How many hours of sleep did you get last night?",
    "Do you feel energized and ready to start your day today? (yes/no)",
    "How would you rate your physical health in the last week (1-10)?",
    "How balanced do you feel between your work and personal life?",
    "How often do you feel anxious in a typical day?",
    "Do you feel socially connected with friends and family?",
    "How often do you take time to relax and clear your mind?",
    "How well do you feel you are coping with challenges in life right now?"
]

# Home route to serve the well-being assessment page
@app.route('/')
def index():
    return render_template('index.html', questions=questions)

# API route to analyze user responses
@app.route('/analyze_response', methods=['POST'])
def analyze_response():
    data = request.json
    user_response = data.get('response')
    
    try:
        result = sentiment_analyzer(user_response)[0]
        label = result['label']  # POSITIVE or NEGATIVE
        score = result['score']   # Confidence score (0 to 1)
    except Exception as e:
        return jsonify({'error': 'Failed to analyze response'}), 500

    # Convert sentiment into a well-being score
    wellbeing_score = score * 10 if label == 'POSITIVE' else (1 - score) * 10

    return jsonify({'label': label, 'score': wellbeing_score})

if __name__ == '__main__':
    app.run(debug=True)