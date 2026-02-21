# Task Driven Browsing - CDK Infrastructure

This directory contains the AWS CDK infrastructure code for the Task Driven Browsing backend.

## Architecture

The stack creates:

- **Lambda Function**: Python 3.12 runtime that processes alignment check requests
- **API Gateway**: REST API with API key authentication
- **IAM Roles**: Lambda execution role with Bedrock invoke permissions
- **CloudWatch Logs**: Log groups with 1-week retention

## Prerequisites

- AWS CLI configured with credentials
- Node.js 18+ and npm
- AWS CDK CLI: `npm install -g aws-cdk`

## Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Bootstrap CDK (first time only):
   ```bash
   cdk bootstrap
   ```

4. Deploy the stack:
   ```bash
   cdk deploy
   ```

5. Note the outputs:
   - `ApiEndpoint`: The API Gateway URL
   - `ApiKeyId`: Use this to retrieve the API key from AWS Console

## Retrieving the API Key

After deployment, retrieve the API key value:

```bash
aws apigateway get-api-key --api-key <ApiKeyId> --include-value --query 'value' --output text
```

Store it in a `.env` file (already gitignored):

```bash
cd cdk
cp .env.example .env
# Edit .env and add your API key and endpoint
```

Or via AWS Console:
1. Go to API Gateway → API Keys
2. Find "task-driven-browsing-key"
3. Click "Show" to reveal the key value

## API Endpoint

```
POST /check-alignment
Headers:
  - x-api-key: <your-api-key>
  - Content-Type: application/json
Body:
  {
    "goal": "user's current goal",
    "pageTitle": "page title",
    "pageUrl": "https://example.com",
    "pageContent": "truncated content...",
    "goalSpecificity": "vague|specific"
  }
Response:
  {
    "aligned": "yes|no|uncertain",
    "confidence": 0.85
  }
```

## Configuration

- **Rate Limit**: 10 requests/second
- **Burst Limit**: 20 requests
- **Monthly Quota**: 10,000 requests
- **Lambda Timeout**: 30 seconds
- **Lambda Memory**: 256 MB

## Cost Estimates

For 100 pages/day (~3,000 requests/month):
- Bedrock (Claude Haiku): ~$1.70/month
- API Gateway: ~$0.01/month
- Lambda: Free tier
- **Total**: ~$2/month

## Useful Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `cdk diff` - Compare deployed stack with current state
- `cdk synth` - Emit CloudFormation template
- `cdk deploy` - Deploy stack
- `cdk destroy` - Remove all resources

## Security Notes

- API key authentication for personal use
- Bedrock permissions scoped to InvokeModel only
- CloudWatch logs enabled for monitoring
- Consider migrating to Cognito for public release
