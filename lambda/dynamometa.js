const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        let requestJSON = event;
        if (requestJSON.action == "add") {
            await dynamo
                .put({
                    TableName: "[tablename]",
                    Item: {
                        id: requestJSON.id,
                        text: requestJSON.text,
                        filename: requestJSON.filename,
                        creationdate: requestJSON.creationdate,
                        category: requestJSON.category,
                        language: requestJSON.language,
                        status: "active",
                    },
                })
                .promise();
            body = `Put item ${JSON.stringify(requestJSON)}`;
        } else if (requestJSON.action == "delete") {
            await dynamo
                .delete({
                    TableName: "[tablename]",
                    Key: {
                        filename: requestJSON.filename,
                    },
                })
                .promise();
            body = `Removed item ${JSON.stringify(requestJSON)}`;
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
        keys: Object.keys(event),
        values: Object.values(event),
    };
};
