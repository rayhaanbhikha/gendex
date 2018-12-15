#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=7b70251d5170dec5ab90d9ad2623911f5f55c163\
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/rayhaanbhikha/gendex/tree/master