package pages;

import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selenide.*;

import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.SelenideElement;
import org.openqa.selenium.By;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ContactModal {

    private static final Logger logger = LoggerFactory.getLogger(ContactModal.class);

    private final SelenideElement contactEmailField = Selenide.$(By.id("recipient-email"));
    private final SelenideElement contactNameField = Selenide.$(By.id("recipient-name"));
    private final SelenideElement messageField = Selenide.$(By.id("message-text"));
    private final SelenideElement sendMessageButton = Selenide.$(By.xpath("//button[contains(text(), 'Send message')]"));
    private final SelenideElement closeButton = Selenide.$(By.xpath("//button[contains(text(), 'Close')] | //*[@class='close'] | //button[@data-dismiss='modal']"));
    private final SelenideElement contactModalTitle = Selenide.$(By.xpath("//*[contains(text(), 'New message')] | //h4 | //h5 | //*[@class='modal-title']"));

    public ContactModal fillContactEmail(String email) {
        logger.info("Filling contact email field with: {}", email);
        contactEmailField.setValue(email);
        logger.debug("Contact email field filled successfully");
        return this;
    }

    public ContactModal fillContactName(String name) {
        logger.info("Filling contact name field with: {}", name);
        contactNameField.setValue(name);
        logger.debug("Contact name field filled successfully");
        return this;
    }

    public ContactModal fillMessage(String message) {
        logger.info("Filling message field");
        messageField.setValue(message);
        logger.debug("Message field filled successfully");
        return this;
    }

    public ContactModal fillContactForm(String email, String name, String message) {
        logger.info("Filling complete contact form for: {} ({})", name, email);
        fillContactEmail(email);
        fillContactName(name);
        fillMessage(message);
        logger.info("Contact form filled successfully for: {}", name);
        return this;
    }

    public ContactModal clickSendMessage() {
        logger.info("Clicking 'Send message' button");
        sendMessageButton.click();
        logger.info("Send message button clicked successfully");
        return this;
    }

    public ContactModal clickClose() {
        logger.info("Clicking 'Close' button to close contact modal");
        closeButton.click();
        logger.info("Contact modal closed successfully");
        return this;
    }

    public ContactModal verifyContactModalVisible() {
        logger.info("Verifying contact modal is visible");
        // Wait for modal to be visible - check for the form fields first
        contactEmailField.shouldBe(visible);
        contactNameField.shouldBe(visible);
        messageField.shouldBe(visible);
        logger.info("Contact form fields verified successfully");
        return this;
    }

    // BDD-specific methods
    public ContactModal verifyModalVisible() {
        logger.info("BDD: Verifying contact modal visibility");
        return verifyContactModalVisible();
    }

    public ContactModal verifyFormFields() {
        logger.info("BDD: Verifying contact form fields");
        contactEmailField.shouldBe(visible);
        contactNameField.shouldBe(visible);
        messageField.shouldBe(visible);
        sendMessageButton.shouldBe(visible);
        closeButton.shouldBe(visible);
        logger.info("BDD: All contact form fields verified");
        return this;
    }

    public ContactModal closeModal() {
        logger.info("BDD: Closing contact modal");
        return clickClose();
    }
}