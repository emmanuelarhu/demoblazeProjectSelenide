package tests;

import base.BaseTest;
import data.TestData;
import pages.HomePage;
import pages.ProductDetailsPage;
import org.junit.jupiter.api.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HomePageTest extends BaseTest {

    private static final Logger logger = LoggerFactory.getLogger(HomePageTest.class);
    private HomePage homePage;
    private ProductDetailsPage productDetailsPage;

    @BeforeEach
    void setUp() {
        logger.info("Setting up test instances");
        homePage = new HomePage();
        productDetailsPage = new ProductDetailsPage();
        logger.info("Test setup completed");
    }

    @Test
    @DisplayName("Verify home page basic elements are visible")
    void testHomePageBasicElements() {
        logger.info("Starting test: Verify home page basic elements");
        homePage.open()
                .verifyNavigationElements()
                .verifyCarouselElements();
        logger.info("Test completed successfully: Verify home page basic elements");
    }

    @Test
    @DisplayName("Verify navigation bar elements are visible")
    void testNavigationBarElements() {
        logger.info("Starting test: Verify navigation bar elements");
        homePage.open()
                .verifyNavigationElements();
        logger.info("Test completed successfully: Verify navigation bar elements");
    }

    @Test
    @DisplayName("Verify categories section is visible")
    void testCategoriesSection() {
        logger.info("Starting test: Verify categories section");
        homePage.open()
                .verifyCategoriesSection();
        logger.info("Test completed successfully: Verify categories section");
    }

    @Test
    @DisplayName("Verify Samsung Galaxy S6 product details")
    void testSamsungGalaxyS6ProductDetails() {
        logger.info("Starting test: Verify Samsung Galaxy S6 product details");
        homePage.open()
                .verifyProductDetails(
                        TestData.Products.SAMSUNG_GALAXY_S6,
                        TestData.Prices.SAMSUNG_GALAXY_S6_PRICE,
                        TestData.ProductDescriptions.SAMSUNG_GALAXY_S6_DESCRIPTION
                )
                .clickProduct(TestData.Products.SAMSUNG_GALAXY_S6);

        productDetailsPage.verifyProductImage()
                .verifyProductDetails(
                        TestData.Products.SAMSUNG_GALAXY_S6,
                        TestData.PricesWithTax.SAMSUNG_GALAXY_S6_PRICE_WITH_TAX
                );

        productDetailsPage.clickHome();
        logger.info("Test completed successfully: Verify Samsung Galaxy S6 product details");
    }

    @Test
    @DisplayName("Verify Nokia Lumia product details")
    void testNokiaLumiaProductDetails() {
        logger.info("Starting test: Verify Nokia Lumia product details");
        homePage.open()
                .verifyProductDetails(
                        TestData.Products.NOKIA_LUMIA,
                        TestData.Prices.NOKIA_LUMIA_PRICE,
                        TestData.ProductDescriptions.NOKIA_LUMIA_DESCRIPTION
                )
                .clickProduct(TestData.Products.NOKIA_LUMIA);

        productDetailsPage.verifyProductImage()
                .verifyProductDetails(
                        TestData.Products.NOKIA_LUMIA,
                        TestData.PricesWithTax.NOKIA_LUMIA_PRICE_WITH_TAX
                );

        productDetailsPage.clickHome();
        logger.info("Test completed successfully: Verify Nokia Lumia product details");
    }

    @Test
    @DisplayName("Verify Nexus product details")
    void testNexusProductDetails() {
        logger.info("Starting test: Verify Nexus product details");
        homePage.open()
                .verifyProductDetails(
                        TestData.Products.NEXUS,
                        TestData.Prices.NEXUS_PRICE,
                        TestData.ProductDescriptions.NEXUS_DESCRIPTION
                )
                .clickProduct(TestData.Products.NEXUS);

        productDetailsPage.verifyProductImage()
                .verifyProductDetails(
                        TestData.Products.NEXUS,
                        TestData.PricesWithTax.NEXUS_PRICE_WITH_TAX
                );

        productDetailsPage.clickHome();
        logger.info("Test completed successfully: Verify Nexus product details");
    }

    @Test
    @DisplayName("Verify all products and footer elements on home page")
    void testAllProductsAndFooterElements() {
        logger.info("Starting test: Verify all products and footer elements");
        homePage.open()
                .verifyProductDetails(
                        TestData.Products.SAMSUNG_GALAXY_S7,
                        TestData.Prices.SAMSUNG_GALAXY_S7_PRICE,
                        TestData.ProductDescriptions.SAMSUNG_GALAXY_S7_DESCRIPTION
                )
                .verifyProductDetails(
                        TestData.Products.IPHONE_6_32GB,
                        TestData.Prices.IPHONE_6_32GB_PRICE,
                        TestData.ProductDescriptions.IPHONE_6_32GB_DESCRIPTION
                )
                .verifyProductDetails(
                        TestData.Products.SONY_XPERIA_Z5,
                        TestData.Prices.SONY_XPERIA_Z5_PRICE,
                        TestData.ProductDescriptions.SONY_XPERIA_Z5_DESCRIPTION
                )
                .verifyProductsNavigationButtons()
                .verifyFooterElements();
        logger.info("Test completed successfully: Verify all products and footer elements");
    }
}