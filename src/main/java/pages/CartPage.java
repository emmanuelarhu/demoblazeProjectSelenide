package pages;

import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selenide.*;
import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.SelenideElement;
import org.openqa.selenium.By;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CartPage {

    private static final Logger logger = LoggerFactory.getLogger(CartPage.class);

    private final SelenideElement productsHeading = Selenide.$(By.xpath("//h2[text()='Products']"));
    private final SelenideElement totalHeading = Selenide.$(By.cssSelector("div[class='col-lg-1'] h2"));
    private final SelenideElement picHeader = Selenide.$(By.xpath("//th[text()='Pic']"));
    private final SelenideElement titleHeader = Selenide.$(By.xpath("//th[text()='Title']"));
    private final SelenideElement priceHeader = Selenide.$(By.xpath("//th[text()='Price']"));
    private final SelenideElement xHeader = Selenide.$(By.xpath("//th[text()='x']"));
    private final SelenideElement placeOrderButton = Selenide.$(By.xpath("//button[text()='Place Order']"));

    public CartPage verifyCartHeaders() {
        logger.info("Verifying cart page headers and elements");
        productsHeading.shouldBe(visible);
        totalHeading.shouldBe(visible);
        picHeader.shouldBe(visible);
        titleHeader.shouldBe(visible);
        priceHeader.shouldBe(visible);
        xHeader.shouldBe(visible);
        placeOrderButton.shouldBe(visible);
        logger.info("Cart headers and elements verified successfully");
        return this;
    }

    public SelenideElement getDeleteButtonForProduct(String productName) {
        logger.debug("Getting delete button for product: {}", productName);
        return Selenide.$(By.xpath("//tr[contains(., '" + productName + "')]//a[text()='Delete']"));
    }

    public SelenideElement getFirstDeleteButton() {
        logger.debug("Getting first delete button");
        return Selenide.$(By.xpath("(//a[text()='Delete'])[1]"));
    }

    public SelenideElement getDeleteButtonByIndex(int index) {
        logger.debug("Getting delete button at index: {}", index);
        return Selenide.$(By.xpath("(//a[text()='Delete'])[" + index + "]"));
    }

    public CartPage clickDeleteButton(String productName) {
        logger.info("Deleting product from cart: {}", productName);
        getDeleteButtonForProduct(productName).click();
        logger.info("Successfully deleted product from cart: {}", productName);
        return this;
    }

    public CartPage clickFirstDeleteButton() {
        logger.info("Clicking first delete button in cart");
        getFirstDeleteButton().click();
        logger.info("Successfully clicked first delete button");
        return this;
    }

    public CartPage clickDeleteButtonByIndex(int index) {
        logger.info("Clicking delete button at index: {}", index);
        getDeleteButtonByIndex(index).click();
        logger.info("Successfully clicked delete button at index: {}", index);
        return this;
    }

    public CartPage verifyProductInCart(String productName) {
        logger.info("Verifying product is in cart: {}", productName);
        Selenide.$(By.xpath("//td[normalize-space()='" + productName + "']")).shouldBe(visible);
        logger.info("Product verified in cart: {}", productName);
        return this;
    }

    public CartPage verifyProductNotInCart(String productName) {
        logger.info("Verifying product is NOT in cart: {}", productName);
        Selenide.$(By.xpath("//td[text()='" + productName + "']")).shouldNotBe(visible);
        logger.info("Product confirmed not in cart: {}", productName);
        return this;
    }

    public OrderPlacementPage clickPlaceOrder() {
        logger.info("Clicking 'Place Order' button");
        placeOrderButton.click();
        logger.info("Successfully clicked 'Place Order' button");
        return new OrderPlacementPage();
    }

    public HomePage navigateToHome() {
        logger.info("Navigating back to home page from cart");
        Selenide.$(By.cssSelector("li[class='nav-item active'] a[class='nav-link']")).click();
        logger.info("Successfully navigated to home page from cart");
        return new HomePage();
    }
}