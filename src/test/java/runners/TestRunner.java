package runners;

import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

/**
 * JUnit 5 based Cucumber test runner for BDD tests
 * Supports Chrome and Firefox browsers through system properties
 *
 * Usage:
 * mvn test -Dtest=runners.TestRunner
 * mvn test -Dtest=runners.TestRunner -Dselenide.browser=chrome
 * mvn test -Dtest=runners.TestRunner -Dselenide.browser=firefox
 * mvn test -Dtest=runners.TestRunner -Dselenide.browser=firefox -Dselenide.headless=true
 */
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = "cucumber.plugin",
    value = "pretty,html:target/cucumber-reports/cucumber-html-report.html,json:target/cucumber-reports/cucumber.json,junit:target/cucumber-reports/Cucumber.xml,io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm")
@ConfigurationParameter(key = "cucumber.glue", value = "stepDefinitions,hooks")
@ConfigurationParameter(key = "cucumber.execution.dry-run", value = "false")
@ConfigurationParameter(key = "cucumber.publish.enabled", value = "false")
@ConfigurationParameter(key = "cucumber.filter.tags", value = "not @ignore")
public class TestRunner {
    // Browser configuration is handled in Hooks.java through system properties
    // Default: Chrome
    // Override with -Dselenide.browser=firefox for Firefox
}