#! /usr/bin/env bash

source _internals/defaults.sh

function usage {
  echo "usage: $0 github_repo action_run src_artifact dest_folder"
}

function download-artifact {
  if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "could not find 'GITHUB_TOKEN' in the environment"
    return 1
  fi

  if [[ ! $# -eq 4 ]]; then
    echo "invalid arguments (expected exactly 4, got $#)"
    usage; return 1
  fi

  local github_repo="$1"
  local action_run="$2"
  local src_artifact="$3"
  local dest_folder="$4"

  local github_repo_endpoint="$GITHUB_API_ENDPOINT/repos/${github_repo}"
  if [[ "$(curl "${github_repo_endpoint}" | jq -r '.id')" == "null" ]]; then
    echo "could not find any repo called '${github_repo}'"
    return 1
  fi

  local action_run_endpoint="${github_repo_endpoint}/actions/runs/${action_run}"
  if [[ "$(curl "${action_run_endpoint}" | jq -r '.id')" == "null" ]]; then
    echo "could not find run '${action_run}' within repo '${github_repo}'"
    return 1
  fi

  local artifact_data
  artifact_data=$(curl "${action_run_endpoint}/artifacts")

  if [[ "$(echo "${artifact_data}" | jq -r '.total_count')" == "null" ]]; then
    echo "could not get artifact data for run '${action_run}'"
    echo "${artifact_data}" | jq -r .
    return 1
  fi

  local artifacts_with_name
  artifacts_with_name=$(echo "${artifact_data}" | \
    jq -r --arg NAME "${src_artifact}" '.artifacts | select(.[].name == $NAME)')

  local latest_artifact_with_name
  latest_artifact_with_name=$(echo ${artifacts_with_name} | \
    jq -r '. |= sort_by(.created_at) | last')

  if [[ -z "${latest_artifact_with_name}" ]]; then
    echo "could not find artifact '${src_artifact}' within run '${action_run}'"
    return 1
  fi

  local artifact_download_url
  artifact_download_url=$(echo ${latest_artifact_with_name} | \
    jq -r '.archive_download_url')

  local zipped_artifact
  zipped_artifact=$(mktemp -d)/artifact.zip

  curl -L -H "Authorization: token $GITHUB_TOKEN" -o ${zipped_artifact} \
    "${artifact_download_url}"
  
  if [[ "$(file -b --mime-type ${zipped_artifact})" != "application/zip" ]]; then
    echo "could not download artifact from '${artifact_download_url}'"
    echo "ensure your token is valid and has required scope"
    return 1
  fi

  unzip "${zipped_artifact}" -d "${dest_folder}"
}

download-artifact "$@"
