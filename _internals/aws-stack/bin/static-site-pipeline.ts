#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { StaticSiteAppStage } from '../lib/static-site-app-stage';

const app = new cdk.App();
const cdkAppPath = process.cwd();

const sourceConnectionId = app.node.tryGetContext('sourceConnectionId');

const account = process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION;

new PipelineStack(app, 'StaticSitePipeline', {
  sourceConnectionArn:
    `arn:aws:codestar-connections:${region}:${account}:connection/${sourceConnectionId}`,
  sourceRepo: 'kevjallen/static-site',
  synthCommands: [
    'bundle install',
    'bundle exec jekyll build',
    `cd ${cdkAppPath}`,
    'npm install',
    'npm run cdk synth',
  ],
  appStages: [
    new StaticSiteAppStage(app, 'StaticSite-Preview-000', {
      siteContentsPath: '../../_site',
    }),
  ],
  buildImage: 'ubuntu-build:v1.1.2',
  installCommands: [
    '. $ASDF_SCRIPT && asdf install',
  ],
  pipelineName: 'static-site',
  synthCommandShell: 'bash',
  sourceBranch: 'cdk-pipelines',
  synthEnv: {
    ASDF_SCRIPT: '/root/.asdf/asdf.sh'
  },
  synthOutputDir: `${cdkAppPath}/cdk.out`,
});
