# BDD Test Commands Reference

This document provides all commands needed to run BDD Cucumber tests and generate reports in this framework.

## 🚀 **Test Execution Commands**

### **BDD Cucumber Tests (Recommended)**

#### **Basic Execution**
```bash
# Run all BDD tests (Chrome default)
mvn test -Dtest=runners.CucumberTestRunner

# Run with specific browser
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=chrome
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=firefox

# Run in headless mode (CI/CD)
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=chrome -Dselenide.headless=true
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=firefox -Dselenide.headless=true
```

#### **Tag-Based Execution**
```bash
# Run by feature tags
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@HomePage"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Cart"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Contact"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@OrderPlacement"

# Run by priority tags
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Critical"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Functional"

# Run by test type
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@E2E"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@UI"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Edge"

# Combine tags (AND operation)
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Cart and @Smoke"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@OrderPlacement and @Critical"

# Exclude tags (NOT operation)
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="not @ignore"
```

#### **Specific Scenario Testing**
```bash
# Test specific scenarios
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@AddToCart"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@PlaceOrder"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@ContactForm"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@OrderValidation"
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Navigation"
```

### **Traditional JUnit Tests**
```bash
# Run all traditional JUnit tests
mvn test

# Run specific test class
mvn test -Dtest=tests.HomePageTest
mvn test -Dtest=tests.CartTest

# Run with browser selection
mvn test -Dtest=tests.HomePageTest -Dselenide.browser=firefox
```

### **Combined Execution**
```bash
# Run both traditional and BDD tests
mvn clean test

# Run all tests with specific browser
mvn clean test -Dselenide.browser=chrome -Dselenide.headless=true
```

## 📊 **Report Generation Commands**

### **1. Allure Reports (Comprehensive)**
```bash
# Generate Allure report (works for both JUnit and BDD)
mvn allure:report

# Serve Allure report (opens browser automatically)
mvn allure:serve

# Generate and serve in one command
mvn clean test allure:serve

# Run specific tests and serve Allure
mvn clean test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke" allure:serve
```

### **2. Cucumber HTML Reports**
```bash
# Generate Cucumber reports (after running BDD tests)
mvn verify

# Or run tests and generate reports in one go
mvn clean test verify

# Generate reports for specific feature
mvn clean test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@OrderPlacement" verify
```

### **3. Combined Reports Generation**
```bash
# Run all tests and generate all reports
mvn clean test verify allure:report

# Run BDD tests and serve Allure (recommended for development)
mvn clean test -Dtest=runners.CucumberTestRunner allure:serve

# Complete CI/CD pipeline with reports
mvn clean test verify allure:report -Dselenide.browser=chrome -Dselenide.headless=true
```

## 📁 **Report Locations**

### **Allure Reports**
- **Generated Report**: `target/site/allure-maven-plugin/index.html`
- **Raw Results**: `target/allure-results/`
- **Access**: Open HTML file or use `mvn allure:serve`

### **Cucumber Reports**
- **HTML Report**: `target/cucumber-reports/cucumber-html-report.html`
- **JSON Report**: `target/cucumber-reports/Cucumber.json`
- **XML Report**: `target/cucumber-reports/Cucumber.xml`
- **Master Report**: `target/cucumber-reports/overview-features.html`

### **Surefire Reports**
- **Location**: `target/surefire-reports/`
- **Format**: XML and TXT test results

### **Screenshots & Logs**
- **Screenshots**: `target/screenshots/` (captured on failures)
- **Test Execution Logs**: `target/logs/test-execution.log`
- **Page Action Logs**: `target/logs/page-actions.log`

## 🔧 **Advanced Commands**

### **CI/CD Pipeline Commands**
```bash
# Complete CI/CD execution (Chrome headless)
mvn clean compile test -Dtest=runners.CucumberTestRunner -Dselenide.browser=chrome -Dselenide.headless=true

# Smoke tests for CI/CD
mvn clean test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke" -Dselenide.headless=true

# Critical tests for CI/CD
mvn clean test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Critical" -Dselenide.headless=true

# Generate reports for CI/CD
mvn clean test verify allure:report -Dtest=runners.CucumberTestRunner -Dselenide.headless=true
```

