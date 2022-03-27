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
                user: { S: body.user },
                jsonString: { S: body.jsonString },
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
