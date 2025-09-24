# Jenkins Setup Guide for DemoBlaze Test Automation

## Prerequisites
- Jenkins server with Docker support
- Docker installed on Jenkins server
- Required Jenkins plugins (see plugins.txt)

## 1. Jenkins Plugin Installation

Install the following plugins in Jenkins (Manage Jenkins → Manage Plugins):

```bash
# Install plugins from plugins.txt
jenkins-plugin-cli --plugins-from-file jenkins/plugins.txt
```

## 2. Global Tool Configuration

### Maven Configuration
1. Go to **Manage Jenkins → Global Tool Configuration**
2. Add Maven installation:
   - Name: `Maven-3.9.6`
   - Install automatically: ✓
   - Version: `3.9.6`

### JDK Configuration
1. Add JDK installation:
   - Name: `JDK-21`
   - Install automatically: ✓
   - Version: `Eclipse Temurin 21`

### Allure Configuration
1. Add Allure Commandline installation:
   - Name: `Allure`
   - Install automatically: ✓
   - Version: `2.25.0`

## 3. Credentials Setup

### Slack Integration
1. Go to **Manage Jenkins → Manage Credentials**
2. Add **Secret text** credential:
   - ID: `slack-token`
   - Secret: Your Slack Bot Token

### JIRA Integration
1. Add **Username with password** credential:
   - ID: `jira-credentials`
   - Username: Your JIRA username
   - Password: Your JIRA API token

### Email Configuration
1. Go to **Manage Jenkins → Configure System**
2. Configure **E-mail Notification**:
   - SMTP server: `smtp.gmail.com`
   - Port: `587`
   - Use SMTP Authentication: ✓
   - Username: Your email
   - Password: App password

## 4. System Configuration

### Slack Configuration
1. Go to **Manage Jenkins → Configure System**
2. Find **Slack** section:
   - Workspace: Your Slack workspace
   - Credential: Select `slack-token`
   - Default channel: `#test-automation`
   - Test connection

### JIRA Configuration
1. Find **JIRA Steps** section:
   - JIRA site: Your JIRA URL
   - Credential: Select `jira-credentials`

### Allure Configuration
1. Find **Allure** section:
   - Allure Commandline: Select configured `Allure`

## 5. Job Configuration

### Create Pipeline Job
1. **New Item → Pipeline**
2. **Pipeline Definition:** Pipeline script from SCM
3. **SCM:** Git
4. **Repository URL:** `https://github.com/emmanuelarhu/demoblazeProjectSelenide.git`
5. **Branch:** `*/main`
6. **Script Path:** `Jenkinsfile`

### Configure Build Triggers
- **GitHub hook trigger for GITScm polling**: ✓
- **Build periodically**: `H 2 * * *` (daily at 2 AM)

### Configure Parameters
The pipeline includes built-in parameters:
- `TEST_SUITE`: Test suite selection
- `BROWSER`: Browser choice
- `HEADLESS`: Headless execution

## 6. Docker Configuration

Ensure Jenkins has Docker access:
```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

## 7. Webhook Configuration (GitHub)

1. Go to your GitHub repository
2. **Settings → Webhooks → Add webhook**
3. **Payload URL:** `http://your-jenkins-url/github-webhook/`
4. **Content type:** `application/json`
5. **Events:** Just the push event

## 8. Environment Variables

Set these in Jenkins system configuration:
```bash
SLACK_CHANNEL=#test-automation
JIRA_PROJECT=TEST
DEFAULT_RECIPIENTS=your-email@company.com
```

## 9. Security Configuration

### Configure Global Security
1. **Security Realm:** Jenkins' own user database
2. **Authorization:** Matrix-based security
3. Create users for team members

### API Token for External Integrations
1. **User → Configure → API Token**
2. Generate token for external tools

## 10. Pipeline Features

The configured pipeline includes:

### ✅ Automated Features:
- **Docker containerized execution**
- **Parameterized test runs**
- **Allure report generation**
- **Slack notifications**
- **Email notifications**
- **JIRA ticket creation**
- **Screenshot capture**
- **Artifact archival**

### ✅ Notification Scenarios:
- **Success**: Green Slack message + success email
- **Failure**: Red Slack message + failure email + JIRA ticket
- **Unstable**: Yellow Slack message

### ✅ Reports Available:
- **JUnit test results**
- **Allure interactive reports**
- **Build console logs**
- **Screenshots on failure**

## 11. Running the Pipeline

### Manual Execution:
1. Go to job → **Build with Parameters**
2. Select test suite, browser, headless mode
3. Click **Build**

### Automatic Triggers:
- **Git push** (via webhook)
- **Scheduled** (daily at 2 AM)
- **Manual trigger**

## 12. Monitoring and Maintenance

### Build Health:
- Monitor build trends
- Set up build failure alerts
- Regular plugin updates

### Resource Management:
- Clean up old Docker images
- Archive old build artifacts
- Monitor disk space

This setup provides a complete CI/CD pipeline with comprehensive reporting and notifications!