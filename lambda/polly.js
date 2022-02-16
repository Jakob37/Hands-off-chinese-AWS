const AWS = require("aws-sdk");
const polly = new AWS.Polly();
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    const pollyParams = {
        OutputFormat: "mp3",
        Text: event.text,
        VoiceId: event.voice,
    };

    polly
        .synthesizeSpeech(pollyParams)
        .on("success", function (response) {
            const data = response.data;
            const audioStream = data.AudioStream;
            const s3BucketName = process.env.BUCKET_NAME;
            const key = `public/${event.prefix}_${event.text}`;

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
