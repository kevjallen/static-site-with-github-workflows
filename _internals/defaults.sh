#! /bin/bash

if [[ -z "$ARTIFACT_PATH" ]]; then
  ARTIFACT_PATH='_artifact/site.zip'
fi

if [[ -z "$AWS_STACK_PATH" ]]; then
  AWS_STACK_PATH='_internals/aws-stack'
fi

if [[ -z "$GITHUB_API_ENDPOINT" ]]; then
  GITHUB_API_ENDPOINT="https://api.github.com"
fi
