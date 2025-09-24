pipeline {
    agent any

    tools {
        maven 'Maven-3.9.6' // Configure this in Jenkins Global Tool Configuration
        jdk 'JDK-21'        // Configure this in Jenkins Global Tool Configuration
    }

    environment {
        DOCKER_IMAGE = "demoblaze-selenium-tests"
        ALLURE_RESULTS = "target/allure-results"
        SLACK_CHANNEL = "#test-automation" // Configure your Slack channel
        JIRA_PROJECT = "TEST" // Configure your JIRA project key
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'smoke', 'regression', 'contact', 'cart', 'homepage'],
            description: 'Select test suite to run'
        )
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox'],
            description: 'Select browser for test execution'
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run tests in headless mode'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from repository..."
                }
                checkout scm

                // Send Slack notification
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: '#36A64F',
                    message: "🚀 Started test execution for ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}"
                )
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image for test execution..."
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    echo "🧪 Running tests in Docker container..."

                    // Determine test command based on parameters
                    def testCommand = "mvn clean test"

                    if (params.TEST_SUITE != 'all') {
                        switch(params.TEST_SUITE) {
                            case 'smoke':
                                testCommand += " -Dgroups=smoke"
                                break
                            case 'regression':
                                testCommand += " -Dgroups=regression"
                                break
                            case 'contact':
                                testCommand += " -Dtest=ContactModalTest"
                                break
                            case 'cart':
                                testCommand += " -Dtest=CartPageTest"
                                break
                            case 'homepage':
                                testCommand += " -Dtest=HomePageTest"
                                break
                        }
                    }

                    // Add browser and headless configuration
                    testCommand += " -Dselenide.browser=${params.BROWSER}"
                    if (params.HEADLESS) {
                        testCommand += " -Dselenide.headless=true"
                    }

                    sh """
                        docker run --rm \\
                            -v \$(pwd)/target:/app/target \\
                            -e SELENIDE_BROWSER=${params.BROWSER} \\
                            -e SELENIDE_HEADLESS=${params.HEADLESS} \\
                            ${DOCKER_IMAGE}:${BUILD_NUMBER} \\
                            ${testCommand}
                    """
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                script {
                    echo "📊 Generating Allure report..."

                    // Install Allure if not present
                    sh '''
                        if ! command -v allure &> /dev/null; then
                            echo "Installing Allure..."
                            curl -o allure-commandline.zip -Ls https://github.com/allure-framework/allure2/releases/latest/download/allure-commandline.zip
                            unzip -q allure-commandline.zip
                            sudo mv allure-* /opt/allure
                            sudo ln -s /opt/allure/bin/allure /usr/bin/allure
                            rm allure-commandline.zip
                        fi
                    '''

                    // Generate Allure report
                    sh "allure generate ${ALLURE_RESULTS} -o target/allure-report --clean"
                }
            }
        }

        stage('Publish Reports') {
            steps {
                script {
                    echo "📋 Publishing test reports..."

                    // Publish JUnit results
                    publishTestResults testResultsPattern: 'target/surefire-reports/*.xml'

                    // Publish Allure report
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'target/allure-results']]
                    ])
                }
            }
        }

        stage('JIRA Integration') {
            when {
                anyOf {
                    currentBuild.result == 'FAILURE'
                    currentBuild.result == 'UNSTABLE'
                }
            }
            steps {
                script {
                    echo "🐛 Creating JIRA ticket for failed tests..."

                    def testResults = readFile('target/surefire-reports/TEST-*.xml')
                    def failedTests = sh(
                        script: "grep -o 'testcase.*failure' target/surefire-reports/TEST-*.xml | wc -l || echo 0",
                        returnStdout: true
                    ).trim()

                    if (failedTests.toInteger() > 0) {
                        jiraCreateIssue(
                            projectKey: env.JIRA_PROJECT,
                            issueType: 'Bug',
                            summary: "Automated Test Failures - Build #${BUILD_NUMBER}",
                            description: """
                                Automated tests failed in build #${BUILD_NUMBER}

                                *Failed Tests Count:* ${failedTests}
                                *Build URL:* ${BUILD_URL}
                                *Allure Report:* ${BUILD_URL}allure/

                                Please investigate and fix the failing tests.
                            """,
                            priority: 'High'
                        )
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up Docker images..."
                sh "docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER} || true"

                // Archive artifacts
                archiveArtifacts artifacts: 'target/logs/*.log, target/screenshots/*.png', allowEmptyArchive: true
            }
        }

        success {
            script {
                def testResults = sh(
                    script: "find target/surefire-reports -name '*.xml' -exec grep -l 'failures=\"0\" errors=\"0\"' {} \\; | wc -l || echo 0",
                    returnStdout: true
                ).trim()

                // Slack success notification
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'good',
                    message: """
                        ✅ *Test Execution Successful!*

                        *Job:* ${env.JOB_NAME}
                        *Build:* #${env.BUILD_NUMBER}
                        *Test Suite:* ${params.TEST_SUITE}
                        *Browser:* ${params.BROWSER}
                        *Duration:* ${currentBuild.durationString}
                        *Allure Report:* ${BUILD_URL}allure/
                    """
                )

                // Email success notification
                emailext(
                    subject: "✅ Test Execution Successful - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <h2>Test Execution Completed Successfully!</h2>
                        <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                        <p><strong>Build Number:</strong> #${env.BUILD_NUMBER}</p>
                        <p><strong>Test Suite:</strong> ${params.TEST_SUITE}</p>
                        <p><strong>Browser:</strong> ${params.BROWSER}</p>
                        <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                        <p><strong>View Allure Report:</strong> <a href="${BUILD_URL}allure/">Click here</a></p>
                    """,
                    mimeType: 'text/html',
                    to: '$DEFAULT_RECIPIENTS'
                )
            }
        }

        failure {
            script {
                // Slack failure notification
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'danger',
                    message: """
                        ❌ *Test Execution Failed!*

                        *Job:* ${env.JOB_NAME}
                        *Build:* #${env.BUILD_NUMBER}
                        *Test Suite:* ${params.TEST_SUITE}
                        *Browser:* ${params.BROWSER}
                        *Duration:* ${currentBuild.durationString}
                        *Console Output:* ${BUILD_URL}console
                        *Allure Report:* ${BUILD_URL}allure/
                    """
                )

                // Email failure notification
                emailext(
                    subject: "❌ Test Execution Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <h2>Test Execution Failed!</h2>
                        <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                        <p><strong>Build Number:</strong> #${env.BUILD_NUMBER}</p>
                        <p><strong>Test Suite:</strong> ${params.TEST_SUITE}</p>
                        <p><strong>Browser:</strong> ${params.BROWSER}</p>
                        <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                        <p><strong>View Console Output:</strong> <a href="${BUILD_URL}console">Click here</a></p>
                        <p><strong>View Allure Report:</strong> <a href="${BUILD_URL}allure/">Click here</a></p>
                        <p>Please check the logs and fix the issues.</p>
                    """,
                    mimeType: 'text/html',
                    to: '$DEFAULT_RECIPIENTS',
                    attachLog: true
                )
            }
        }

        unstable {
            script {
                // Slack unstable notification
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'warning',
                    message: """
                        ⚠️ *Test Execution Unstable!*

                        *Job:* ${env.JOB_NAME}
                        *Build:* #${env.BUILD_NUMBER}
                        *Test Suite:* ${params.TEST_SUITE}
                        *Browser:* ${params.BROWSER}
                        *Duration:* ${currentBuild.durationString}
                        *Allure Report:* ${BUILD_URL}allure/

                        Some tests may have failed. Please review the results.
                    """
                )
            }
        }
    }
}