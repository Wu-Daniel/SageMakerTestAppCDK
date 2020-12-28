import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';

import * as s3 from '@aws-cdk/aws-s3';

import * as ecr from '@aws-cdk/aws-ecr';

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

export class SagemakerTestAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: 'MyAppPipeline',
      cloudAssemblyArtifact,

      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('wudys_github_token'),
        trigger: codepipeline_actions.GitHubTrigger.POLL,
        // Replace these with your actual GitHub project info
        owner: 'Wu-Daniel',
        repo: 'SageMakerTestAppCDK',
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,

        // Use this if you need a build step (if you're not using ts-node
        // or if you have TypeScript Lambdas that need to be compiled).
        buildCommand: 'npm run build',
      }),
    });

    new s3.Bucket(this, 'TestBucket', {
      versioned: true
    })

    new ecr.Repository(this, 'PythonRepository', {
      repositoryName: 'python-image-test-repository'
    })
  }
}