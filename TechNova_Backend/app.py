from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import math
from config import Config
from model_utils import predictor
from llm_utils import llm_analyzer
from database import db_manager
import json

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS for React frontend


def sanitize_json(value):
    """Convert NaN/Inf to JSON-safe values."""
    if isinstance(value, dict):
        return {k: sanitize_json(v) for k, v in value.items()}
    if isinstance(value, list):
        return [sanitize_json(v) for v in value]
    if isinstance(value, float):
        return value if math.isfinite(value) else 0.0
    return value


@app.route('/api/predict', methods=['POST'])
def predict_loan():
    """
    Endpoint for loan prediction
    Expected JSON format:
    {
        "Age": 35,
        "Income": 60000,
        "LoanAmount": 20000,
        "CreditScore": 700,
        "MonthsEmployed": 24,
        "NumCreditLines": 3,
        "InterestRate": 5.5,
        "LoanTerm": 36,
        "DTIRatio": 0.35,
        "Education": "Bachelor's",
        "EmploymentType": "Full-time",
        "MaritalStatus": "Married",
        "HasMortgage": "No",
        "HasDependents": "Yes",
        "LoanPurpose": "Home",
        "HasCoSigner": "No"
    }
    """
    try:
        # Get application data from request
        application_data = request.get_json()
        
        # Validate required fields
        required_fields = ['Age', 'Income', 'LoanAmount', 'CreditScore', 
                          'MonthsEmployed', 'NumCreditLines', 'InterestRate', 
                          'LoanTerm', 'DTIRatio', 'Education', 'EmploymentType', 
                          'MaritalStatus', 'HasMortgage', 'HasDependents', 
                          'LoanPurpose', 'HasCoSigner']
        
        missing_fields = [field for field in required_fields if field not in application_data]
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {missing_fields}'
            }), 400
        
        # Make prediction
        prediction_results = predictor.predict(application_data)
        
        # Get LLM analysis
        analysis_response = llm_analyzer.analyze_application(
            application_data, 
            prediction_results
        )
        
        # If approved, save to database
        if prediction_results['predicted_class'] == 1:
            db_id = db_manager.save_application(
                application_data, 
                prediction_results, 
                analysis_response
            )
            analysis_response['database_id'] = db_id
        
        # Return response
        return jsonify(sanitize_json({
            'success': True,
            'prediction': prediction_results,
            'analysis': analysis_response
        }))
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/applications', methods=['GET'])
def get_applications():
    """Get all approved applications (admin endpoint)"""
    try:
        applications = db_manager.get_all_applications()
        return jsonify({
            'success': True,
            'applications': applications
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': predictor.model is not None,
        'llm_configured': True
    })

if __name__ == '__main__':
    app.run(debug=Config.DEBUG, port=Config.PORT)
