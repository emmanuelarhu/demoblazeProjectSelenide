package pages;

import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selenide.*;

import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.SelenideElement;
import org.openqa.selenium.By;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProductDetailsPage {

    private static final Logger logger = LoggerFactory.getLogger(ProductDetailsPage.class);

    private final SelenideElement productImage = Selenide.$("#imgp img");
    private final SelenideElement addToCartButton = Selenide.$(By.linkText("Add to cart"));
    private final SelenideElement homeLink = Selenide.$(By.cssSelector("li[class='nav-item active'] a[class='nav-link']"));

    public SelenideElement getProductHeading(String productName) {
        logger.debug("Getting product heading element for: {}", productName);
        return Selenide.$(By.cssSelector(".name"));
    }

    public SelenideElement getProductPriceWithTax(String priceWithTax) {
        logger.debug("Getting product price with tax element for: {}", priceWithTax);
        return Selenide.$(By.cssSelector(".price-container"));
    }

    public ProductDetailsPage verifyProductImage() {
        logger.info("Verifying product image is visible");
        productImage.shouldBe(visible);
        logger.info("Product image verified successfully");
        return this;
    }

    public ProductDetailsPage verifyProductDetails(String productName, String priceWithTax) {
        logger.info("Verifying product details for: {} with price: {}", productName, priceWithTax);
        getProductHeading(productName).shouldBe(visible);
        getProductPriceWithTax(priceWithTax).shouldBe(visible);
        addToCartButton.shouldBe(visible);
        logger.info("Product details verified successfully for: {}", productName);
        return this;
    }

    public ProductDetailsPage clickAddToCart() {
        logger.info("Clicking 'Add to cart' button");
        addToCartButton.click();
        logger.info("Successfully clicked 'Add to cart' button");
        return this;
    }

    public HomePage clickHome() {
        logger.info("Navigating back to home page");
        homeLink.click();
        logger.info("Successfully navigated to home page");
        return new HomePage();
    }
}