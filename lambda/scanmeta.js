const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body = "";

    body = await dynamo
        .scan({
            TableName: process.env.TABLE_NAME,
        })
        .promise();

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(body)
    };
};
