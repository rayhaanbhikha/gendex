#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=75a40e98ac7a5b15fb3eb9227cf340132e41ae5a\
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/rayhaanbhikha/gendex/tree/master