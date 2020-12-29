import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';

import * as ecr from '@aws-cdk/aws-ecr';

import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

export class PythonDockerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new codebuild.GitHubSourceCredentials(this, 'CodeBuildGitHubCreds', {
      accessToken: SecretValue.secretsManager('wudys_github_token'),
    });

    const pythonGithubSource = codebuild.Source.gitHub({
      owner: 'Wu-Daniel',
      repo: 'SimplePythonDockerImage',
      webhook: true
    });

    const ecrRepo = new ecr.Repository(this, 'PythonRepository', {
      repositoryName: 'simple-python-image-repository'
    })

    const pythonProject = new codebuild.Project(this, 'PythonProject', {
      projectName: 'pythonProject',
      source: pythonGithubSource,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
        privileged:true
      },
      environmentVariables: {
        'ECR_REPO_URI': {
          value: `${ecrRepo.repositoryUri}`
        }
      }
    })

  }
}