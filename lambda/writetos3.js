const AWS = require("aws-sdk");
const polly = new AWS.Polly();
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body);

    const pollyParams = {
        OutputFormat: "mp3",
        Text: body.text,
        VoiceId: body.voice,
    };

    polly
        .synthesizeSpeech(pollyParams)
        .on("success", function (response) {
            const data = response.data;
            const audioStream = data.AudioStream;
            const s3BucketName = process.env.BUCKET_NAME;

            const key = `public/${body.user}/${body.prefix}_${body.text}`;

            const params = {
                Bucket: s3BucketName,
                Key: key,
                Body: audioStream,
            };
            s3.putObject(params)
                .on("success", function (response) {
                    console.log("S3 Put Success!");
                })
                .on("complete", function () {
                    console.log("S3 Put Complete!");

                    const s3params = {
                        Bucket: s3BucketName,
                        Key: key + ".mp3",
                    };

                    // 3. Get signed URL for saved mp3
                    const url = s3.getSignedUrl("getObject", s3params);

                    // Send result back to user
                    const result = {
                        bucket: s3BucketName,
                        key: key + ".mp3",
                        url: url,
                    };
                    callback(null, {
                        statusCode: 200,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                        },
                        body: JSON.stringify(result),
                    });
                })
                .on("error", function (response) {
                    console.log(response);
                })
                .send();
        })
        .on("error", function (err) {
            callback(null, {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(err),
            });
        })
        .send();
};


// const AWS = require("aws-sdk");

// exports.handler = async function (event) {

//     const s3 = new AWS.S3();
//     var params = {
//         Bucket: process.env.BUCKET_NAME,
//         Key: event.path,
//         Body: 'No body'
//     }
//     await s3.putObject(params, function(err, data) {
//         if (err) console.log(err, err.stack);
//         else console.log(data);
//     }).promise();

//     return {
//         statusCode: 200,
//         headers: { "Content-Type": "text/plain" },
//         body: `Bucket: ${process.env.BUCKET_NAME} Key: ${event.path}`,
//     };
// };
