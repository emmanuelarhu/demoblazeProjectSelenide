# Jenkins Integration Guide for DemoBlaze Test Framework

Complete step-by-step guide to integrate the DemoBlaze test automation framework with Jenkins CI/CD pipeline.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Jenkins Setup](#jenkins-setup)
3. [Pipeline Configuration](#pipeline-configuration)
4. [Running Tests](#running-tests)
5. [Pipeline Parameters](#pipeline-parameters)
6. [Auto-Trigger Setup](#auto-trigger-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Jenkins** 2.400+ (LTS recommended)
- **Docker** installed on Jenkins agent
- **Git** for repository access
- **Linux agent** with Docker capabilities

### Required Jenkins Plugins
Install these plugins via Jenkins Plugin Manager (`Manage Jenkins` → `Plugins`):

```
Essential Plugins:
- Pipeline (Workflow Aggregator)
- Git Plugin
- GitHub Plugin
- Docker Pipeline Plugin
- Allure Jenkins Plugin
- HTML Publisher Plugin

Optional Plugins (for notifications):
- Slack Notification Plugin
- Email Extension Plugin
- JIRA Plugin
```

### Agent Configuration
Ensure your Jenkins agent has:
- **Docker daemon** running
- **Label**: `linux-agent` (or update Jenkinsfile)
- **Sufficient resources**: 4GB RAM, 2 CPU cores minimum
- **Network access** to GitHub and Docker Hub

---

## Jenkins Setup

### Step 1: Create New Pipeline Job

1. **Navigate to Jenkins Dashboard**
2. **Click "New Item"**
3. **Enter job name**: `DemoBlaze-Test-Pipeline`
4. **Select "Pipeline"**
5. **Click "OK"**

### Step 2: Configure Pipeline Source

In the job configuration:

1. **Pipeline Section:**
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/emmanuelarhu/demoblazeProjectSelenide.git`
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`

2. **Build Triggers** (Optional):
   - ✅ **GitHub hook trigger for GITScm polling**
   - ✅ **Poll SCM** (if webhooks not available)

3. **Save Configuration**

### Step 3: Install Allure Plugin Configuration

1. **Go to**: `Manage Jenkins` → `Tools`
2. **Find "Allure Commandline"**
3. **Add Allure Commandline**:
   - **Name**: `Allure`
   - **Install automatically**: ✅
   - **Version**: Latest (2.30.0+)

---

## Pipeline Configuration

### Understanding the Jenkinsfile Structure

The pipeline includes these key stages:

```groovy
pipeline {
    agent {
        label 'linux-agent'  // Requires linux-agent label
    }

    triggers {
        githubPush()  // Auto-trigger on repository changes
    }

    parameters {
        // User-selectable options for test execution
    }

    stages {
        - Build Docker Image
        - Run Tests in Docker
        - Generate Reports
        - Publish Reports
        - Send Notifications
    }
}
```

### Key Features

✅ **Parameterized execution** - Choose test type, browser, suite
✅ **Docker containerization** - Isolated test environment
✅ **Auto-trigger** - Runs automatically on git push
✅ **Dual reporting** - Allure and Cucumber HTML reports
✅ **Comprehensive notifications** - Build status alerts

---

## Running Tests

### Method 1: Manual Pipeline Execution

1. **Go to your pipeline job**
2. **Click "Build with Parameters"**
3. **Select your options**:
   - **TEST_TYPE**: `all` (JUnit + BDD), `junit-only`, `bdd-only`
   - **TEST_SUITE**: `all`, `smoke`, `regression`, `cart`, `homepage`, `contact`
   - **BROWSER**: `chrome`, `firefox`
   - **HEADLESS**: `true` (recommended for CI), `false`
4. **Click "Build"**

### Method 2: Auto-Trigger (Recommended)

The pipeline automatically starts when you:
- **Push commits** to the main branch
- **Create pull requests**
- **Merge changes**

**No manual intervention required!**

---

## Pipeline Parameters

### TEST_TYPE Parameter
Controls which test architecture to execute:

| Value | Description | Use Case |
|-------|-------------|----------|
| `all` | Runs both JUnit and BDD tests | **Recommended** - Full test coverage |
| `junit-only` | Traditional JUnit tests only | Fast execution, unit-style tests |
| `bdd-only` | BDD Cucumber tests only | Business validation scenarios |

### TEST_SUITE Parameter
Filters which test scenarios to run:

| Value | Description | Tests Included |
|-------|-------------|----------------|
| `all` | All available tests | Complete test suite |
| `smoke` | Critical smoke tests | Basic functionality verification |
| `regression` | High-priority regression tests | Core feature validation |
| `cart` | Shopping cart functionality | Cart operations, item management |
| `homepage` | Home page features | Navigation, product display |
| `contact` | Contact form scenarios | Form validation, modal interactions |
| `orderplacement` | Order placement workflow | E2E purchase scenarios |

### BROWSER Parameter
Selects browser for test execution:

| Value | Description | Best For |
|-------|-------------|----------|
| `chrome` | Google Chrome (default) | **Recommended** - Stable, fast |
| `firefox` | Mozilla Firefox | Cross-browser compatibility |

### HEADLESS Parameter
Controls browser display mode:

| Value | Description | Use Case |
|-------|-------------|----------|
| `true` | Headless mode (no GUI) | **Recommended** - CI/CD, faster execution |
| `false` | With GUI (requires display) | Local debugging, visual verification |

---

## Example Parameter Combinations

### Recommended Configurations

#### 🚀 **Full Regression Suite**
```
TEST_TYPE: all
TEST_SUITE: regression
BROWSER: chrome
HEADLESS: true
```
*Best for: Comprehensive testing, release validation*

#### ⚡ **Quick Smoke Tests**
```
TEST_TYPE: all
TEST_SUITE: smoke
BROWSER: chrome
HEADLESS: true
```
*Best for: Fast feedback, pre-commit validation*

#### 🎯 **Feature-Specific Testing**
```
TEST_TYPE: bdd-only
TEST_SUITE: cart
BROWSER: firefox
HEADLESS: true
```
*Best for: Specific feature validation, BDD scenarios*

#### 🧪 **Cross-Browser Testing**
```
TEST_TYPE: all
TEST_SUITE: all
BROWSER: firefox
HEADLESS: false
```
*Best for: Compatibility testing (requires display setup)*

---

## Auto-Trigger Setup

### GitHub Webhook Configuration

1. **Go to your GitHub repository**
2. **Settings** → **Webhooks**
3. **Add webhook**:
   - **Payload URL**: `http://your-jenkins-url/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: `Just the push event`
   - **Active**: ✅

### Jenkins GitHub Integration

1. **Manage Jenkins** → **System**
2. **GitHub** section:
   - **Add GitHub Server**
   - **API URL**: `https://api.github.com`
   - **Credentials**: Add GitHub token

### Testing Auto-Trigger

1. **Make a small change** to your repository
2. **Commit and push** to main branch
3. **Check Jenkins** - Pipeline should start automatically
4. **Monitor build** progress in Jenkins console

---

## Build Execution Flow

When you run the pipeline, here's what happens:

### Stage 1: Build Docker Image
```bash
docker build -t demoblaze-selenium-tests:${BUILD_NUMBER} .
```
- Creates isolated test environment
- Installs Java 21, Chrome, Firefox, Allure
- Sets up all dependencies

### Stage 2: Run Tests in Docker
```bash
docker run --rm \
    -v $(pwd)/target:/app/target \
    --shm-size=2g \
    -e DISPLAY=:99 \
    ${IMAGE} \
    sh -c "Xvfb :99 & ${TEST_COMMANDS}"
```
- Executes selected test type with parameters
- Runs in headless environment with display server
- Captures all test results and artifacts

### Stage 3: Generate Reports
- **Allure reports** - Interactive dashboards
- **Cucumber HTML reports** - BDD scenario details
- **JUnit XML** - Test result summaries

### Stage 4: Publish Reports
- Reports available in Jenkins UI
- **Allure Report** link in sidebar
- **HTML Publisher** for Cucumber reports
- **Archived artifacts** for download

### Stage 5: Notifications
- **Success/Failure** status updates
- **Slack notifications** (if configured)
- **Email alerts** (if configured)

---

## Viewing Test Results

### Allure Reports
1. **Go to your build**
2. **Click "Allure Report"** in sidebar
3. **View interactive dashboard** with:
   - Test execution trends
   - Detailed test results
   - Screenshots of failures
   - Execution timeline

### Cucumber Reports
1. **Go to your build**
2. **Click "HTML Report"**
3. **View BDD scenarios** with:
   - Feature-by-feature breakdown
   - Step-by-step execution
   - Pass/fail status per scenario

### Console Output
1. **Click on build number**
2. **Select "Console Output"**
3. **View real-time logs** of:
   - Docker build process
   - Test execution progress
   - Detailed error messages

---

## Advanced Configuration

### Custom Agent Labels
If you need different agent configuration:

1. **Update Jenkinsfile**:
   ```groovy
   agent {
       label 'your-custom-label'
   }
   ```

### Resource Requirements
Recommend agent with:
- **CPU**: 2+ cores
- **RAM**: 4GB+ available
- **Disk**: 10GB+ free space
- **Network**: Internet access for dependencies

### Environment Variables
Add custom environment variables in Jenkinsfile:
```groovy
environment {
    CUSTOM_VAR = 'value'
    SELENIUM_TIMEOUT = '30'
}
```

---

## Notifications Setup (Optional)

### Slack Integration
1. **Install Slack Notification Plugin**
2. **Add Slack credentials** in Jenkins
3. **Update SLACK_CHANNEL** in Jenkinsfile
4. **Configure webhook** in Slack workspace

### Email Notifications
1. **Configure SMTP** in Jenkins system settings
2. **Update email address** in Jenkinsfile
3. **Test email delivery** with sample build

---

## Troubleshooting

### Common Issues and Solutions

#### ❌ **"No agents available"**
**Solution**: Ensure agent with `linux-agent` label exists and is online

#### ❌ **"Docker command not found"**
**Solution**: Install Docker on Jenkins agent and add to PATH

#### ❌ **"Permission denied accessing Docker"**
**Solution**: Add Jenkins user to docker group:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

#### ❌ **"Tests failing with SessionNotCreatedException"**
**Solution**: Ensure `--shm-size=2g` is set in Docker run command

#### ❌ **"Auto-trigger not working"**
**Solution**: Verify GitHub webhook URL and Jenkins GitHub plugin configuration

#### ❌ **"Reports not generating"**
**Solution**: Check Allure plugin installation and target/allure-results directory

### Debug Mode

Enable debug output by adding to Jenkinsfile:
```groovy
environment {
    DEBUG = 'true'
    VERBOSE = 'true'
}
```

### Log Locations

After build completion, check these locations:
- **Jenkins console**: Build logs and errors
- **target/logs/**: Application logs from tests
- **target/screenshots/**: Failure screenshots
- **target/allure-results/**: Raw Allure data

---

## Best Practices

### 📋 **Recommended Pipeline Usage**

1. **Use auto-trigger** for continuous integration
2. **Run smoke tests** frequently (every commit)
3. **Run regression tests** before releases
4. **Use parameterized builds** for specific testing needs
5. **Monitor reports** regularly for trends

### 🔧 **Maintenance Tasks**

- **Clean workspace** regularly to free disk space
- **Update Docker images** monthly for security patches
- **Monitor build performance** and optimize as needed
- **Review test results** and update tests based on failures

### 🚀 **Performance Optimization**

- **Use headless mode** for faster execution
- **Parallel execution** with multiple agents (future enhancement)
- **Selective testing** with appropriate TEST_SUITE parameters
- **Resource monitoring** to ensure adequate agent capacity

---

## Quick Reference Commands

### Manual Jenkins CLI
```bash
# Trigger build with parameters
curl -X POST "http://jenkins-url/job/DemoBlaze-Test-Pipeline/buildWithParameters" \
  --user "username:token" \
  --data "TEST_TYPE=all&TEST_SUITE=smoke&BROWSER=chrome&HEADLESS=true"

# Get build status
curl "http://jenkins-url/job/DemoBlaze-Test-Pipeline/lastBuild/api/json" \
  --user "username:token"
```

### Docker Commands for Local Testing
```bash
# Build image locally
docker build -t demoblaze-tests .

# Run tests manually
docker run --rm -v "$(pwd)/target:/app/target" --shm-size=2g demoblaze-tests
```

---

## Support and Next Steps

### 📚 **Additional Resources**
- Main README.md - Framework overview
- BDD_TEST_COMMANDS.md - BDD-specific commands
- CLAUDE.md - Development guidelines

### 🆘 **Getting Help**
- Check Jenkins console output for detailed error messages
- Review Docker container logs for test execution issues
- Verify agent configuration and resource availability
- Test pipeline components individually for isolation

### 🔄 **Continuous Improvement**
- Monitor build trends in Allure reports
- Optimize test execution time with selective suites
- Add more notification channels as needed
- Scale with additional agents for parallel execution

---

**Happy Testing with Jenkins! 🚀**

*This guide should get you up and running with the DemoBlaze test framework in Jenkins. For specific issues or enhancements, refer to the troubleshooting section or check the main project documentation.*