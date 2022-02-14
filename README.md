# Static website demo

This repository demonstrates CI/CD for a static website.

## Notable dependencies

- **Jekyll**: Static site generator
- **GitHub actions**: Automation platform
- **AWS CDK (TypeScript)**: Infrastructure as code

## Using this repository

### Bootstrapping AWS

The target AWS account/region pair must be bootstrapped for use with the CDK.

The `cdk bootstrap` command will grant admin rights to CloudFormation by default.
- Use the `--cloudformation-execution-policies` flag to assign lesser permissions.

### Environments

Three "environments" are included:
- Integration: transient sites that are deployed, tested, and destroyed during workflow runs
- Preview: the "staging" site that is deployed following successful integration
- Production: the main site that contains the latest end-user features

### Secrets

Some secrets must be added to the repository for the workflows to function:
- `AWS_ACCESS_KEY_ID`: ID of the IAM user key to start deployments with
- `AWS_SECRET_ACCESS_KEY`: the IAM user key to start deployments with
- `AWS_ACCOUNT_ID`: identifier of the AWS account being deployed to
- `AWS_DEFAULT_REGION`: name of the AWS region being deployed to

These secrets may be set within individual environments or at the repository level.

### Release workflow

The behavior of this workflow depends on the event that triggered it:
- **Pull request event**: Runs the build and integration jobs
- **Push event**: Runs the full workflow (build, integration, release, deployment)
- **Manual start (with version)**: Runs only the deployment jobs
- **Manual start (without version)**:
  - If the HEAD has a version, runs only the deployment jobs with that version
  - If the HEAD does not have a version, runs the full workflow
