const AWS = require("aws-sdk");

// FIXME:
// Continue work here
// https://stackoverflow.com/questions/25886403/dynamodb-the-provided-key-element-does-not-match-the-schema
// Seems like the schema is not correct here
// Testing workflow
// 1. Explore lambda testing manually at AWS
// 2. Test interacting through the db with both setters and getters
// 3. Test interacting through the interface
// 4. Test interacting with the interface through curl
// 5. Test interacting from the app

// Consider writing a small blog post on test lambda functions!
// 1. Setup the Netlify infrastructure on the work laptop Leisure folder
// 2. Document this setup using notion

exports.handler = async function (event) {
    var body = JSON.parse(event.body);

    const dynamo = new AWS.DynamoDB();

    let result;
    try {
        result = await dynamo
            .getItem({
                TableName: process.env.TABLE_NAME,
                Key: {
                    id: { S: body.id },
                },
            })
            .promise();
        return { body: JSON.stringify(result) };
    } catch (err) {
        return { error: err };
    }

    // return {
    //     statusCode: 200,
    //     headers: { "Content-Type": "text/plain" },
    //     body: `Successfully retrieved an item with content: ${JSON.stringify()}`
    // }
};
