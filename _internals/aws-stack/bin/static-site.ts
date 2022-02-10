#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from '../lib/static-site-stack';
import { Duration } from 'aws-cdk-lib';

const app = new cdk.App();

const stackName = app.node.tryGetContext('stackName')

new StaticSiteStack(app, stackName, {
  domainName: app.node.tryGetContext('domainName'),
  preserveBucket: app.node.tryGetContext('preserveBucket'),
  siteContents: app.node.tryGetContext('siteContents'),
  subdomain: app.node.tryGetContext('subdomain') || stackName.toLowerCase(),

  customHeadersBehavior: 
    JSON.parse(app.node.tryGetContext('customHeadersBehavior') || null),

  securityHeadersBehavior: 
    JSON.parse(app.node.tryGetContext('securityHeadersBehavior') || null, (k, v) => {
      // workaround to pass in security headers behavior as JSON string
      return (k == 'accessControlMaxAge') ? Duration.seconds(v) : v
    }),

  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
  }
});
