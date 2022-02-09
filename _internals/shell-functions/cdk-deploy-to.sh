#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 aws_account aws_region [cdk_args]"
}

function cdk-deploy-to {
  if [[ ! $# -ge 2 ]]; then
    echo "invalid arguments (expected at least 2, got $#)"
    usage; return 1
  fi
  
  export CDK_DEPLOY_ACCOUNT=$1
  export CDK_DEPLOY_REGION=$2
  shift; shift

  local artifact
  artifact=$(realpath -e "$ARTIFACT_PATH") || return 1

  cd "$AWS_STACK_PATH"
  npm install && npm run cdk deploy -- "$@" -c siteContents="${artifact}"
}

cdk-deploy-to "$@"
