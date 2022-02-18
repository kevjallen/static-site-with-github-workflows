import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';

export interface PipelineStackProps extends StackProps {
  sourceConnectionArn: string
  sourceRepo: string
  synthCommands: string[]

  pipelineName?: string
  sourceBranch?: string
  synthAptDeps?: string[]
  synthOutputDir?: string
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);
    
    const sourceBranch = props.sourceBranch || 'master';

    const systemSetupCommands = !props.synthAptDeps ? [] : [
      `apt-get update && apt-get install ${props.synthAptDeps.join(' ')}`
    ];
    const toolSetupCommands = [
      'apt-get update && apt-get install git curl',
      'git clone $ASDF_REPO $HOME/.asdf --branch $ASDF_VERSION',
      'source $HOME/.asdf/asdf.sh && asdf install'
    ];

    const pipeline = new CodePipeline(this, 'SitePipeline', {
      pipelineName: props.pipelineName,
      synth: new CodeBuildStep('Synth', {
        input: CodePipelineSource.connection(props.sourceRepo, sourceBranch, {
          connectionArn: props.sourceConnectionArn
        }),
        projectName: 
          props.pipelineName ? `${props.pipelineName}-synth` : undefined,
        env: {
          ASDF_REPO: 'https://github.com/asdf-vm/asdf.git',
          ASDF_VERSION: 'v0.9.0',
        },
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_5_0
        },
        installCommands: [
          ...systemSetupCommands,
          ...toolSetupCommands
        ],
        commands: props.synthCommands,
        primaryOutputDirectory: props.synthOutputDir
      })
    });
  }
}
