package runners;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

/**
 * Cucumber test runner for JUnit 4 execution
 * Supports Chrome and Firefox browsers through system properties
 *
 * Usage:
 * mvn test -Dtest=runners.CucumberTestRunner
 * mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=chrome
 * mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=firefox
 * mvn test -Dtest=runners.CucumberTestRunner -Dselenide.browser=firefox -Dselenide.headless=true
 */
@RunWith(Cucumber.class)
@CucumberOptions(
    features = "src/test/resources/features",
    glue = {"stepDefinitions", "hooks"},
    plugin = {
        "pretty",
        "html:target/cucumber-reports/cucumber-html-report.html",
        "json:target/cucumber-reports/cucumber.json",
        "junit:target/cucumber-reports/Cucumber.xml",
        "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm"
    },
    tags = "not @ignore",
    dryRun = false,
    monochrome = true
)
public class CucumberTestRunner {
    // Browser configuration is handled in Hooks.java through system properties
    // Default: Chrome
    // Override with -Dselenide.browser=firefox for Firefox
}