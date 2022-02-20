import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as S3 from "aws-cdk-lib/aws-s3";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class HandsOffChineseAwsStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const metaDynamo = new dynamodb.Table(this, "Meta", {
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "user", type: dynamodb.AttributeType.STRING },
        });

        // Write to Dynamo
        const writeDynamoLambda = new lambda.Function(this, "WriteDynamo", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "writetodynamo.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                TABLE_NAME: metaDynamo.tableName,
            },
        });
        metaDynamo.grantReadWriteData(writeDynamoLambda);
        // new apigw.LambdaRestApi(this, "MetaRest", {
        //     handler: writeDynamoLambda,
        // });

        // Scan meta data for all entries in Dynamo
        const scanMetaLambda = new lambda.Function(this, "ScanDynamo", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "scanmeta.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                TABLE_NAME: metaDynamo.tableName,
            },
        });
        metaDynamo.grantReadData(scanMetaLambda);
        // new apigw.LambdaRestApi(this, "ScanDynamoRest", {
        //     handler: scanMetaLambda,
        // });

        // Mp3 storage S3 bucket
        const pollyS3 = new S3.Bucket(this, "PollyBucket");
        const pollyLambda = new lambda.Function(this, "Polly", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "writetos3.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                BUCKET_NAME: pollyS3.bucketName,
            },
        });
        pollyS3.grantReadWrite(pollyLambda);
        // new apigw.LambdaRestApi(this, "PollyREST", {
        //     handler: lambdaTest,
        // });

        // Setup REST API
        const api = new apigw.RestApi(this, "hands-off-chinese-api");
        api.root.addMethod("ANY");

        const entriesApi = api.root.addResource("entries");
        // entriesApi.addMethod('GET');
        entriesApi.addMethod(
            "POST",
            new apigw.LambdaIntegration(writeDynamoLambda)
        );

        const allEntriesApi = api.root.addResource("allentries");
        allEntriesApi.addMethod(
            "GET",
            new apigw.LambdaIntegration(scanMetaLambda)
        );

        const pollyApi = api.root.addResource("polly");
        pollyApi.addMethod("POST", new apigw.LambdaIntegration(pollyLambda));

        // Setup the user pool
        const userPool = new cognito.UserPool(this, "userpool", {
            userPoolName: "my-user-pool-2",
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
            },
            autoVerify: {
                email: true,
            },

            passwordPolicy: {
                minLength: 6,
                requireLowercase: false,
                requireDigits: false,
                requireUppercase: false,
                requireSymbols: false,
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        });

        const standardCognitoAttributes = {
            givenName: true,
            familyName: true,
            email: true,
            emailVerified: true,
            address: true,
            birthdate: true,
            gender: true,
            locale: true,
            middleName: true,
            fullname: true,
            nickname: true,
            phoneNumber: true,
            phoneNumberVerified: true,
            profilePicture: true,
            preferredUsername: true,
            profilePage: true,
            timezone: true,
            lastUpdateTime: true,
            website: true,
        };

        const clientReadAttributes =
            new cognito.ClientAttributes().withStandardAttributes(
                standardCognitoAttributes
            );

        const clientWriteAttributes =
            new cognito.ClientAttributes().withStandardAttributes({
                ...standardCognitoAttributes,
                emailVerified: false,
                phoneNumberVerified: false,
            });

        const userPoolClient = new cognito.UserPoolClient(
            this,
            "userpool-client",
            {
                userPool,
                authFlows: {
                    adminUserPassword: true,
                    custom: true,
                    userSrp: true,
                },
                supportedIdentityProviders: [
                    cognito.UserPoolClientIdentityProvider.COGNITO,
                ],
                readAttributes: clientReadAttributes,
                writeAttributes: clientWriteAttributes,
            }
        );

        new cdk.CfnOutput(this, "userPoolId", {
            value: userPool.userPoolId,
        });

        new cdk.CfnOutput(this, "userPoolClientId", {
            value: userPoolClient.userPoolClientId,
        });
    }
}

// standardAttributes: {
//     givenName: {
//         required: true,
//         mutable: true,
//     },
//     familyName: {
//         required: false,
//         mutable: true,
//     },
// },
// customAttributes: {
//     country: new cognito.StringAttribute({ mutable: true }),
//     city: new cognito.StringAttribute({ mutable: true }),
//     isAdmin: new cognito.StringAttribute({ mutable: true }),
// },

// const hello = new lambda.Function(this, "HelloHandler", {
//     runtime: lambda.Runtime.NODEJS_14_X,
//     code: lambda.Code.fromAsset("lambda"),
//     handler: "hello.handler",
// });

// const helloWithCounter = new HitCounter(this, "HelloHitCounter", {
//     downstream: hello,
// });

// // REST API for the hello function
// new apigw.LambdaRestApi(this, "Endpoint", {
//     handler: helloWithCounter.handler,
// });

// new TableViewer(this, "ViewHitCounter", {
//     title: "Hello Hits",
//     table: helloWithCounter.table,
//     sortBy: "-hits",
// });
