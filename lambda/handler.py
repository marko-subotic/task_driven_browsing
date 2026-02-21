import json
import boto3
import os

bedrock = boto3.client('bedrock-runtime')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        goal = body['goal']
        page_title = body['pageTitle']
        page_url = body['pageUrl']
        page_content = body['pageContent']
        
        prompt = f"""You are an expert that is helping enforce focus. You given a user's goal and
the web page they're visiting, you should determine whether the web page is aligned with the goal and helps
the user achieve their goal. Err on the side of caution. If the user's goal is vague, you should be more tolerant.

User's goal: "{goal}"

Page title: {page_title}
Page URL: {page_url}
Page content: {page_content}

Is this page aligned with the user's goal?
- Return "yes" if clearly aligned
- Return "no" if clearly not aligned  
- Return "uncertain" if ambiguous

Your response must be only a json file following the structure below, without any additional test.
Again, your response must be only a json file following the structure below, without any additional test.

Response format: {{"aligned": "yes|no|uncertain", "confidence": 0.0-1.0}}"""

        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-haiku-20240307-v1:0',
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 100,
                "messages": [{"role": "user", "content": prompt}]
            })
        )
        
        result = json.loads(response['body'].read())
        content = result['content'][0]['text']
        print(f"Bedrock raw response: {content}")
        
        decision = json.loads(content)
        print(f"Parsed decision: {decision}")
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(decision)
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'aligned': 'uncertain', 'confidence': 0.0, 'error': str(e)})
        }
