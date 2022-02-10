#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as pokemon from 'pokemon';

import { StaticSiteStack } from '../lib/static-site-stack';
import { Duration } from 'aws-cdk-lib';

const app = new cdk.App();

new StaticSiteStack(app, app.node.tryGetContext('stackName'), {
  // name of hosted zone to create a record in
  domainName: app.node.tryGetContext('domainName'),
  // subdomain within the hosted zone or random pokemon
  subdomain: app.node.tryGetContext('subdomain') || 
    pokemon.random().toLowerCase(),
  // path to folder or archive containing the site
  siteContents: app.node.tryGetContext('siteContents'),

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
