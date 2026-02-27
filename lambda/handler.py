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
        
        print(f"Received request - Goal: {goal}")
        print(f"Page URL: {page_url}")
        print(f"Page Title: {page_title}")
        print(f"Page Content (first 200 chars): {page_content[:200]}...")
        
        prompt = f"""You are an expert that is helping enforce focus. You given a user's goal and
the web page they're visiting, you should determine whether the web page is aligned with the goal and helps
the user achieve their goal. Err on the side of caution and allow the user to visit websites
that are likely tangentially related. If the user's goal is vague, you should be more tolerant.

User's goal: "{goal}"

Page title: {page_title}
Page URL: {page_url}
Page content: {page_content}

Is this page aligned with the user's goal?
- Return "yes" if clearly aligned
- Return "no" if clearly not aligned  
- Return "uncertain" if ambiguous

CRITICAL: Your response MUST be valid JSON only. No additional text before or after.
CRITICAL: Do not include explanations, reasoning, or any text outside the JSON structure.
CRITICAL: The response must be parseable by json.loads() in Python.

Response format: {{"aligned": "yes|no|uncertain", "confidence": 0.0-1.0, "reasoning": "brief explanation"}}

Example valid responses:
{{"aligned": "yes", "confidence": 0.9, "reasoning": "Page directly teaches Python basics"}}
{{"aligned": "no", "confidence": 0.8, "reasoning": "Page about cats, unrelated to Python learning"}}"""

        print(f"Sending prompt to Bedrock (length: {len(prompt)} chars)")
        
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-haiku-20240307-v1:0',
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 200,
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
