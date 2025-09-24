package tests;

import base.BaseTest;
import data.TestData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pages.HomePage;
import pages.ProductDetailsPage;
import pages.CartPage;
import pages.OrderPlacementPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static com.codeborne.selenide.WebDriverRunner.getWebDriver;
import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selenide.*;
import org.openqa.selenium.By;

public class OrderPlacementTest extends BaseTest {

    private static final Logger logger = LoggerFactory.getLogger(OrderPlacementTest.class);
    private HomePage homePage;
    private ProductDetailsPage productDetailsPage;
    private CartPage cartPage;
    private OrderPlacementPage orderPlacementPage;

    @BeforeEach
    void setUp() {
        logger.info("Setting up order placement test instances");
        homePage = new HomePage();
        productDetailsPage = new ProductDetailsPage();
        cartPage = new CartPage();
        orderPlacementPage = new OrderPlacementPage();
        logger.info("Order placement test setup completed");
    }

    @Test
    @DisplayName("Test order placement with valid data")
    void testOrderPlacementWithValidData() {
        logger.info("Starting test: Order placement with valid data");
        addProductToCart();

        homePage.clickCartLink();

        $(By.xpath(String.format(TestData.Selectors.Cart.PRODUCT_PRICE_XPATH, TestData.TestValues.SAMPLE_PRICE))).shouldBe(visible);

        cartPage.verifyCartHeaders()
                .clickPlaceOrder();

        orderPlacementPage.verifyOrderFormVisible()
                .fillOrderDetails(
                        TestData.OrderFormData.VALID_NAME,
                        TestData.OrderFormData.VALID_COUNTRY,
                        TestData.OrderFormData.VALID_CITY,
                        TestData.OrderFormData.VALID_CREDIT_CARD,
                        TestData.OrderFormData.VALID_MONTH,
                        TestData.OrderFormData.VALID_YEAR
                )
                .clickPurchase();

        $(By.xpath(TestData.Selectors.Messages.THANK_YOU_PURCHASE)).shouldBe(visible);
        $(By.cssSelector(TestData.Selectors.Buttons.CONFIRM_BUTTON)).click();

        orderPlacementPage.verifyOrderFormVisible().clickClose();
        cartPage.navigateToHome();
        homePage.verifyCategoriesSection();
        logger.info("Test completed successfully: Order placement with valid data");
    }

    @Test
    @DisplayName("Test order placement with invalid data")
    void testOrderPlacementWithInvalidData() {
        logger.info("Starting test: Order placement with invalid data");
        addProductToCart();

        homePage.clickCartLink();

        cartPage.verifyCartHeaders()
                .clickPlaceOrder();

        orderPlacementPage.verifyOrderFormVisible()
                .fillOrderDetails(
                        TestData.OrderFormData.INVALID_DATA_PATTERN,
                        TestData.OrderFormData.INVALID_DATA_PATTERN,
                        TestData.OrderFormData.INVALID_DATA_PATTERN,
                        TestData.OrderFormData.INVALID_DATA_PATTERN,
                        TestData.OrderFormData.INVALID_DATA_PATTERN,
                        TestData.OrderFormData.INVALID_DATA_PATTERN
                )
                .clickPurchase();

        $(By.xpath(TestData.Selectors.Messages.THANK_YOU_PURCHASE)).shouldBe(visible);
        $(By.cssSelector(TestData.Selectors.Buttons.CONFIRM_BUTTON)).click();

        orderPlacementPage.verifyOrderFormVisible().clickClose();
        cartPage.navigateToHome();
        homePage.verifyCategoriesSection();
        logger.info("Test completed successfully: Order placement with invalid data");
    }

    @Test
    @DisplayName("Test order placement form close")
    void testOrderPlacementFormClose() {
        logger.info("Starting test: Order placement form close");
        addProductToCart();

        homePage.clickCartLink();

        cartPage.clickPlaceOrder();

        orderPlacementPage.verifyOrderFormVisible()
                .fillName(TestData.OrderFormData.TEST_NAME)
                .fillCountry(TestData.OrderFormData.TEST_COUNTRY)
                .clickClose();
        logger.info("Test completed successfully: Order placement form close");
    }

    private void addProductToCart() {
        logger.info("Adding product to cart for order test");
        homePage.open()
                .clickProduct(TestData.Products.SAMSUNG_GALAXY_S6);

        productDetailsPage.clickAddToCart();
        handleAlert();

        productDetailsPage.clickHome();
        logger.info("Product added to cart successfully");
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