#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

const account = process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION;

const sourceConnectionId = app.node.tryGetContext('sourceConnectionId');
const stackName = app.node.tryGetContext('stackName');

new PipelineStack(app, stackName, {
  sourceConnectionArn:
    `arn:aws:codestar-connections:${region}:${account}:connection/${sourceConnectionId}`,
  sourceRepo: app.node.tryGetContext('sourceRepo'),
  synthCommands: [
    '_internals/shell-functions/create-artifact.sh',
    'export CDK_CONTEXT_SCRIPT=_internals/shell-functions/context-args-from.sh',
    'export CDK_PIPELINE_CONTEXT=_internals/pipeline-contexts/_common.json',
    'export CDK_CONTEXT_ARGS=$($CDK_CONTEXT_SCRIPT $CDK_PIPELINE_CONTEXT)',
    'export CDK_RUN_SCRIPT=_internals/shell-functions/npm-run-cdk.sh',
    `$CDK_RUN_SCRIPT ${account} ${region} synth $CDK_CONTEXT_ARGS`
  ],

  pipelineName: app.node.tryGetContext('pipelineName') || stackName,
  sourceBranch: app.node.tryGetContext('sourceBranch'),
  synthAptDeps: [
    'autoconf',
    'bison',
    'build-essential',
    'libssl-dev',
    'libyaml-dev',
    'libreadline6-dev',
    'zlib1g-dev',
    'libncurses5-dev',
    'libffi-dev',
    'libgdbm6',
    'libgdbm-dev', 
    'libdb-dev'
  ],
  synthOutputDir: app.node.tryGetContext('synthOutputDir'),

  env: {
    account,
    region
  }
});
