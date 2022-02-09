#! /bin/bash

if [[ -z "$ARTIFACT_PATH" ]]; then
  ARTIFACT_PATH='_artifact/site.zip'
fi

if [[ -z "$AWS_STACK_PATH" ]]; then
  AWS_STACK_PATH='_internals/aws-stack'
fi

if [[ -z "${GITHUB_SERVER_URL}" ]]; then
  GITHUB_SERVER_URL='https://github.com'
fi
