#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 variable cdk_context_json1 [cdk_context_json2] ..."
}

function context-args-from {
  if [[ ! $# -ge 1 ]]; then
    echo "invalid arguments (expected at least 1, got $#)"
    usage; return 1
  fi

  local context="{}"
  while [[ ! -z "$1" ]]; do
    context=$(jq -s '.[0] * .[1]' <(echo "${context}") "$1"); shift
  done

  local context_pairs
  context_pairs=$(jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' \
    <(echo "${context}")) || return 1

  while read -r line; do 
    context_args+=("-c" "'${line}'"); 
  done <<< "${context_pairs}"

  echo "${context_args[@]}"
}

context-args-from "$@"
