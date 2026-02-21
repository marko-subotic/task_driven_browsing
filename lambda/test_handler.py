import json
import pytest
from unittest.mock import Mock, patch
from handler import lambda_handler

@pytest.fixture
def api_event():
    return {
        'body': json.dumps({
            'goal': 'learn about python',
            'pageTitle': 'Python Tutorial',
            'pageUrl': 'https://python.org/tutorial',
            'pageContent': 'Learn Python programming basics',
            'goalSpecificity': 'specific'
        })
    }

@pytest.fixture
def bedrock_response():
    return {
        'body': Mock(read=lambda: json.dumps({
            'content': [{'text': '{"aligned": "yes", "confidence": 0.95}'}]
        }).encode())
    }

def test_lambda_handler_success(api_event, bedrock_response):
    with patch('handler.bedrock') as mock_bedrock:
        mock_bedrock.invoke_model.return_value = bedrock_response
        
        response = lambda_handler(api_event, None)
        
        assert response['statusCode'] == 200
        body = json.loads(response['body'])
        assert body['aligned'] == 'yes'
        assert body['confidence'] == 0.95

def test_lambda_handler_not_aligned(api_event, bedrock_response):
    bedrock_response['body'].read = lambda: json.dumps({
        'content': [{'text': '{"aligned": "no", "confidence": 0.85}'}]
    }).encode()
    
    with patch('handler.bedrock') as mock_bedrock:
        mock_bedrock.invoke_model.return_value = bedrock_response
        
        response = lambda_handler(api_event, None)
        
        body = json.loads(response['body'])
        assert body['aligned'] == 'no'

def test_lambda_handler_uncertain(api_event, bedrock_response):
    bedrock_response['body'].read = lambda: json.dumps({
        'content': [{'text': '{"aligned": "uncertain", "confidence": 0.5}'}]
    }).encode()
    
    with patch('handler.bedrock') as mock_bedrock:
        mock_bedrock.invoke_model.return_value = bedrock_response
        
        response = lambda_handler(api_event, None)
        
        body = json.loads(response['body'])
        assert body['aligned'] == 'uncertain'

def test_lambda_handler_bedrock_error(api_event):
    with patch('handler.bedrock') as mock_bedrock:
        mock_bedrock.invoke_model.side_effect = Exception('Bedrock error')
        
        response = lambda_handler(api_event, None)
        
        assert response['statusCode'] == 500
        body = json.loads(response['body'])
        assert body['aligned'] == 'uncertain'
        assert 'error' in body

def test_lambda_handler_invalid_json():
    event = {'body': 'invalid json'}
    
    response = lambda_handler(event, None)
    
    assert response['statusCode'] == 500
    body = json.loads(response['body'])
    assert body['aligned'] == 'uncertain'
