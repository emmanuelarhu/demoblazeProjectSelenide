package bdd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.codeborne.selenide.Selenide.switchTo;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * BDD Test Utilities - Common patterns for BDD-style testing
 *
 * Provides reusable methods that support Given-When-Then scenarios
 * while working seamlessly with the existing Selenide framework
 */
public class BddTestUtils {

    private static final Logger logger = LoggerFactory.getLogger(BddTestUtils.class);

    /**
     * Handles JavaScript alerts with verification
     * Used in THEN steps to verify expected outcomes
     */
    public static void handleAlert(String expectedMessage) {
        try {
            String alertText = switchTo().alert().getText();
            assertEquals(expectedMessage, alertText,
                String.format("Expected alert message '%s' but got '%s'", expectedMessage, alertText));
            switchTo().alert().accept();
            logger.info("✅ BDD THEN: Successfully verified and handled alert: '{}'", expectedMessage);
        } catch (Exception e) {
            logger.error("❌ BDD THEN: Failed to handle alert - {}", e.getMessage());
            throw new RuntimeException("BDD Alert verification failed: " + e.getMessage(), e);
        }
    }

    /**
     * Logs BDD step execution for better readability
     */
    public static void logGivenStep(String description) {
        logger.info("🔵 BDD GIVEN: {}", description);
    }

    public static void logWhenStep(String description) {
        logger.info("🟡 BDD WHEN: {}", description);
    }

    public static void logThenStep(String description) {
        logger.info("🟢 BDD THEN: {}", description);
    }

    public static void logAndWhenStep(String description) {
        logger.info("🟡 BDD AND WHEN: {}", description);
    }

    public static void logAndThenStep(String description) {
        logger.info("🟢 BDD AND THEN: {}", description);
    }

    /**
     * Wrapper for common BDD scenarios
     */
    public static class Scenario {

        public static void given(String description, Runnable action) {
            logGivenStep(description);
            action.run();
        }

        public static void when(String description, Runnable action) {
            logWhenStep(description);
            action.run();
        }

        public static void then(String description, Runnable action) {
            logThenStep(description);
            action.run();
        }

        public static void andWhen(String description, Runnable action) {
            logAndWhenStep(description);
            action.run();
        }

        public static void andThen(String description, Runnable action) {
            logAndThenStep(description);
            action.run();
        }
    }

    /**
     * Common test data for BDD scenarios
     */
    public static class TestData {

        public static class User {
            public static final String VALID_EMAIL = "emmanuel@example.com";
            public static final String VALID_NAME = "Emmanuel Arhu";
            public static final String CONTACT_MESSAGE = "Test inquiry about your products";
        }

        public static class Product {
            public static final String SAMSUNG_S6 = "Samsung galaxy s6";
            public static final String SAMSUNG_S6_PRICE = "$360";
            public static final String NEXUS_6 = "Nexus 6";
            public static final String NEXUS_6_PRICE = "$650";
            public static final String NOKIA_1520 = "Nokia lumia 1520";
            public static final String NOKIA_1520_PRICE = "$820";
        }

        public static class Alert {
            public static final String PRODUCT_ADDED = "Product added.";
            public static final String MESSAGE_SENT = "Thanks for the message!!";
        }
    }
}