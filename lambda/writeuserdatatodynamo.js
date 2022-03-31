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

// READ:
// API Gateway elements
// https://www.alexdebrie.com/posts/api-gateway-elements/

// Running through the manual direct test
// {"body": "{\"id\":\"myid\", \"user\":\"myuser\", \"jsonString\":\"test\"}"}

// Running through the Gateway
// {"id":"myid", "user":"myuser", "jsonString":"test"}

// Running through axios put
// axios2
// .post("https://<URL>.execute-api.eu-west-1.amazonaws.com/prod/userdata", 
// {"id":"myid", "user":"myuser", "jsonString":"test"})
// .then(function(response){ console.log('response', response) })
// .catch(function(error) { if (error.response) {console.log(error.response.data)} else {console.log(error)} })
