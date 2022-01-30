# Hands-off Chinese AWS backend

## Next

* CDK workshop: https://cdkworkshop.com/
    * Current step: https://cdkworkshop.com/20-typescript/30-hello-cdk/300-cdk-watch.html
* Outline the needed resources
    * Lambda
    * S3
    * Cognito
    * DynamoDB
    * Polly
* Outline knowledge needed to obtain to incorporate these step by step
    * App could be fully functional with Polly as a separate entity for now, let's see

## Useful commands

* `cdk bootstrap` Generate S3 resource to carry the project
* `cdk destroy` Cleanup
* `cdk synth` Synthesize the cloud formation template
* `cdk diff` Compare the to-be-generated template with the current
* `cdk deploy`
