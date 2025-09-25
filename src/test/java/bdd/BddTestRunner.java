package bdd;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.cucumber.core.cli.Main;

/**
 * Simple BDD test runner that uses Cucumber CLI
 */
public class BddTestRunner {

    private static final Logger logger = LoggerFactory.getLogger(BddTestRunner.class);

    @Test
    public void runCucumberTests() {
        logger.info("Starting Cucumber BDD tests via CLI");

        String[] cucumberArgs = {
            "--glue", "stepDefinitions",
            "--glue", "hooks",
            "--plugin", "pretty",
            "--plugin", "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm",
            "--tags", "@Simple",
            "src/test/resources/features/SimpleTest.feature"
        };

        try {
            Main.run(cucumberArgs, Thread.currentThread().getContextClassLoader());
            logger.info("Cucumber BDD tests completed successfully");
        } catch (Exception e) {
            logger.error("Cucumber BDD tests failed: {}", e.getMessage(), e);
            throw new RuntimeException("Cucumber tests failed", e);
        }
    }
}