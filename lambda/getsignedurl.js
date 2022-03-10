const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);

    const s3BucketName = process.env.BUCKET_NAME;
    const key = body.filename;

    const params = {
        Bucket: s3BucketName,
        Key: key,
    };
    const signedUrl = s3.getSignedUrl('getObject', params);

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: signedUrl
    };
};
