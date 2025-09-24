package tests;

import base.BaseTest;
import data.TestData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pages.HomePage;
import pages.ContactModal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static com.codeborne.selenide.WebDriverRunner.getWebDriver;
import static com.codeborne.selenide.Selenide.*;
import org.openqa.selenium.By;

public class ContactModalTest extends BaseTest {

    private static final Logger logger = LoggerFactory.getLogger(ContactModalTest.class);
    private HomePage homePage;
    private ContactModal contactModal;

    @BeforeEach
    void setUp() {
        logger.info("Setting up contact modal test instances");
        homePage = new HomePage();
        contactModal = new ContactModal();
        logger.info("Contact modal test setup completed");
    }

    @Test
    @DisplayName("Test sending valid contact data")
    void testSendValidContactData() {
        logger.info("Starting test: Send valid contact data");
        homePage.open();

        $(By.linkText("Contact")).click();

        contactModal.verifyContactModalVisible()
                .fillContactForm(
                        TestData.ContactFormData.ANOTHER_VALID_EMAIL,
                        TestData.ContactFormData.ANOTHER_VALID_NAME,
                        TestData.ContactFormData.ANOTHER_VALID_MESSAGE
                )
                .clickSendMessage();

        handleAlert();
        logger.info("Test completed successfully: Send valid contact data");
    }

    @Test
    @DisplayName("Test sending empty contact data")
    void testSendEmptyContactData() {
        logger.info("Starting test: Send empty contact data");
        homePage.open();

        $(By.linkText("Contact")).click();

        contactModal.verifyContactModalVisible()
                .clickSendMessage();

        handleAlert();
        logger.info("Test completed successfully: Send empty contact data");
    }

    @Test
    @DisplayName("Test sending invalid contact data")
    void testSendInvalidContactData() {
        logger.info("Starting test: Send invalid contact data");
        homePage.open();

        $(By.linkText("Contact")).click();

        contactModal.verifyContactModalVisible()
                .fillContactForm(
                        TestData.ContactFormData.INVALID_DATA_PATTERN,
                        TestData.ContactFormData.INVALID_DATA_PATTERN,
                        TestData.ContactFormData.INVALID_DATA_PATTERN
                )
                .clickSendMessage();

        handleAlert();

        homePage.verifyCategoriesSection();
        logger.info("Test completed successfully: Send invalid contact data");
    }

    @Test
    @DisplayName("Test contact modal close functionality")
    void testContactModalClose() {
        logger.info("Starting test: Contact modal close functionality");
        homePage.open();

        logger.info("Clicking Contact link to open modal");
        $(By.linkText("Contact")).click();

        // Wait a bit for the modal to appear
        try {
            Thread.sleep(TestData.Timeouts.ALERT_WAIT_MS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        contactModal.verifyContactModalVisible()
                .fillContactEmail(TestData.ContactFormData.VALID_EMAIL)
                .fillContactName(TestData.ContactFormData.VALID_NAME)
                .clickClose();
        logger.info("Test completed successfully: Contact modal close functionality");
    }

    private void handleAlert() {
        logger.debug("Handling JavaScript alert");
        try {
            Thread.sleep(TestData.Timeouts.ALERT_WAIT_MS);
            if (getWebDriver().switchTo().alert() != null) {
                String alertText = getWebDriver().switchTo().alert().getText();
                logger.info("Alert message: {}", alertText);
                getWebDriver().switchTo().alert().accept();
                logger.debug("Alert accepted successfully");
            }
        } catch (Exception e) {
            logger.debug("No alert present or error handling alert: {}", e.getMessage());
        }
    }
}