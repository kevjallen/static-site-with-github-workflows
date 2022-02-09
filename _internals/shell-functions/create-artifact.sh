#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 [target_file]"
}

function create-artifact {
  if [[ ! $# -le 1 ]]; then
    echo "invalid arguments (expected at most 1, got $#)"
    usage; return 1
  fi

  bundle install

  local site
  site=$(mktemp -d)
  bundle exec jekyll build -d "${site}"

  local dest
  dest=$(realpath -m "${1:-$ARTIFACT_PATH}")
  mkdir -p $(dirname "${dest}"})

  cd "${site}" && zip -r "${dest}" .
}

create-artifact "$@"
