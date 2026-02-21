# Quick Deployment Guide

## Deploy the Infrastructure

1. **Navigate to CDK directory:**
   ```bash
   cd cdk
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Bootstrap CDK (first time only):**
   ```bash
   npx cdk bootstrap
   ```

4. **Deploy the stack:**
   ```bash
   npx cdk deploy
   ```

5. **Save the outputs:**
   - Copy the `ApiEndpoint` URL
   - Copy the `ApiKeyId`

6. **Retrieve and store your API key:**
   ```bash
   aws apigateway get-api-key --api-key <ApiKeyId> --include-value --query 'value' --output text
   ```
   
   Then create `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env and paste your API key and endpoint
   ```

## Test the API

```bash
curl -X POST <ApiEndpoint>/check-alignment \
  -H "x-api-key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "learn about AWS CDK",
    "pageTitle": "AWS CDK Documentation",
    "pageUrl": "https://docs.aws.amazon.com/cdk",
    "pageContent": "AWS Cloud Development Kit...",
    "goalSpecificity": "specific"
  }'
```

## Clean Up

To remove all resources:
```bash
npx cdk destroy
```