### **Cross-Browser Testing**
```bash
# Test on Chrome
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=chrome -Dcucumber.filter.tags="@Smoke"

# Test on Firefox
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=firefox -Dcucumber.filter.tags="@Smoke"

# Test both browsers (run separately)
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=chrome -Dcucumber.filter.tags="@Critical"
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=firefox -Dcucumber.filter.tags="@Critical"
```

### **Debug and Development**
```bash
# Run with debug logging
mvn test -Dtest=runners.CucumberTestRunner -X

# Run single feature for debugging
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.features=src/test/resources/features/HomePage.feature

# Run with custom browser size
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browserSize=1920x1080
```

## 🎯 **Recommended Workflows**

### **Development Workflow**
```bash
# 1. Quick smoke test
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke" -Dselenide.headless=true

# 2. Feature development testing
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@HomePage" allure:serve

# 3. Full regression with reports
mvn clean test -Dtest=runners.CucumberTestRunner allure:serve
```

### **CI/CD Pipeline Workflow**
```bash
# Stage 1: Smoke tests
mvn clean test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke" -Dselenide.headless=true

# Stage 2: Critical tests
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Critical" -Dselenide.headless=true

# Stage 3: Full regression
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.headless=true

# Stage 4: Generate reports
mvn verify allure:report
```

### **Feature Testing Workflow**
```bash
# Test specific feature end-to-end
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@OrderPlacement"

# Test feature on multiple browsers
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Cart" -Dselenide.browser=chrome
mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Cart" -Dselenide.browser=firefox
```

## 📈 **Report Features**

### **Allure Reports Include:**
- ✅ Interactive test execution dashboard
- ✅ Step-by-step scenario execution
- ✅ Screenshot attachments on failures
- ✅ Test execution timeline and trends
- ✅ Browser and environment information
- ✅ BDD scenarios in Gherkin format
- ✅ Test history and analytics

### **Cucumber Reports Include:**
- ✅ Feature overview with statistics
- ✅ Scenario pass/fail breakdown
- ✅ Step definition mapping
- ✅ Tag-based test organization
- ✅ Execution timeline analysis
- ✅ JSON/XML data for CI/CD integration

## 🏷️ **Available Tags**

### **Feature Tags**
- `@HomePage` - Home page functionality tests
- `@Cart` - Shopping cart tests
- `@Contact` - Contact modal tests
- `@OrderPlacement` - Order placement and checkout tests

### **Priority Tags**
- `@Smoke` - Critical smoke tests
- `@Critical` - High-priority tests
- `@Functional` - Functional testing
- `@Edge` - Edge case testing

### **Type Tags**
- `@E2E` - End-to-end workflow tests
- `@UI` - User interface tests
- `@Navigation` - Navigation functionality
- `@Communication` - Communication features

### **Scenario Tags**
- `@AddToCart` - Add to cart scenarios
- `@PlaceOrder` - Order placement scenarios
- `@ContactForm` - Contact form scenarios
- `@OrderValidation` - Order form validation

## 🚨 **Troubleshooting**

### **Common Issues**
```bash
# If tests don't run - clean and compile
mvn clean compile test -Dtest=runners.CucumberTestRunner

# If browser issues - specify browser explicitly
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=chrome

# If headless issues - disable headless mode
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.headless=false

# If timeout issues - increase timeout
mvn test -Dtest=runners.CucumberTestRunner -Dselenide.timeout=10000
```

### **Clean Execution**
```bash
# Complete clean execution
mvn clean compile test-compile test -Dtest=runners.CucumberTestRunner

# Reset everything and run
mvn clean install test -Dtest=runners.CucumberTestRunner
```

---

## 📚 **Quick Reference**

| Command Purpose | Command |
|----------------|---------|
| Run all BDD tests | `mvn test -Dtest=runners.CucumberTestRunner` |
| Smoke tests | `mvn test -Dtest=runners.CucumberTestRunner -Dcucumber.filter.tags="@Smoke"` |
| Firefox tests | `mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=firefox` |
| Headless tests | `mvn test -Dtest=runners.CucumberTestRunner -Dselenide.headless=true` |
| Generate Allure | `mvn allure:serve` |
| Generate Cucumber | `mvn verify` |
| CI/CD Pipeline | `mvn clean test verify -Dselenide.headless=true` |
