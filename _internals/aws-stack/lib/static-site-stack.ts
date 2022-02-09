import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as deploy from 'aws-cdk-lib/aws-s3-deployment';


interface StaticSiteStackProps extends StackProps {
  domainName: string,
  siteContents: string,
  subdomain: string

  customHeadersBehavior?: cloudfront.ResponseCustomHeadersBehavior
  securityHeadersBehavior?: cloudfront.ResponseSecurityHeadersBehavior
}

export class StaticSiteStack extends Stack {
  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, 'Zone', { 
      domainName: props.domainName 
    });
    const siteDomain = props.subdomain + '.' + props.domainName;

    const oai = new cloudfront.OriginAccessIdentity(this, 'SiteOAI');
    const oaiS3CanonicalUserId = oai.cloudFrontOriginAccessIdentityS3CanonicalUserId;

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [bucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(oaiS3CanonicalUserId)]
    }));
    new CfnOutput(this, 'BucketName', { value: bucket.bucketName });

    const certificate = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
      domainName: siteDomain,
      hostedZone: zone,
      region: 'us-east-1',
    });
    new CfnOutput(this, 'CertificateArn', { value: certificate.certificateArn });

    const headers = new cloudfront.ResponseHeadersPolicy(this, 'SiteHeaders', {
      customHeadersBehavior: props.customHeadersBehavior,
      securityHeadersBehavior: props.securityHeadersBehavior
    });

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      certificate,
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, { originAccessIdentity: oai }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy: headers
      },
      defaultRootObject: 'index.html',
      domainNames: [siteDomain]
    });
    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });

    new deploy.BucketDeployment(this, 'SiteDeployment', {
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
      sources: [deploy.Source.asset(props.siteContents)],
    });
  }
}
