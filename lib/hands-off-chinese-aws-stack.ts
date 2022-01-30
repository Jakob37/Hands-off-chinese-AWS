// import { Stack, StackProps } from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import * as cdk from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";

import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";

import * as lambda from "aws-cdk-lib/aws-lambda";

// export class HandsOffChineseAwsStack extends cdk.Stack {
//   constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     new s3.Bucket(this, "MyFirstBucket", {
//       versioned: true,
//       removalPolicy: cdk.RemovalPolicy.DESTROY,
//       autoDeleteObjects: true
//     });
//   }
// }

export class HandsOffChineseAwsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });
  }
}
