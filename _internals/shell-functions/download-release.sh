#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 github_repo release file_name [target_file]"
}

function download-release {
  if [[ ! $# -ge 3 ]]; then
    echo "invalid arguments (expected at least 3, got $#)"
    usage; return 1
  fi

  local github_repo="$1"
  local release="$2"
  local file_name="$3"
  local dest="${4:-$ARTIFACT_PATH}"

  local repo_url="$GITHUB_SERVER_URL/${github_repo}"

  curl "${repo_url}/releases/download/${release}/${file_name}" \
    -L -o "${dest}" --create-dirs
}

download-release "$@"
