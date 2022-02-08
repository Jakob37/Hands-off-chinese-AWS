#!/bin/bash

endpoint=$1

json='{"id": "myId", "content": "some wise words"}'

echo "Hitting POST end point ${endpoint} with JSON ${json}"

curl \
    -H 'content-type: application/json' \
    -d "${json}" ${endpoint}
