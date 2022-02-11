# Static website demo

This repository demonstrates CI/CD for a static website

## Using this repository

### Environments

Three "environments" are included:
- Integration: transient sites that are deployed, tested, and destroyed during workflow runs
- Preview: the staging site that is deployed to following successful integration
- Production: the main site that contains the latest end-user features

### Secrets

Some secrets must be added to the repository for the workflows to function:
- `AWS_ACCESS_KEY_ID`: identifier of the IAM user key to perform deployments with
- `AWS_SECRET_ACCESS_KEY`: the IAM user key to perform deployments with
- `AWS_ACCOUNT_ID`: identifier of the AWS account being deployed to
- `AWS_DEFAULT_REGION`: identifier of the AWS region being deployed to

These secrets may be set within individual environments or at the repository level
