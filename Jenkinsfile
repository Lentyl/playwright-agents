pipeline {
    agent {
        label 'jenkins08'
    }
    options {
        skipDefaultCheckout(true)
    }
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
                script {
                    env.COMPOSE_CLEANUP_FILE = "${pwd(tmp: true)}/docker-compose.yml"
                }
                sh 'cp "$WORKSPACE/docker-compose.yml" "$COMPOSE_CLEANUP_FILE"'
            }
        }
        stage('Run Playwright Tests') {
            steps {
                sh '''
                    export JENKINS_UID=$(id -u) JENKINS_GID=$(id -g)
                    test -f "$WORKSPACE/docker-compose.yml"
                    docker-compose -f "$WORKSPACE/docker-compose.yml" run --rm --no-deps --user root --entrypoint sh playwright -c "chmod 1777 /app/test-results"
                    docker-compose -f "$WORKSPACE/docker-compose.yml" up --abort-on-container-exit --exit-code-from playwright
                '''
            }
        }
    }
    post {
        always {
            script {
                def cleanupConfigStatus = sh(returnStatus: true, script: 'test -f "$COMPOSE_CLEANUP_FILE"')
                if (cleanupConfigStatus == 0) {
                    def composeDownStatus = sh(returnStatus: true, script: 'export JENKINS_UID=$(id -u) JENKINS_GID=$(id -g); docker-compose --project-directory "$WORKSPACE" -f "$COMPOSE_CLEANUP_FILE" down --volumes')
                    if (composeDownStatus != 0) {
                        echo "docker-compose down failed with status ${composeDownStatus}"
                    }
                } else {
                    echo 'Skipping docker-compose cleanup because its saved configuration is unavailable'
                }
            }
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
        }
    }
}
