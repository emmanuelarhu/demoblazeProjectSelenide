package hooks;

import base.BaseTest;
import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.logevents.SelenideLogger;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.qameta.allure.Allure;
import io.qameta.allure.selenide.AllureSelenide;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.codeborne.selenide.Selenide.closeWebDriver;
import static com.codeborne.selenide.Selenide.screenshot;

/**
 * Cucumber hooks for test setup and teardown
 * Integrates with existing BaseTest configuration and Allure reporting
 */
public class Hooks {

    private static final Logger logger = LoggerFactory.getLogger(Hooks.class);

    @Before
    public void setUp(Scenario scenario) {
        logger.info("Starting BDD scenario: {}", scenario.getName());

        // Configure Selenide (same as BaseTest)
        Configuration.browser = System.getProperty("selenide.browser", "chrome");
        Configuration.browserSize = System.getProperty("selenide.browserSize", "1920x1080");
        Configuration.headless = Boolean.parseBoolean(System.getProperty("selenide.headless", "false"));
        Configuration.screenshots = true;
        Configuration.savePageSource = true;
        Configuration.reportsFolder = "target/screenshots";

        // Setup Allure integration
        SelenideLogger.addListener("AllureSelenide", new AllureSelenide()
                .screenshots(true)
                .savePageSource(true));

        logger.info("BDD test environment configured for scenario: {}", scenario.getName());
    }

    @After
    public void tearDown(Scenario scenario) {
        logger.info("Finishing BDD scenario: {} - Status: {}", scenario.getName(),
                   scenario.getStatus().toString());

        // Take screenshot on failure
        if (scenario.isFailed()) {
            logger.error("Scenario failed: {}", scenario.getName());
            try {
                String screenshotName = "failed_scenario_" + System.currentTimeMillis();
                String screenshotPath = screenshot(screenshotName);
                if (screenshotPath != null) {
                    // Attach to Cucumber report
                    byte[] screenshot = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(screenshotPath));
                    scenario.attach(screenshot, "image/png", "Screenshot");

                    // Attach to Allure report
                    try (var inputStream = java.nio.file.Files.newInputStream(java.nio.file.Paths.get(screenshotPath))) {
                        Allure.addAttachment("Failed Scenario Screenshot", "image/png", inputStream, ".png");
                    }
                }
            } catch (Exception e) {
                logger.error("Failed to capture screenshot: {}", e.getMessage());
            }
        }

        // Cleanup
        SelenideLogger.removeListener("AllureSelenide");
        closeWebDriver();
        logger.info("BDD test cleanup completed for scenario: {}", scenario.getName());
    }
}