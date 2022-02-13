#!/bin/bash

req_params=3
if [ "$#" -ne ${req_params} ]; then
    echo "Illegal number of parameters, found: $#, required: ${req_params}"
    echo "postjson.sh [endpoint] [id] [message]" 
    exit 2
fi

endpoint=$1
id=$2
message=$3

json="{\"id\": \"${id}\", \"content\": \"${message}\"}"
# json='{"id": "myId", "content": "some wise words"}'

echo "Hitting POST end point ${endpoint} with JSON ${json}"

curl \
    -H 'content-type: application/json' \
    -d "${json}" ${endpoint}
