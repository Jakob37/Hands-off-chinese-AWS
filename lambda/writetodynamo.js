const AWS = require("aws-sdk");

exports.handler = async function (event) {
    var body = JSON.parse(event.body);

    const dynamo = new AWS.DynamoDB();

    let result;
    await dynamo
        .putItem({
            TableName: process.env.TABLE_NAME,
            Item: {
                id: { S: body.id },
                chinese: { S: body.chinese },
                english: { S: body.english },
                filenamechinese: { S: body.filenamechinese },
                filenameenglish: { S: body.filenameenglish },
                creationdate: { S: body.creationdate },
                category: { S: body.category },
            },
        })
        .promise();

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Successfully put event with body: ${JSON.stringify(
            event.body,
            null,
            2
        )}`,
    };
};
