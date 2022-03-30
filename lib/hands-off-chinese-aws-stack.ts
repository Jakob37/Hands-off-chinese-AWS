import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as S3 from "aws-cdk-lib/aws-s3";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

export class HandsOffChineseAwsStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Setup REST API
        const api = new apigw.RestApi(this, "hands-off-chinese-api");
        api.root.addMethod("ANY");
        const entriesApi = api.root.addResource("entries");
        const allEntriesApi = api.root.addResource("allentries");
        const userDataApi = api.root.addResource("userdata");
        // entriesApi.addMethod('GET');

        // Write entry to Dynamo
        const metaDynamo = new dynamodb.Table(this, "Meta", {
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "user", type: dynamodb.AttributeType.STRING },
        });
        const writeDynamoLambda = new lambda.Function(this, "WriteEntryMeta", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "writeentrytodynamo.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                TABLE_NAME: metaDynamo.tableName,
            },
        });
        metaDynamo.grantReadWriteData(writeDynamoLambda);
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
        entriesApi.addMethod(
            "POST",
            new apigw.LambdaIntegration(writeDynamoLambda)
        );
        allEntriesApi.addMethod(
            "GET",
            new apigw.LambdaIntegration(scanMetaLambda)
        );

        // Write user data to Dynamo
        const userDataDynamo = new dynamodb.Table(this, "UserData", {
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "user", type: dynamodb.AttributeType.STRING },
        });
        const writeUserDataLambda = new lambda.Function(this, "WriteUserData", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "writeuserdatatodynamo.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                TABLE_NAME: userDataDynamo.tableName,
            },
        });
        userDataDynamo.grantReadWriteData(writeUserDataLambda);
        userDataApi.addMethod(
            "POST",
            new apigw.LambdaIntegration(writeUserDataLambda)
        );

        // Get user data from Dynamo
        const getUserDataLambda = new lambda.Function(this, "GetUserData", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "readuserdatafromdynamo.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                TABLE_NAME: userDataDynamo.tableName,
            },
        });
        userDataDynamo.grantReadWriteData(getUserDataLambda);
        userDataApi.addMethod(
            "GET",
            new apigw.LambdaIntegration(getUserDataLambda)
        );

        // Polly
        const pollyStatement = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ["*"],
            actions: ["polly:SynthesizeSpeech", "s3:PutObject"],
        });
        const pollyS3 = new S3.Bucket(this, "PollyBucket");
        const pollyLambda = new lambda.Function(this, "Polly", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "writetos3.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                BUCKET_NAME: pollyS3.bucketName,
            },
        });
        pollyLambda.addToRolePolicy(pollyStatement);
        pollyS3.grantReadWrite(pollyLambda);

        // Get signed URL
        const signedUrlLambda = new lambda.Function(this, "SignedUrl", {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: "getsignedurl.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                BUCKET_NAME: pollyS3.bucketName,
            },
        });
        pollyS3.grantReadWrite(signedUrlLambda);

        const pollyApi = api.root.addResource("polly");
        pollyApi.addMethod("POST", new apigw.LambdaIntegration(pollyLambda));

        const signedUrlApi = api.root.addResource("signedurl");
        signedUrlApi.addMethod(
            "POST",
            new apigw.LambdaIntegration(signedUrlLambda)
        );

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
