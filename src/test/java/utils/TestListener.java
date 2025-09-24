package utils;

import io.qameta.allure.Allure;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.WebDriverRunner;


public class TestListener implements TestWatcher {

    private static final Logger logger = LoggerFactory.getLogger(TestListener.class);

    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        logger.error("Test failed: {}", context.getDisplayName(), cause);
        attachScreenshot(context.getDisplayName());
    }

    @Override
    public void testSuccessful(ExtensionContext context) {
        logger.info("Test passed: {}", context.getDisplayName());
    }

    @Override
    public void testAborted(ExtensionContext context, Throwable cause) {
        logger.warn("Test aborted: {}", context.getDisplayName(), cause);
        attachScreenshot(context.getDisplayName());
    }

    private void attachScreenshot(String testName) {
        try {
            if (WebDriverRunner.hasWebDriverStarted()) {
                String screenshotPath = Selenide.screenshot(testName);
                if (screenshotPath != null) {
                    Allure.addAttachment("Screenshot on failure", "image/png",
                        new java.io.FileInputStream(screenshotPath), "png");
                    logger.info("Screenshot attached for test: {}", testName);
                }
            }
        } catch (Exception e) {
            logger.error("Failed to take screenshot for test: {}", testName, e);
        }
    }
}