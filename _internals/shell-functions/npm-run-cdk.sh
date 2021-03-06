#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 command aws_account aws_region [cdk_args]"
}

function npm-run-cdk {
  if [[ ! $# -ge 3 ]]; then
    echo "invalid arguments (expected at least 3, got $#)"
    usage; return 1
  fi

  local command="$1"
  export CDK_DEPLOY_ACCOUNT="$2"
  export CDK_DEPLOY_REGION="$3"
  shift; shift; shift

  cd "$AWS_STACK_PATH"
  npm install > /dev/null
  npm run --silent cdk "${command}" -- "$@" "${CDK_GLOBAL_ARGS[@]}"
}

npm-run-cdk "$@"
