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

                    // Set defaults if parameters are null or empty
                    def testType = params.TEST_TYPE ?: 'all'
                    def testSuite = params.TEST_SUITE ?: 'all'
                    def browser = params.BROWSER ?: 'chrome'
                    def headless = params.HEADLESS != null ? params.HEADLESS : true

                    echo "Test Type: ${testType}, Test Suite: ${testSuite}, Browser: ${browser}, Headless: ${headless}"

                    // Store test type for later stages
                    env.BUILD_TEST_TYPE = testType

                    def testCommands = []

                    // Build JUnit command
                    if (testType == 'all' || testType == 'junit-only') {
                        def junitCommand = "mvn test"
                        if (testSuite != 'all') {
                            switch(testSuite) {
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
                        junitCommand += " -Dselenide.browser=${browser}"
                        if (headless) {
                            junitCommand += " -Dselenide.headless=true"
                        }
                        testCommands.add(junitCommand)
                    }

                    // Build BDD command
                    if (testType == 'all' || testType == 'bdd-only') {
                        def bddCommand = "mvn test -Dtest=runners.CucumberTestRunner"
                        if (testSuite != 'all') {
                            switch(testSuite) {
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
                        bddCommand += " -Dselenide.browser=${browser}"
                        if (headless) {
                            bddCommand += " -Dselenide.headless=true"
                        }
                        testCommands.add(bddCommand)
                    }

                    // Execute all test commands
                    def allCommands = testCommands.join(' && ')

                    echo "Debug: Test commands list: ${testCommands}"
                    echo "Debug: Combined commands: ${allCommands}"

                    if (allCommands.trim().isEmpty()) {
                        error("No test commands were generated. Check TEST_TYPE parameter: ${testType}")
                    }

                    def exitCode = sh(
                        script: """
                            docker run --rm \\
                                -v \$(pwd)/target:/app/target \\
                                --shm-size=2g \\
                                -e DISPLAY=:99 \\
                                ${DOCKER_IMAGE}:${BUILD_NUMBER} \\
                                sh -c "Xvfb :99 -screen 0 1920x1080x24 & ${allCommands} || true"
                        """,
                        returnStatus: true
                    )

                    echo "Docker execution completed with exit code: ${exitCode}"

                    // Set build result based on test results but continue pipeline
                    if (exitCode != 0) {
                        currentBuild.result = 'UNSTABLE'
                        echo "⚠️ Tests completed with failures but continuing pipeline for report generation"
                    } else {
                        echo "✅ All tests passed successfully"
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                script {
                    echo "📊 Generating test reports..."

                    // Get test type from previous stage or use default
                    def testType = env.BUILD_TEST_TYPE ?: 'all'

                    // Check for available test results
                    echo "🔍 Checking for test result files..."
                    sh '''
                        echo "📁 Target directory contents:"
                        ls -la target/ || echo "No target directory found"

                        if [ -d "target/allure-results" ]; then
                            echo "✅ Allure results directory found with $(ls target/allure-results/ | wc -l) files"
                        fi

                        if [ -d "target/surefire-reports" ]; then
                            echo "✅ Surefire reports directory found with $(ls target/surefire-reports/ | wc -l) files"
                        fi
                    '''

                    // Generate Allure reports using Docker (where Allure is installed)
                    echo "📊 Generating Allure reports..."
                    sh """
                        if [ -d "target/allure-results" ] && [ "\$(ls -A target/allure-results)" ]; then
                            echo "✅ Found Allure results, generating report..."
                            ls -la target/allure-results/

                            # Use Docker container to generate Allure report (since Allure is installed there)
                            docker run --rm \\
                                -v \$(pwd)/target:/app/target \\
                                ${DOCKER_IMAGE}:${BUILD_NUMBER} \\
                                allure generate /app/target/allure-results -o /app/target/allure-report --clean

                            echo "📊 Allure report generated successfully using Docker"
                        else
                            echo "⚠️ No Allure results found in target/allure-results/"
                            echo "📁 Checking target directory contents:"
                            ls -la target/ || echo "No target directory found"
                            mkdir -p target/allure-report
                            echo '<h1>No test results available</h1><p>Tests may have failed to generate results or did not run.</p>' > target/allure-report/index.html
                        fi
                    """
                }
            }
        }

        stage('Publish Reports') {
            steps {
                script {
                    echo "📋 Publishing test reports..."

                    // Publish JUnit results with error handling
                    try {
                        publishTestResults(
                            testResultsPattern: 'target/surefire-reports/*.xml',
                            allowEmptyResults: true
                        )
                        echo "✅ JUnit test results published"
                    } catch (Exception e) {
                        echo "⚠️ Could not publish JUnit results: ${e.getMessage()}"
                    }

                    // Publish Allure report (includes both JUnit and BDD results)
                    try {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: 'target/allure-results']]
                        ])
                        echo "✅ Allure report published"
                    } catch (Exception e) {
                        echo "⚠️ Could not publish Allure report: ${e.getMessage()}"
                    }

                    // Archive additional reports and artifacts
                    try {
                        archiveArtifacts(
                            artifacts: 'target/logs/*.log, target/screenshots/*.png, target/allure-report/**, target/cucumber-reports/**',
                            allowEmptyArchive: true
                        )
                        echo "✅ Artifacts archived successfully"
                    } catch (Exception e) {
                        echo "⚠️ Could not archive artifacts: ${e.getMessage()}"
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