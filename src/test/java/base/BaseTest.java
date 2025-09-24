package base;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.logevents.SelenideLogger;
import io.qameta.allure.selenide.AllureSelenide;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.TestListener;

import static com.codeborne.selenide.Selenide.closeWebDriver;

/**
 * Base test class providing common configuration for all tests
 * Configures Selenide settings, Allure integration, and automatic screenshot capture
 */
@ExtendWith(TestListener.class)
public abstract class BaseTest {

    private static final Logger logger = LoggerFactory.getLogger(BaseTest.class);

    @BeforeEach
    void setUpBase() {
        logger.info("Setting up base test configuration");

        Configuration.browser = "chrome";
        Configuration.browserSize = "1920x1080";
        Configuration.headless = false;
        Configuration.screenshots = true;
        Configuration.savePageSource = true;
        Configuration.reportsFolder = "target/screenshots";

        SelenideLogger.addListener("AllureSelenide", new AllureSelenide()
            .screenshots(true)
            .savePageSource(true));

        logger.info("Base test configuration completed");
    }

    @AfterEach
    void tearDownBase() {
        logger.info("Cleaning up test resources");
        SelenideLogger.removeListener("AllureSelenide");
        closeWebDriver();
        logger.info("Test cleanup completed");
    }
}