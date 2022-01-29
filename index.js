const cowsay = require("cowsay");
exports.handler = function(event, context) {
    // Get a cow from cowsay!
    let cow = cowsay.say({
        text: "I'm a lambda moooodule",
        e: "oO",
        T: "U "
    });
// Replace line breaks to HTML line breaks
    cow = cow.replace(/[\n|\r|\n\r]/g, '<br />');
// Create the HTML
    var html = '<html><head><title>Cowsay Lambda!</title></head>' + 
        `<body><h1>Welcome to Cowsay Lambda!</h1>${cow}</body></html>`;
    
    // Return the HTML response
    context.succeed(html);
};
