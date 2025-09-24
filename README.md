# DemoBlaze Test Automation Framework

A comprehensive test automation framework for DemoBlaze e-commerce website using Selenide, JUnit 5, and Allure reporting.

## Framework Features

- **Selenide 7.10.0** - Simplified WebDriver automation
- **JUnit 5** - Modern testing framework
- **Allure Reporting** - Rich test reports with screenshots
- **Page Object Model** - Clean separation of page logic
- **Centralized Test Data** - Organized test data management
- **Comprehensive Logging** - SLF4J with Logback
- **Screenshot on Failure** - Automatic screenshot capture

## Project Structure

```
src/
├── main/java/
│   ├── data/
│   │   └── TestData.java          # Centralized test data and selectors
│   └── pages/                     # Page Object Model classes
│       ├── HomePage.java
│       ├── ProductDetailsPage.java
│       ├── CartPage.java
│       ├── ContactModal.java
│       └── OrderPlacementPage.java
└── test/java/
    ├── base/
    │   └── BaseTest.java          # Base test configuration
    ├── tests/                     # Test classes
    │   ├── HomePageTest.java
    │   ├── CartPageTest.java
    │   ├── ContactModalTest.java
    │   └── OrderPlacementTest.java
    └── utils/
        └── TestListener.java      # Test listener for screenshots
```

## Getting Started

### Prerequisites
- Java 21
- Maven 3.6+
- Chrome browser

### Running Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=HomePageTest

# Run specific test method
mvn test -Dtest=ContactModalTest#testContactModalClose
```

### Generate Allure Reports
```bash
# Generate Allure report
mvn allure:serve
```

## Test Data Management

All test data is centralized in `TestData.java` with organized sections:
- **Products** - Product names and details
- **ContactFormData** - Contact form test data
- **OrderFormData** - Order placement data
- **Selectors** - CSS selectors and XPath expressions
- **Timeouts** - Wait times and delays

## Logging

- **Test Execution Logs**: `target/logs/test-execution.log`
- **Page Action Logs**: `target/logs/page-actions.log`
- **Console Output**: Real-time test progress

## Features Tested

- ✅ Home page navigation and elements
- ✅ Product catalog and details
- ✅ Shopping cart functionality
- ✅ Contact form modal
- ✅ Order placement workflow
- ✅ Form validation scenarios

## Browser Support

Currently configured for Chrome browser with full-screen execution and screenshot capabilities.