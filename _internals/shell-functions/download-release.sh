#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 github_repo release"
}

function download-release {
  if [[ ! $# -eq 2 ]]; then
    echo "invalid arguments (expected exactly 2, got $#)"
    usage; return 1
  fi

  local github_repo="$1"
  local release="$2"

  local repo_url="${GITHUB_SERVER_URL}/${github_repo}"
  local file_name=$(basename "${ARTIFACT_PATH}")

  curl "${repo_url}/releases/download/${release}/${file_name}" \
    -L -o "${ARTIFACT_PATH}" --create-dirs
}

download-release "$@"
