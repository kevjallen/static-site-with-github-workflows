#! /bin/bash

[[ -z "$ARTIFACT_PATH" ]] && {
  ARTIFACT_PATH='_artifact/site.zip'
}

[[ -z "$AWS_STACK_PATH" ]] && {
  AWS_STACK_PATH='_internals/aws-stack'
}

[[ -z "$GITHUB_SERVER_URL" ]] && {
  GITHUB_SERVER_URL='https://github.com'
}

[[ -z "$SITE_CONTENTS_RELPATH" ]] && {
  SITE_CONTENTS_RELPATH=$(realpath --relative-to="$AWS_STACK_PATH" "$ARTIFACT_PATH")
}

[[ -z "${CDK_GLOBAL_ARGS[@]}"]] && {
  CDK_GLOBAL_ARGS+=("-c" "siteContentsPath=$SITE_CONTENTS_RELPATH")
  CDK_GLOBAL_ARGS+=("--json")
}
