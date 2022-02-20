#!/usr/bin/env node

const argparse = require("argparse");
const axios = require("axios").default;

const parser = new argparse.ArgumentParser({
    description: "Argparse example",
});

parser.add_argument("--endpoint", { help: "", required: true });
parser.add_argument("--id", {
    help: "If no ID is provided, one will be generated",
    default: null,
});
parser.add_argument("--user", {
    help: "If no user is provided, 'default'",
    default: "default",
});
parser.add_argument("--chinese", {
    help: "Chinese string",
    default: "中文的句子",
});
parser.add_argument("--english", {
    help: "English string",
    default: "English sentence",
});
parser.add_argument("--category", {
    help: "Category A",
    default: "Category A",
});
parser.add_argument("--make_polly", {
    help: "If assigned, also create a polly entry",
    default: false,
});

// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
String.prototype.hashCode = function () {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

const creation_time = String(Date.now());
const args = parser.parse_args();
const hashedId = Math.abs(`${args.chinese}${args.english}`.hashCode()).toString(
    16
);

const params = {
    id: hashedId,
    user: args.user,
    english: args.english,
    chinese: args.chinese,
    filenameenglish: `${args.english}.mp3`,
    filenamechinese: `${args.chinese}.mp3`,
    creationdate: creation_time,
    category: args.category,
};

const apiUrl = args.endpoint;

console.log("URL", apiUrl);
console.log(params);

axios
    .post(apiUrl, params)
    .then(function (response) {
        console.log("Response");
        console.log(response.data);
        console.log(Object.keys(response));
    })
    .catch(function (error) {
        console.log("error");
        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log("Unknown error type encountered");
            console.log(error);
        }
    });

if (args.make_polly) {
    console.log("To create Polly entry here...");

    const params = `{"text": "${text}", "voice": "${voice}", "prefix": "${prefix}"}`;

    axios
        .post(apiUrl, params)
        .then(function (response) {
            console.log("Polly response");
            console.log(response.data);
            console.log(Object.keys(response));
        })
        .catch(function (error) {
            console.log("Polly error");
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log("Unknown error encountered while processing Polly");
            }
        });
}
//     const pollyXhr = new XMLHttpRequest()
//     const isAsync = true
//     pollyXhr.open('POST', apiUrl, isAsync)
//     pollyXhr.setRequestHeader('Content-type', 'application/json')
//     pollyXhr.onreadystatechange = function (e) {
//         // @ts-ignore
//         // console.warn('response', e.target.response);
//         if (onReadyCall != null) {
//             onReadyCall()
//         }
//     }
//     pollyXhr.send(params)

//     return `${prefix}_${text}`
// }
