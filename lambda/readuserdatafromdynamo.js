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
    const { user, id } = event.queryStringParameters;
    const dynamo = new AWS.DynamoDB();

    let result;
    try {
        result = await dynamo
            .getItem({
                TableName: process.env.TABLE_NAME,
                Key: {
                    id: { S: id },
                    user: { S: user },
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

// AHA! The key is to use the query parameters.

// Running through manual use
// {"body": "{\"id\":\"myid0.0781047789532614\", \"user\":\"myuser\"}"}

// Running through axios
// axios
//     .get(
//         "https://<URL>.execute-api.eu-west-1.amazonaws.com/prod/userdata",
//         { id: "myid0.0781047789532614", user: "myuser" }
//     )
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (err) {
//         console.log(err.response.data);
//     });

// Work in progress, to get the GET request through
// axios.get("https://<URL>.execute-api.eu-west-1.amazonaws.com/prod/userdata", {"data": {"id": "myid0.0781047789532614", "user":"myuser"}}).then(function(response) { console.log(response) }).catch(function(err) { console.log(err.response.data) })

// Getting through
// axios
//     .get("https://httpbin.org/get", {
//         params: { id: "myid0.0781047789532614", user: "myuser" },
//     })
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (err) {
//         console.log(err.response.data);
//     });

// NEXT STEP:

// Running API Gateway seems OK: id="myid0.0781047789532614"&user=myuser

// axios
//     .get(
//         "https://<URL>.execute-api.eu-west-1.amazonaws.com/prod/userdata",
//         { params: { id: "myid0.0781047789532614", user: "myuser" } }
//     )
//     .then(function (response) {
//         data = response.data
//         console.log(response);
//     })
//     .catch(function (err) {
//         console.log(err);
//     });

// Then "data" contained the target information!
