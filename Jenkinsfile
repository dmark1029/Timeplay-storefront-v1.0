@Library('pipeline-library@release/1.0.0') _

node {
  withEnv([
    'PROJECT_KEY=ships',
    'REPO_NAME=ships-web-client',
    'BUILD_DIR=./build',
    ]) {
    git credentialsId: 'jenkins-service-account-rsa',
        branch: 'master',
        url: 'ssh://git@git-ssh.timeplay.com/ships/ships-pipelines.git'
    
    load 'frontend/js'
  }
}
