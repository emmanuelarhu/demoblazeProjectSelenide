package pages;

import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selenide.*;

import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.SelenideElement;
import org.openqa.selenium.By;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OrderPlacementPage {

    private static final Logger logger = LoggerFactory.getLogger(OrderPlacementPage.class);

    private final SelenideElement nameField = Selenide.$(By.id("name"));
    private final SelenideElement countryField = Selenide.$(By.id("country"));
    private final SelenideElement cityField = Selenide.$(By.id("city"));
    private final SelenideElement creditCardField = Selenide.$(By.id("card"));
    private final SelenideElement monthField = Selenide.$(By.id("month"));
    private final SelenideElement yearField = Selenide.$(By.id("year"));
    private final SelenideElement purchaseButton = Selenide.$(By.xpath("//button[text()='Purchase']"));
    private final SelenideElement closeButton = Selenide.$(By.xpath("//div[@id='orderModal']//button[@type='button'][normalize-space()='Close']"));

    public OrderPlacementPage fillName(String name) {
        logger.info("Filling name field with: {}", name);
        nameField.setValue(name);
        logger.debug("Name field filled successfully");
        return this;
    }

    public OrderPlacementPage fillCountry(String country) {
        logger.info("Filling country field with: {}", country);
        countryField.setValue(country);
        logger.debug("Country field filled successfully");
        return this;
    }

    public OrderPlacementPage fillCity(String city) {
        logger.info("Filling city field with: {}", city);
        cityField.setValue(city);
        logger.debug("City field filled successfully");
        return this;
    }

    public OrderPlacementPage fillCreditCard(String creditCard) {
        logger.info("Filling credit card field");
        creditCardField.setValue(creditCard);
        logger.debug("Credit card field filled successfully");
        return this;
    }

    public OrderPlacementPage fillMonth(String month) {
        logger.info("Filling month field with: {}", month);
        monthField.setValue(month);
        logger.debug("Month field filled successfully");
        return this;
    }

    public OrderPlacementPage fillYear(String year) {
        logger.info("Filling year field with: {}", year);
        yearField.setValue(year);
        logger.debug("Year field filled successfully");
        return this;
    }

    public OrderPlacementPage fillOrderDetails(String name, String country, String city,
                                               String creditCard, String month, String year) {
        logger.info("Filling complete order details for customer: {}", name);
        fillName(name);
        fillCountry(country);
        fillCity(city);
        fillCreditCard(creditCard);
        fillMonth(month);
        fillYear(year);
        logger.info("Order details filled successfully for customer: {}", name);
        return this;
    }

    public OrderPlacementPage clickPurchase() {
        logger.info("Clicking 'Purchase' button to complete order");
        purchaseButton.click();
        logger.info("Purchase button clicked successfully");
        return this;
    }



    public OrderPlacementPage clickClose() {
        logger.info("Clicking 'Close' button to cancel order");
        closeButton.click();
        logger.info("Close button clicked successfully");
        return this;
    }

    public OrderPlacementPage verifyOrderFormVisible() {
        logger.info("Verifying order placement form is visible");
        nameField.shouldBe(visible);
        countryField.shouldBe(visible);
        cityField.shouldBe(visible);
        creditCardField.shouldBe(visible);
        monthField.shouldBe(visible);
        yearField.shouldBe(visible);
        purchaseButton.shouldBe(visible);
        closeButton.shouldBe(visible);
        logger.info("Order placement form verified successfully");
        return this;
    }
}