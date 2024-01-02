#!/usr/bin/env groovy

pipeline {
  agent {
    docker {
      label 'docker && linux'
      image 'ghcr.visualon.de/visualon/builder:5.1.44@sha256:de34ab1e465c09082f8fec433ef961c077dcc2d8a31ed3b85c5be1cf68c5c1bf'
    }
  }

  environment {
    GITEA_CI_TOKEN = credentials('gitea-ci-token')
  }

  options {
    disableConcurrentBuilds(abortPrevious: true)
    parallelsAlwaysFailFast()
    timeout(time: 6, unit: 'HOURS')
    ansiColor('xterm')
    buildDiscarder logRotator(artifactDaysToKeepStr: env.BRANCH_NAME == 'main' ? '14' : '', numToKeepStr: env.BRANCH_NAME == 'main' ? '50' : '')
  }

  stages {
    stage('init') {
      steps {
        echo "Node: ${NODE_NAME}"
        discoverGitReferenceBuild()
      }
    }

    stage('setup') {
      options {
        timeout(time: 15, unit: 'MINUTES')
      }
      steps {
        echo "Node: ${NODE_NAME}"
        cache(maxCacheSize: 250, defaultBranch: 'main', caches: [arbitraryFileCache(path: '.pnpm-store', cacheValidityDecidingFile: 'pnpm-lock.yaml', compressionMethod: 'TAR_ZSTD')]) {
          sh 'pnpm install'
        }
      }
    }

    stage('lint') {
      options {
        timeout(time: 10, unit: 'MINUTES')
      }
      steps {
        // sh 'yarn type-check'
        sh 'pnpm lint:prettier'
        // sh 'yarn lint:eslint --format checkstyle -o coverage/eslint.xml' TODO: fix linting OOM
      }
      // post {
      //   always {
      //     recordIssues enabledForFailure: true, tool: esLint(pattern: 'coverage/eslint.xml'), trendChartType: 'AGGREGATION_ONLY'
      //   }
      // }
    }

    stage('publish-packages') {

      options {
        timeout(time: 15, unit: 'MINUTES')
      }

      when {
        buildingTag()
      }

      environment {
        GITEA_TOKEN = credentials('gitea-ci-token')
      }

      steps {
        sh 'echo \'//forgejo.visualon.de/api/packages/vt/npm/:_authToken=${GITEA_TOKEN}\' >> ~/.npmrc'
        sh 'pnpm version ${TAG_NAME#v}'
        sh 'pnpm publish'
        sh 'pnpm start'
      }
    }

  }
}

