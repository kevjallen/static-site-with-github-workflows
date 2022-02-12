#! /usr/bin/env bash

if [[ -z "$ARTIFACT_PATH" ]]; then
  ARTIFACT_PATH='_artifact/site.zip'
fi

if [[ -z "$AWS_STACK_PATH" ]]; then
  AWS_STACK_PATH='_internals/aws-stack'
fi

if [[ -z "$GITHUB_SERVER_URL" ]]; then
  GITHUB_SERVER_URL='https://github.com'
fi

if [[ -f "$ARTIFACT_PATH" ]] && [[ -z "$SITE_CONTENTS_RELPATH" ]]; then
  SITE_CONTENTS_RELPATH=$(realpath --relative-to="$AWS_STACK_PATH" "$ARTIFACT_PATH")
fi

if [[ -z "$CDK_GLOBAL_ARGS" ]]; then
  if [[ ! -z "$SITE_CONTENTS_RELPATH" ]]; then
    CDK_GLOBAL_ARGS+=("-c" "siteContentsPath=$SITE_CONTENTS_RELPATH")
  fi
  CDK_GLOBAL_ARGS+=("--json")
fi
