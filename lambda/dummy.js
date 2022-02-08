const AWS = require("aws-sdk");

exports.handler = async function (event) {

    const s3 = new AWS.S3();
    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: event.path,
        Body: 'No body'
    }
    await s3.putObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
    }).promise();

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Bucket: ${process.env.BUCKET_NAME} Key: ${event.path}`,
    };
};
