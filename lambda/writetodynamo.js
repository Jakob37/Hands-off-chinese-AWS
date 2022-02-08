const AWS = require("aws-sdk");

exports.handler = async function (event) {

    var body = JSON.parse(event.body);

    const dynamo = new AWS.DynamoDB();

    await dynamo
        .updateItem({
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: body.id },
                text: { S: body.content },
                // filename: event.filename,
                // creationdate: event.creationdate,
                // category: event.category,
                // language: event.language,
                // status: 'active',
            }
        })
        .promise();

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Successfully put event: ${JSON.stringify(event, null, 2)}`
    }
}
