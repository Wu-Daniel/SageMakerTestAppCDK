#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SagemakerTestAppStack } from '../lib/sagemaker_test_app-stack';
import { PythonDockerStack } from '../lib/python_docker_stack';

const app = new cdk.App();
new SagemakerTestAppStack(app, 'SagemakerTestAppStack', {
    env: {
        account: '752838613337',
        region: 'us-west-2'
    }
});

new PythonDockerStack(app, 'PythonDockerStack', {
    env: {
        account: '752838613337',
        region: 'us-west-2'
    }
})

app.synth();
