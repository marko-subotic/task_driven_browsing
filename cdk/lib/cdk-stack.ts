import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'path';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CloudWatch Log Group
    const logGroup = new logs.LogGroup(this, 'AlignmentFunctionLogs', {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda function for alignment checking
    const alignmentFunction = new lambda.Function(this, 'AlignmentFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'handler.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../lambda')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      logGroup,
    });

    // Grant Bedrock permissions
    alignmentFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['*'],
    }));

    // API Gateway
    const api = new apigateway.RestApi(this, 'AlignmentApi', {
      restApiName: 'Task Driven Browsing API',
      description: 'API for checking page alignment with user goals',
      deployOptions: {
        stageName: 'prod',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
    });

    // API Key
    const apiKey = api.addApiKey('ApiKey', {
      apiKeyName: 'task-driven-browsing-key',
    });

    // Usage Plan
    const usagePlan = api.addUsagePlan('UsagePlan', {
      name: 'Standard',
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
      quota: {
        limit: 10000,
        period: apigateway.Period.MONTH,
      },
    });

    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({
      stage: api.deploymentStage,
    });

    // Lambda integration
    const integration = new apigateway.LambdaIntegration(alignmentFunction);

    // /check-alignment endpoint
    const checkAlignment = api.root.addResource('check-alignment');
    checkAlignment.addMethod('POST', integration, {
      apiKeyRequired: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'ApiKeyId', {
      value: apiKey.keyId,
      description: 'API Key ID (retrieve value from console)',
    });
  }
}
