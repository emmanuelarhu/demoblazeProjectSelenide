package tests;

import base.BaseTest;
import data.TestData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pages.HomePage;
import pages.ProductDetailsPage;
import pages.CartPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static com.codeborne.selenide.WebDriverRunner.getWebDriver;

public class CartPageTest extends BaseTest {

    private static final Logger logger = LoggerFactory.getLogger(CartPageTest.class);
    private HomePage homePage;
    private ProductDetailsPage productDetailsPage;
    private CartPage cartPage;

    @BeforeEach
    void setUp() {
        logger.info("Setting up cart test instances");
        homePage = new HomePage();
        productDetailsPage = new ProductDetailsPage();
        cartPage = new CartPage();
        logger.info("Cart test setup completed");
    }

    @Test
    @DisplayName("Add multiple products to cart and verify cart functionality")
    void testAddMultipleProductsToCart() {
        logger.info("Starting test: Add multiple products to cart");
        homePage.open()
                .verifyCategoriesSection()
                .clickProduct(TestData.Products.SAMSUNG_GALAXY_S6,0);

        productDetailsPage.verifyProductDetails(
                        TestData.Products.SAMSUNG_GALAXY_S6,
                        TestData.PricesWithTax.SAMSUNG_GALAXY_S6_PRICE_WITH_TAX
                )
                .clickAddToCart();

        handleAlert();

        productDetailsPage.clickHome();

        homePage.verifyCategoriesSection()
                .clickProduct(TestData.Products.NOKIA_LUMIA,1);

        productDetailsPage.verifyProductDetails(
                        TestData.Products.NOKIA_LUMIA,
                        TestData.PricesWithTax.NOKIA_LUMIA_PRICE_WITH_TAX
                )
                .clickAddToCart();

        handleAlert();

        productDetailsPage.clickHome();

        homePage.verifyCategoriesSection()
                .clickProduct(TestData.Products.NEXUS);

        productDetailsPage.verifyProductDetails(
                        TestData.Products.NEXUS,
                        TestData.PricesWithTax.NEXUS_PRICE_WITH_TAX
                )
                .clickAddToCart();

        handleAlert();

        productDetailsPage.clickAddToCart();
        handleAlert();

        homePage.clickCartLink();

        cartPage.verifyCartHeaders()
                .verifyProductInCart(TestData.Products.SAMSUNG_GALAXY_S6)
                .verifyProductInCart(TestData.Products.NOKIA_LUMIA);

        logger.info("Test completed successfully: Add multiple products to cart");
    }

    @Test
    @DisplayName("Test cart item deletion functionality")
    void testCartItemDeletion() {
        logger.info("Starting test: Cart item deletion functionality");
        addProductsToCart();

        homePage.clickCartLink();

        cartPage.verifyCartHeaders()
                .clickFirstDeleteButton()
                .verifyProductInCart(TestData.Products.SAMSUNG_GALAXY_S6);

        cartPage.clickDeleteButton(TestData.Products.SAMSUNG_GALAXY_S6)
                .verifyProductInCart(TestData.Products.SAMSUNG_GALAXY_S7);

        logger.info("Test completed successfully: Cart item deletion functionality");
    }

    private void addProductsToCart() {
        logger.info("Adding test products to cart");
        homePage.open()
                .clickProduct(TestData.Products.SAMSUNG_GALAXY_S6,0);

        productDetailsPage.clickAddToCart();
        handleAlert();

        productDetailsPage.clickHome();

        homePage.verifyCategoriesSection()
                .clickProduct(TestData.Products.NOKIA_LUMIA,1);

        productDetailsPage.clickAddToCart();
        handleAlert();

        productDetailsPage.clickHome();

        homePage.verifyCategoriesSection()
                .clickProduct(TestData.Products.SAMSUNG_GALAXY_S7,3);

        productDetailsPage.clickAddToCart();
        handleAlert();

        productDetailsPage.clickAddToCart();
        handleAlert();
        logger.info("Test products added to cart successfully");
    }

    private void handleAlert() {
        logger.debug("Handling JavaScript alert");
        try {
            Thread.sleep(TestData.Timeouts.ALERT_WAIT_MS);
            if (getWebDriver().switchTo().alert() != null) {
                String alertText = getWebDriver().switchTo().alert().getText();
                logger.debug("Alert message: {}", alertText);
                getWebDriver().switchTo().alert().accept();
                logger.debug("Alert accepted successfully");
            }
        } catch (Exception e) {
            logger.debug("No alert present or error handling alert: {}", e.getMessage());
        }
    }
}