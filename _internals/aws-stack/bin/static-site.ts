#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { StaticSiteStack } from '../lib/static-site-stack';

const app = new cdk.App();

new StaticSiteStack(app, app.node.tryGetContext('stackName'), {
  domainName: app.node.tryGetContext('domainName'),
  certificateArn: app.node.tryGetContext('certificateArn'),
  forceDestroy: app.node.tryGetContext('forceDestroy'),
  hostedZoneId: app.node.tryGetContext('hostedZoneId'),
  siteContentsPath: app.node.tryGetContext('siteContentsPath'),
  subdomain: app.node.tryGetContext('subdomain'),

  responseBehaviors:
    JSON.parse(app.node.tryGetContext('responseBehaviors') || null, (k, v) => (
      // workaround to pass in security header behavior as JSON string
      (k === 'accessControlMaxAge') ? Duration.seconds(v) : v)),

  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  },
});
