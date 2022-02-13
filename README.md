# Hands-off Chinese AWS backend

## Next

Investigate: Any risks of having this public

- [ ] CDK workshop (run through again, and understand each step): https://cdkworkshop.com
- [ ] Read the AWS CDK info
    - [ ] Background (https://docs.aws.amazon.com/cdk/v2/guide/home.html)
    - [ ] API reference (https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
- [ ] Setup the existing resources, testing one by one
    - [ ] S3
    - [ ] Lambda + API Gateway
    - [ ] DynamoDB
- [ ] Explore how to setup up Polly in the context (generate here, or use existing end point?)
- [ ] Setup Cognito
- [ ] Consider setting up a continuous deployment pipeline

## Useful CDK commands

* `cdk bootstrap` Generate S3 resource to carry the project
* `cdk destroy` Cleanup
* `cdk synth` Synthesize the cloud formation template
* `cdk diff` Compare the to-be-generated template with the current
* `cdk deploy` / `cdk deploy --hotswap`
* `cdk watch`
* `cdk deploy --outputs-file ./[path].json`

## Useful materials

* CDK Cognito setup https://bobbyhadz.com/blog/aws-cdk-cognito-user-pool-example
* Amplify login (without Amplify) https://medium.com/alturasoluciones/react-native-signin-and-signup-with-aws-cognito-2a285599b7c4
* Cognito with assigned permissions (https://github.com/talkncloud/aws/tree/main/cognito-federation)
    * https://medium.com/hackernoon/how-to-add-new-cognito-users-to-dynamodb-using-lambda-e3f55541297c