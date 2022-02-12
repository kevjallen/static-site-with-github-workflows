#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 cdk_synth_json"
}

function run-e2e-tests-on {
  if [[ ! $# -eq 1 ]]; then
    echo "invalid arguments (expected exactly 1, got $#)"
    usage; return 1
  fi

  local site_domain=$(echo "$1" | jq -r '.Outputs.SiteDomain.Value')

  # TODO: create a better demo for E2E testing
  RESPONSE_CODE=$(curl -L -s -o /dev/null --write-out "%{http_code}" "${site_domain}")
  if [[ "$RESPONSE_CODE" -ne "200" ]]; then 
    echo "expected response code 200 (received $RESPONSE_CODE)"
    return 1; 
  fi
}

run-e2e-tests-on "$@"
