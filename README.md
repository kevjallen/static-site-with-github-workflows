# Static website demo

This repository demonstrates CI/CD for a static website

## Using this repository

### Environments

Three "environments" are included:
- Integration: transient sites that are deployed, tested, and destroyed during workflow runs
- Preview: the "staging" site that is deployed following successful integration
- Production: the main site that contains the latest end-user features

### Secrets

Some secrets must be added to the repository for the workflows to function:
- `AWS_ACCESS_KEY_ID`: identifier of the IAM user key to perform deployments with
- `AWS_SECRET_ACCESS_KEY`: the IAM user key to perform deployments with
- `AWS_ACCOUNT_ID`: identifier of the AWS account being deployed to
- `AWS_DEFAULT_REGION`: name of the AWS region being deployed to

These secrets may be set within individual environments or at the repository level

### Release workflow

The behavior of this workflow depends on the event that triggered it:
- **Pull request event**: 
  - Runs only the build and integration jobs
- **Push event**: 
  - Runs the full workflow (build, integration, release, deployment)
- **Manual start (with version)**: 
  - Runs only the deployment jobs with specified version
- **Manual start (without version)**:
  - Runs the full workflow if a version is not detected for HEAD / latest commit
    - Otherwise, runs the deployment jobs with detected version
