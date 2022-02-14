// import * as cdk from "aws-cdk-lib";
// import * as lambda from "aws-cdk-lib/aws-lambda";
// import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

// function makeLambdaWithDynamoAccess(
//     scope: cdk.Stack,
//     id: string,
//     dynamo: dynamodb.Table
// ): lambda.Function {
//     const myLambda = new lambda.Function(scope, id, {
//         runtime: lambda.Runtime.NODEJS_14_X,
//         handler: "scanmeta.handler",
//         code: lambda.Code.fromAsset("lambda"),
//         environment: {
//             TABLE_NAME: dynamo.tableName,
//         },
//     });
//     dynamo.grantReadData(myLambda);
//     return myLambda;
// }

// export { makeLambdaWithDynamoAccess };
