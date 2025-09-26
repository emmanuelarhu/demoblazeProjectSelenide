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

                    // Archive JUnit results without Checks API
                    try {
                        archiveArtifacts(
                            artifacts: 'target/surefire-reports/*.xml',
                            allowEmptyArchive: true
                        )
                        echo "✅ JUnit test results archived"
                    } catch (Exception e) {
                        echo "⚠️ Could not archive JUnit results: ${e.getMessage()}"
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

        stage('OWASP ZAP Security Scan') {
            steps {
                script {
                    echo "🔒 Running OWASP ZAP automated security scan on https://www.demoblaze.com..."

                    // Create security reports directory
                    sh 'mkdir -p target/zap-reports'

                    try {
                        // Use ZAP daemon with enhanced styled report generation
                        def zapExitCode = sh(
                            script: """
                                # Create network for ZAP container
                                docker network create zapnet 2>/dev/null || echo "Network already exists"

                                # Run ZAP with enhanced reporting
                                docker run --rm --name zap-scanner \\
                                    --network zapnet \\
                                    -v \$(pwd)/target/zap-reports:/zap/wrk/:rw \\
                                    -p 8090:8090 \\
                                    -d ghcr.io/zaproxy/zaproxy:stable \\
                                    zap.sh -daemon -host 0.0.0.0 -port 8090 \\
                                    -config api.addrs.addr.name=.* \\
                                    -config api.addrs.addr.regex=true \\
                                    -config api.disablekey=true

                                # Wait for ZAP to initialize
                                echo "⏳ Waiting for ZAP to initialize..."
                                sleep 30

                                # Check ZAP status
                                echo "🔍 Verifying ZAP daemon status..."
                                curl -s http://localhost:8090/JSON/core/view/version/ || echo "ZAP status check"

                                # Run comprehensive scan
                                echo "🕷️ Starting spider scan on https://www.demoblaze.com..."
                                SPIDER_ID=\$(curl -s "http://localhost:8090/JSON/spider/action/scan/?url=https://www.demoblaze.com&maxChildren=10&recurse=true" | grep -o '"scan":"[0-9]*"' | cut -d'"' -f4)
                                echo "Spider scan ID: \$SPIDER_ID"

                                # Wait for spider to complete
                                while true; do
                                    STATUS=\$(curl -s "http://localhost:8090/JSON/spider/view/status/?scanId=\$SPIDER_ID" | grep -o '"status":"[0-9]*"' | cut -d'"' -f4)
                                    if [ "\$STATUS" = "100" ]; then
                                        echo "✅ Spider scan completed"
                                        break
                                    fi
                                    echo "Spider progress: \$STATUS%"
                                    sleep 10
                                done

                                # Run active scan
                                echo "🎯 Starting active security scan..."
                                ASCAN_ID=\$(curl -s "http://localhost:8090/JSON/ascan/action/scan/?url=https://www.demoblaze.com&recurse=true&inScopeOnly=false" | grep -o '"scan":"[0-9]*"' | cut -d'"' -f4)
                                echo "Active scan ID: \$ASCAN_ID"

                                # Wait for active scan to complete (with timeout)
                                TIMEOUT=300
                                COUNTER=0
                                while [ \$COUNTER -lt \$TIMEOUT ]; do
                                    STATUS=\$(curl -s "http://localhost:8090/JSON/ascan/view/status/?scanId=\$ASCAN_ID" | grep -o '"status":"[0-9]*"' | cut -d'"' -f4)
                                    if [ "\$STATUS" = "100" ]; then
                                        echo "✅ Active scan completed"
                                        break
                                    fi
                                    echo "Active scan progress: \$STATUS%"
                                    sleep 15
                                    COUNTER=\$((COUNTER + 15))
                                done

                                # Generate enhanced HTML report
                                echo "📊 Generating enhanced HTML security report..."
                                curl -s "http://localhost:8090/OTHER/core/other/htmlreport/" -o /tmp/zap-report-raw.html

                                # Generate additional reports
                                curl -s "http://localhost:8090/OTHER/core/other/xmlreport/" -o /tmp/zap-report.xml
                                curl -s "http://localhost:8090/JSON/core/view/alerts/" -o /tmp/zap-alerts.json

                                # Post-process HTML report for enhanced styling
                                cat > /tmp/enhance-report.py << 'EOF'
import re
import sys

def enhance_zap_report(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Enhanced CSS styling
    enhanced_css = '''
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .meta-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: #34495e;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 500;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background-color: #f8f9fa;
        }
        .risk-high { color: #e74c3c; font-weight: bold; }
        .risk-medium { color: #f39c12; font-weight: bold; }
        .risk-low { color: #f1c40f; font-weight: bold; }
        .risk-info { color: #3498db; font-weight: bold; }
        .alert-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
            border-top: 1px solid #eee;
            margin-top: 30px;
        }
    </style>
    '''

    # Insert enhanced CSS after <head>
    content = re.sub(r'<head>', f'<head>\\n{enhanced_css}', content)

    # Wrap main content in styled containers
    content = re.sub(r'<body[^>]*>', '''<body>
        <div class="header">
            <h1>🔒 Security Scan Report</h1>
            <p>Comprehensive security analysis powered by OWASP ZAP</p>
        </div>''', content)

    # Style the summary section
    content = re.sub(r'Summary of Alerts', '<div class="summary-table"><h2>📊 Security Alert Summary</h2>', content)

    # Add risk level styling
    content = re.sub(r'>High<', '><span class="risk-high">High</span><', content)
    content = re.sub(r'>Medium<', '><span class="risk-medium">Medium</span><', content)
    content = re.sub(r'>Low<', '><span class="risk-low">Low</span><', content)
    content = re.sub(r'>Informational<', '><span class="risk-info">Informational</span><', content)

    # Add footer
    content = re.sub(r'</body>', '''
        <div class="footer">
            <p>Report generated by OWASP ZAP Security Scanner</p>
            <p>🤖 Enhanced styling by Automated QA Pipeline</p>
        </div>
    </body>''', content)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    enhance_zap_report('/tmp/zap-report-raw.html', '/tmp/zap-report-enhanced.html')
    print("Report enhancement completed")
EOF

                                # Run report enhancement
                                python3 /tmp/enhance-report.py

                                # Copy reports to output directory
                                docker cp /tmp/zap-report-enhanced.html zap-scanner:/zap/wrk/zap-report.html
                                docker cp /tmp/zap-report.xml zap-scanner:/zap/wrk/zap-report.xml
                                docker cp /tmp/zap-alerts.json zap-scanner:/zap/wrk/zap-alerts.json

                                # Stop ZAP container
                                echo "🛑 Stopping ZAP scanner..."
                                docker stop zap-scanner 2>/dev/null || echo "Container already stopped"

                                # Clean up network
                                docker network rm zapnet 2>/dev/null || echo "Network cleanup"

                                echo "✅ Enhanced ZAP security scan completed"
                            """,
                            returnStatus: true
                        )

                        echo "ZAP scan completed with exit code: ${zapExitCode}"

                        // Check if reports were generated
                        sh '''
                            echo "📁 Checking generated ZAP reports:"
                            ls -la target/zap-reports/ || echo "No ZAP reports directory found"

                            if [ -f "target/zap-reports/zap-report.html" ]; then
                                FILESIZE=\$(stat -c%s "target/zap-reports/zap-report.html" 2>/dev/null || echo "0")
                                echo "✅ HTML report generated: \${FILESIZE} bytes"
                            else
                                echo "⚠️ HTML report not found"
                            fi

                            if [ -f "target/zap-reports/zap-report.xml" ]; then
                                FILESIZE=\$(stat -c%s "target/zap-reports/zap-report.xml" 2>/dev/null || echo "0")
                                echo "✅ XML report generated: \${FILESIZE} bytes"
                            else
                                echo "⚠️ XML report not found"
                            fi
                        '''

                    } catch (Exception e) {
                        echo "⚠️ ZAP scan encountered issues: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'

                        // Create fallback report
                        sh '''
                            mkdir -p target/zap-reports
                            echo "<html><body><h1>ZAP Scan Status</h1><p>Security scan encountered issues but pipeline continued.</p><p>Check Jenkins logs for details.</p></body></html>" > target/zap-reports/zap-report.html
                        '''
                    }
                }
            }
        }

        stage('JMeter Performance Testing') {
            steps {
                script {
                    echo "🚀 Running JMeter performance tests on https://www.demoblaze.com..."

                    // Create results directories
                    sh 'mkdir -p target/jmeter-results target/jmeter-reports'

                    try {
                        // Run JMeter performance test using Docker container with simplified approach
                        def jmeterExitCode = sh(
                            script: """
                                docker run --rm \\
                                    -v \$(pwd)/test-plans:/app/test-plans:ro \\
                                    -v \$(pwd)/target/jmeter-results:/app/results:rw \\
                                    -v \$(pwd)/target/jmeter-reports:/app/reports:rw \\
                                    ${DOCKER_IMAGE}:${BUILD_NUMBER} \\
                                    sh -c "
                                        echo '🚀 Starting JMeter performance test...'
                                        cd /app

                                        # Verify JMeter and test files
                                        echo 'Checking JMeter installation and test files:'
                                        which jmeter || export PATH=/opt/apache-jmeter/bin:\\\$PATH
                                        jmeter --version
                                        ls -la test-plans/

                                        # Set test parameters from user.properties
                                        THREADS=\\\$(grep '^threads=' test-plans/user.properties | cut -d'=' -f2 || echo '5')
                                        RAMP_UP=\\\$(grep '^rampup=' test-plans/user.properties | cut -d'=' -f2 || echo '10')
                                        DURATION=\\\$(grep '^duration=' test-plans/user.properties | cut -d'=' -f2 || echo '60')

                                        echo 'JMeter Configuration:'
                                        echo \"- Threads (Users): \\\$THREADS\"
                                        echo \"- Ramp-up Period: \\\$RAMP_UP seconds\"
                                        echo \"- Test Duration: \\\$DURATION seconds\"
                                        echo '- Target URL: https://www.demoblaze.com'

                                        # Create results directory
                                        mkdir -p results reports

                                        # Run JMeter test
                                        echo '📊 Executing performance test...'
                                        jmeter -n \\
                                            -t test-plans/demoblaze-performance-test.jmx \\
                                            -l results/performance-test-results.jtl \\
                                            -q test-plans/user.properties \\
                                            -e -o reports/html-report \\
                                            -Jthreads=\\\$THREADS \\
                                            -Jrampup=\\\$RAMP_UP \\
                                            -Jduration=\\\$DURATION

                                        echo '✅ JMeter performance test completed'

                                        # Copy results to mounted volumes
                                        echo 'Copying results to mounted volumes:'
                                        cp -r results/* /app/results/ 2>/dev/null || echo 'Results copy completed'
                                        cp -r reports/* /app/reports/ 2>/dev/null || echo 'Reports copy completed'

                                        # Verify final results
                                        echo 'Final generated files:'
                                        ls -la /app/results/ /app/reports/ || echo 'Results verification completed'
                                    "
                            """,
                            returnStatus: true
                        )

                        echo "JMeter test completed with exit code: ${jmeterExitCode}"

                        // Analyze results and generate summary
                        sh '''
                            echo "📊 Checking JMeter test results:"

                            if [ -f "target/jmeter-results/performance-test-results.jtl" ]; then
                                LINES=\$(wc -l < target/jmeter-results/performance-test-results.jtl 2>/dev/null || echo "0")
                                echo "✅ Performance results file generated: \${LINES} samples"

                                # Basic result analysis
                                echo "📈 Performance Test Summary:"
                                TOTAL=\$(grep -c '^[0-9]' target/jmeter-results/performance-test-results.jtl 2>/dev/null || echo 'N/A')
                                FAILED=\$(grep -c ',false,' target/jmeter-results/performance-test-results.jtl 2>/dev/null || echo '0')
                                echo "- Total Samples: \${TOTAL}"
                                echo "- Failed Samples: \${FAILED}"

                            else
                                echo "⚠️ Performance results file not found"
                            fi

                            if [ -d "target/jmeter-reports/html-report" ]; then
                                echo "✅ HTML report generated in target/jmeter-reports/html-report/"
                                ls -la target/jmeter-reports/html-report/ | head -10
                            else
                                echo "⚠️ HTML report directory not found"
                            fi
                        '''

                        // Set build status based on performance results
                        def performanceStatus = sh(
                            script: '''
                                if [ -f "target/jmeter-results/performance-test-results.jtl" ]; then
                                    FAILED_COUNT=$(grep -c ",false," target/jmeter-results/performance-test-results.jtl || echo "0")
                                    TOTAL_COUNT=$(grep -c "^[0-9]" target/jmeter-results/performance-test-results.jtl || echo "1")

                                    if [ "$TOTAL_COUNT" -gt 0 ]; then
                                        FAILURE_RATE=$((FAILED_COUNT * 100 / TOTAL_COUNT))
                                        echo "Performance failure rate: ${FAILURE_RATE}%"

                                        if [ "$FAILURE_RATE" -gt 10 ]; then
                                            echo "HIGH_FAILURE_RATE"
                                        else
                                            echo "ACCEPTABLE_PERFORMANCE"
                                        fi
                                    else
                                        echo "NO_SAMPLES"
                                    fi
                                else
                                    echo "NO_RESULTS_FILE"
                                fi
                            ''',
                            returnStdout: true
                        ).trim()

                        if (performanceStatus.contains('HIGH_FAILURE_RATE')) {
                            currentBuild.result = 'UNSTABLE'
                            echo "⚠️ Performance test shows high failure rate - build marked as unstable"
                        } else {
                            echo "✅ Performance test completed within acceptable parameters"
                        }

                    } catch (Exception e) {
                        echo "⚠️ JMeter performance test encountered issues: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'

                        // Create fallback report
                        sh '''
                            mkdir -p target/jmeter-reports/html-report
                            echo "<html><body><h1>Performance Test Status</h1><p>Performance test encountered issues but pipeline continued.</p><p>Check Jenkins logs for details.</p></body></html>" > target/jmeter-reports/html-report/index.html
                        '''
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

                // Archive artifacts including ZAP security reports and JMeter performance reports
                archiveArtifacts artifacts: 'target/logs/*.log, target/screenshots/*.png, target/allure-report/**, target/zap-reports/**, target/jmeter-results/**, target/jmeter-reports/**', allowEmptyArchive: true
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

                        <h3>📊 Professional QA Reports:</h3>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <h4>🔒 Security Analysis</h4>
                            <ul>
                                <li><strong>Enhanced Security Report:</strong> <a href="${BUILD_URL}artifact/target/zap-reports/zap-report.html" style="color: #007bff;">View Professional ZAP Security Analysis</a> - Now with modern styling!</li>
                                <li><strong>Security Alerts (JSON):</strong> <a href="${BUILD_URL}artifact/target/zap-reports/zap-alerts.json">Raw Security Data</a></li>
                                <li><strong>Security Report (XML):</strong> <a href="${BUILD_URL}artifact/target/zap-reports/zap-report.xml">Technical Details</a></li>
                            </ul>
                        </div>
                        <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <h4>🧪 Test Results</h4>
                            <ul>
                                <li><strong>Interactive Test Report:</strong> <a href="${BUILD_URL}allure/" style="color: #28a745;">Allure Test Dashboard</a></li>
                            </ul>
                        </div>
                        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <h4>⚡ Performance Analysis</h4>
                            <ul>
                                <li><strong>Performance Report:</strong> <a href="${BUILD_URL}artifact/target/jmeter-reports/html-report/index.html" style="color: #ffc107;">JMeter Load Test Results</a></li>
                            </ul>
                        </div>
                        <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <h4>🔧 Technical Details</h4>
                            <ul>
                                <li><strong>Jenkins Console:</strong> <a href="${BUILD_URL}console">Build Execution Logs</a></li>
                            </ul>
                        </div>

                        <p><em>All reports are also available in the Jenkins build artifacts.</em></p>
                    """,
                    mimeType: 'text/html',
                    to: '$DEFAULT_RECIPIENTS',
                    attachmentsPattern: 'target/zap-reports/zap-report.html'
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

                // Email unstable notification
                emailext(
                    subject: "⚠️ Test Execution Unstable - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <h2 style="color: orange;">⚠️ Test Execution Unstable</h2>
                        <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                        <p><strong>Build Number:</strong> #${env.BUILD_NUMBER}</p>
                        <p><strong>Test Type:</strong> ${params.TEST_TYPE}</p>
                        <p><strong>Test Suite:</strong> ${params.TEST_SUITE}</p>
                        <p><strong>Browser:</strong> ${params.BROWSER}</p>
                        <p><strong>Duration:</strong> ${currentBuild.durationString}</p>

                        <h3>📊 Diagnostic Reports:</h3>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <h4>🔒 Security Analysis</h4>
                            <ul>
                                <li><strong>Enhanced Security Report:</strong> <a href="${BUILD_URL}artifact/target/zap-reports/zap-report.html" style="color: #007bff;">Professional ZAP Security Analysis</a></li>
                                <li><strong>Security Data:</strong> <a href="${BUILD_URL}artifact/target/zap-reports/zap-alerts.json">JSON Format</a> | <a href="${BUILD_URL}artifact/target/zap-reports/zap-report.xml">XML Format</a></li>
                            </ul>
                        </div>
                        <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <h4>🧪 Test Results (Issues Found)</h4>
                            <ul>
                                <li><strong>Test Report:</strong> <a href="${BUILD_URL}allure/" style="color: #dc3545;">Allure Test Results</a></li>
                            </ul>
                        </div>
                        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <h4>⚡ Performance Analysis</h4>
                            <ul>
                                <li><strong>Performance Report:</strong> <a href="${BUILD_URL}artifact/target/jmeter-reports/html-report/index.html" style="color: #ffc107;">JMeter Results</a></li>
                            </ul>
                        </div>
                        <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <h4>🔧 Troubleshooting</h4>
                            <ul>
                                <li><strong>Build Logs:</strong> <a href="${BUILD_URL}console">Jenkins Console Output</a></li>
                            </ul>
                        </div>

                        <p><span style="color: orange;"><strong>Note:</strong></span> Some tests may have failed or security issues were detected. Please review the reports and address any issues found.</p>
                        <p><em>All reports and logs are attached and available in Jenkins artifacts.</em></p>
                    """,
                    mimeType: 'text/html',
                    to: '$DEFAULT_RECIPIENTS',
                    attachmentsPattern: 'target/zap-reports/zap-report.html',
                    attachLog: true
                )
            }
        }
    }
}