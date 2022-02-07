exports.handler = async function (event) {
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello world - towards Chinese learning\n`,
    };
};
