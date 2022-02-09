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
        });
        const writeDynamoLambda = new lambda.Function(this, "WriteDynamo", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "writetodynamo.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                TABLE_NAME: metaDynamo.tableName,
            },
        });
        metaDynamo.grantReadWriteData(writeDynamoLambda);
        new apigw.LambdaRestApi(this, "MetaRest", {
            handler: writeDynamoLambda,
        });

        const pollyS3 = new S3.Bucket(this, "PollyBucket");
        const lambdaTest = new lambda.Function(this, "LambdaTest", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "writetos3.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                BUCKET_NAME: pollyS3.bucketName,
            },
        });
        pollyS3.grantReadWrite(lambdaTest);
        new apigw.LambdaRestApi(this, "PollyREST", {
            handler: lambdaTest,
        });

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

        const userPool = new cognito.UserPool(this, "userpool", {
            userPoolName: "my-user-pool",
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
            },
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                givenName: {
                    required: true,
                    mutable: true,
                },
                familyName: {
                    required: false,
                    mutable: true,
                },
            },
            customAttributes: {
                country: new cognito.StringAttribute({ mutable: true }),
                city: new cognito.StringAttribute({ mutable: true }),
                isAdmin: new cognito.StringAttribute({ mutable: true }),
            },
            passwordPolicy: {
                minLength: 6,
                requireLowercase: true,
                requireDigits: true,
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

        const clientReadAttributes = new cognito.ClientAttributes()
            .withStandardAttributes(standardCognitoAttributes)
            .withCustomAttributes(...["country", "city", "isAdmin"]);

        const clientWriteAttributes = new cognito.ClientAttributes()
            .withStandardAttributes({
                ...standardCognitoAttributes,
                emailVerified: false,
                phoneNumberVerified: false,
            })
            .withCustomAttributes(...["country", "city"]);

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
