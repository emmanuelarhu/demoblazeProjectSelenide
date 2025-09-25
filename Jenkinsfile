pipeline {
    agent {
        label 'linux-agent'
    }

    triggers {
        githubPush()
    }

    environment {
        DOCKER_IMAGE = 'demoblaze-selenium-tests'
        ALLURE_RESULTS = "target/allure-results"
        SLACK_CHANNEL = "#test-automation"
        JIRA_PROJECT = "TEST"
    }

    parameters {
        choice(
            name: 'TEST_TYPE',
            choices: ['all', 'junit-only', 'bdd-only'],
            description: 'Select test type to run (all tests, JUnit only, or BDD only)'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'smoke', 'regression', 'cart', 'homepage', 'contact', 'orderplacement'],
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
                    echo "Test Type: ${params.TEST_TYPE}, Test Suite: ${params.TEST_SUITE}, Browser: ${params.BROWSER}"

                    def testCommands = []

                    // Build JUnit command
                    if (params.TEST_TYPE == 'all' || params.TEST_TYPE == 'junit-only') {
                        def junitCommand = "mvn test"
                        if (params.TEST_SUITE != 'all') {
                            switch(params.TEST_SUITE) {
                                case 'contact':
                                    junitCommand += " -Dtest=tests.ContactModalTest"
                                    break
                                case 'cart':
                                    junitCommand += " -Dtest=tests.CartPageTest"
                                    break
                                case 'homepage':
                                    junitCommand += " -Dtest=tests.HomePageTest"
                                    break
                                case 'orderplacement':
                                    junitCommand += " -Dtest=tests.OrderPlacementTest"
                                    break
                                case 'smoke':
                                case 'regression':
                                    junitCommand += " -Dtest=tests.*Test"
                                    break
                            }
                        }
                        junitCommand += " -Dselenide.browser=${params.BROWSER}"
                        if (params.HEADLESS) {
                            junitCommand += " -Dselenide.headless=true"
                        }
                        testCommands.add(junitCommand)
                    }

                    // Build BDD command
                    if (params.TEST_TYPE == 'all' || params.TEST_TYPE == 'bdd-only') {
                        def bddCommand = "mvn test -Dtest=runners.CucumberTestRunner"
                        if (params.TEST_SUITE != 'all') {
                            switch(params.TEST_SUITE) {
                                case 'smoke':
                                    bddCommand += " -Dcucumber.filter.tags=\"@Smoke\""
                                    break
                                case 'regression':
                                    bddCommand += " -Dcucumber.filter.tags=\"@regression\""
                                    break
                                case 'cart':
                                    bddCommand += " -Dcucumber.filter.tags=\"@Cart\""
                                    break
                                case 'homepage':
                                    bddCommand += " -Dcucumber.filter.tags=\"@HomePage\""
                                    break
                                case 'contact':
                                    bddCommand += " -Dcucumber.filter.tags=\"@Contact\""
                                    break
                                case 'orderplacement':
                                    bddCommand += " -Dcucumber.filter.tags=\"@OrderPlacement\""
                                    break
                            }
                        }
                        bddCommand += " -Dselenide.browser=${params.BROWSER}"
                        if (params.HEADLESS) {
                            bddCommand += " -Dselenide.headless=true"
                        }
                        testCommands.add(bddCommand)
                    }

                    // Execute all test commands
                    def allCommands = testCommands.join(' && ')

                    sh """
                        docker run --rm \\
                            -v \$(pwd)/target:/app/target \\
                            --shm-size=2g \\
                            -e DISPLAY=:99 \\
                            ${DOCKER_IMAGE}:${BUILD_NUMBER} \\
                            sh -c "Xvfb :99 -screen 0 1920x1080x24 & ${allCommands}"
                    """
                }
            }
        }

        stage('Generate Reports') {
            steps {
                script {
                    echo "📊 Generating test reports..."

                    // Generate Cucumber HTML reports first (if BDD tests were run)
                    if (params.TEST_TYPE == 'all' || params.TEST_TYPE == 'bdd-only') {
                        sh 'mvn verify || true'  // Continue even if some tests failed
                    }

                    // Allure is already installed in Docker image, so we can generate directly
                    sh """
                        if [ -d "target/allure-results" ] && [ "\$(ls -A target/allure-results)" ]; then
                            allure generate target/allure-results -o target/allure-report --clean
                            echo "📊 Allure report generated successfully"
                        else
                            echo "⚠️ No Allure results found - creating empty report"
                            mkdir -p target/allure-report
                            echo '<h1>No test results available</h1>' > target/allure-report/index.html
                        fi
                    """
                }
            }
        }

        stage('Publish Reports') {
            steps {
                script {
                    echo "📋 Publishing test reports..."

                    // Publish JUnit results (works for both traditional JUnit and Cucumber XML reports)
                    publishTestResults testResultsPattern: 'target/surefire-reports/*.xml, target/cucumber-reports/*.xml'

                    // Publish Allure report (includes both JUnit and BDD results)
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'target/allure-results']]
                    ])

                    // Archive additional reports
                    archiveArtifacts artifacts: 'target/cucumber-reports/cucumber-html-report.html, target/allure-report/index.html', allowEmptyArchive: true
                }
            }
        }

        stage('JIRA Integration') {
            when {
                anyOf {
                    expression { currentBuild.result == 'FAILURE' }
                    expression { currentBuild.result == 'UNSTABLE' }
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
                        *Test Type:* ${params.TEST_TYPE}
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
                        <p><strong>Test Type:</strong> ${params.TEST_TYPE}</p>
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
                        *Test Type:* ${params.TEST_TYPE}
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
                        <p><strong>Test Type:</strong> ${params.TEST_TYPE}</p>
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
                        *Test Type:* ${params.TEST_TYPE}
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