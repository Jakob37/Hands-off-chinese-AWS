#!/usr/bin/env node

// import { ArgumentParser } from "argparse";
const argparse = require("argparse");
const axios = require("axios").default;

// import pkg from "axios";
// const { axios } = pkg;

// const { ArgumentParser } = require("argparse");
// const { ArgumentParser } = require("argparse");

const parser = new argparse.ArgumentParser({
    description: "Argparse example",
});

parser.add_argument("--endpoint", { help: "", required: true });
parser.add_argument("--id", { help: "adsd", default: "adsd" });
parser.add_argument("--text", { help: "file1", default: "file1" });
parser.add_argument("--filename", { help: "file1", default: "file1" });
parser.add_argument("--creationdate", { help: "1111", default: "1111" });
parser.add_argument("--category", {
    help: "Category A",
    default: "Category A",
});
parser.add_argument("--language", {
    help: "'chinese' or 'english'",
    default: "Chinese",
});
parser.add_argument("--action", { help: "add", default: "add" });

const args = parser.parse_args();

const params = {
    id: args.id,
    text: args.text,
    // filename: args.filename,
    // creationdate: args.creationdate,
    // category: args.category,
    // language: args.language,
    // action: args.action,
};

// console.dir(parser.parse_args());

const apiUrl = args.endpoint;

console.log("URL", apiUrl);
console.log(params);

axios
    .post(apiUrl, params)
    .then(function (response) {
        console.log("Response");
        console.log(response);
    })
    .catch(function (error) {
        console.log("error");
        if (error.response) {
            console.log(error.response.data);
        }
        // console.log(error);
    });

// const apiTestXhr = new XMLHttpRequest();
// const isAsync = true;
// apiTestXhr.open("PUT", apiUrl, isAsync);
// apiTestXhr.setRequestHeader("Content-type", "application/json");
// apiTestXhr.onreadystatechange = (e) => {
//     // @ts-ignore
//     // console.log("response", e.target.response)
// };
// const result = await apiTestXhr.send(params);
// return result;
// console.log(result);
