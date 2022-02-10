#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 target_domain"
}

function e2e-testing {
  if [[ ! $# -eq 1 ]]; then
    echo "invalid arguments (expected exactly 1, got $#)"
    usage; return 1
  fi

  RESPONSE_CODE=$(curl --silent --output /dev/null --write-out "%{http_code}" "$1")
  if [[ "$RESPONSE_CODE" -ne "200" ]]; then 
    echo "expected response code 200 (received $RESPONSE_CODE)"
    return 1; 
  fi
}

e2e-testing "$@"
