package pages;
import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selenide.*;

import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.SelenideElement;
import org.openqa.selenium.By;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HomePage {

    private static final Logger logger = LoggerFactory.getLogger(HomePage.class);

    private final SelenideElement productStoreLink = Selenide.$(By.linkText("PRODUCT STORE"));
    private final SelenideElement homeLink = Selenide.$(By.cssSelector("li[class='nav-item active'] a[class='nav-link']"));
    private final SelenideElement contactLink = Selenide.$(By.cssSelector("a[data-target='#exampleModal']"));
    private final SelenideElement aboutUsLink = Selenide.$(By.cssSelector("a[data-target='#videoModal']"));
    private final SelenideElement cartLink = Selenide.$(By.cssSelector("#cartur"));
    private final SelenideElement loginLink = Selenide.$(By.cssSelector("#login2"));
    private final SelenideElement signUpLink = Selenide.$(By.cssSelector("#signin2"));
    private final SelenideElement categoriesLink = Selenide.$(By.cssSelector("#cat"));

    private final SelenideElement phonesCategory = Selenide.$(By.linkText("Phones"));
    private final SelenideElement laptopsCategory = Selenide.$(By.linkText("Laptops"));
    private final SelenideElement monitorsCategory = Selenide.$(By.linkText("Monitors"));

    private final SelenideElement carouselPreviousButton = Selenide.$(By.cssSelector(".carousel-control-prev"));
    private final SelenideElement carouselNextButton = Selenide.$(By.cssSelector(".carousel-control-next"));

    private final SelenideElement previousProductsButton = Selenide.$("#prev2");
    private final SelenideElement nextProductsButton = Selenide.$("#next2");

    private final SelenideElement copyrightText = Selenide.$(By.xpath("//p[contains(text(), 'Copyright © Product Store')]"));
    private final SelenideElement aboutUsHeading = Selenide.$(By.cssSelector("div[class='col-sm-4 col-lg-4 col-md-4'] b"));
    private final SelenideElement getInTouchHeading = Selenide.$(By.cssSelector("div[class='col-sm-3 col-lg-3 col-md-3'] b"));

    public HomePage open() {
        logger.info("Opening DemoBlaze home page");
        Selenide.open("https://www.demoblaze.com/index.html");
        logger.info("Home page opened successfully");
        return this;
    }

    public HomePage verifyNavigationElements() {
        logger.info("Verifying navigation elements are visible");
        productStoreLink.shouldBe(visible);
        homeLink.shouldBe(visible).shouldHave(text("Home"));
        contactLink.shouldBe(visible).shouldHave(text("Contact"));
        aboutUsLink.shouldBe(visible).shouldHave(text("About us"));
        cartLink.shouldBe(visible).shouldHave(text("Cart"));
        loginLink.shouldBe(visible).shouldHave(text("Log in"));
        signUpLink.shouldBe(visible).shouldHave(text("Sign up"));
        logger.info("All navigation elements verified successfully");
        return this;
    }

    public HomePage verifyCarouselElements() {
        logger.info("Verifying carousel elements are visible");
        carouselPreviousButton.shouldBe(visible);
        carouselNextButton.shouldBe(visible);
        logger.info("Carousel elements verified successfully");
        return this;
    }

    public HomePage verifyCategoriesSection() {
        logger.info("Verifying categories section");
        categoriesLink.shouldBe(visible).shouldHave(text("CATEGORIES"));
        phonesCategory.shouldBe(visible).shouldHave(text("Phones"));
        laptopsCategory.shouldBe(visible).shouldHave(text("Laptops"));
        monitorsCategory.shouldBe(visible).shouldHave(text("Monitors"));
        logger.info("Categories section verified successfully");
        return this;
    }

    public HomePage verifyProductsNavigationButtons() {
        logger.info("Verifying product navigation buttons");
        previousProductsButton.shouldBe(visible);
        nextProductsButton.shouldBe(visible);
        logger.info("Product navigation buttons verified successfully");
        return this;
    }

    public HomePage verifyFooterElements() {
        logger.info("Verifying footer elements");
        copyrightText.shouldBe(visible).shouldHave(text("Copyright © Product Store 2017"));
        aboutUsHeading.shouldBe(visible).shouldHave(text("About Us"));
        getInTouchHeading.shouldBe(visible).shouldHave(text("Get in Touch"));
        logger.info("Footer elements verified successfully");
        return this;
    }

    public SelenideElement getProductLink(String productName) {
        logger.debug("Getting first product link for: {}", productName);
        return Selenide.$$(By.cssSelector(".card-title")).first();
    }

    public SelenideElement getProductLink(String productName, int index) {
        logger.debug("Getting product link at index {} for: {}", index, productName);
        return Selenide.$$(By.cssSelector(".card-title")).get(index);
    }

    public SelenideElement getProductPrice(String price) {
        logger.debug("Getting product price element for: {}", price);
        return Selenide.$(By.xpath("//h5[text()='" + price + "']"));
    }

    public SelenideElement getProductDescription(String description) {
        logger.debug("Getting product description element containing: {}", description);
        return Selenide.$(By.xpath("//p[contains(text(), '" + description + "')]"));
    }

    public HomePage clickProduct(String productName) {
        logger.info("Clicking on first product: {}", productName);
        getProductLink(productName).click();
        logger.info("Successfully clicked on first product: {}", productName);
        return this;
    }

    public HomePage clickProduct(String productName, int index) {
        logger.info("Clicking on product at index {}: {}", index, productName);
        getProductLink(productName, index).click();
        logger.info("Successfully clicked on product at index {}: {}", index, productName);
        return this;
    }

    public HomePage verifyProductDetails(String productName, String price, String description) {
        logger.info("Verifying product details for: {} with price: {}", productName, price);
        getProductLink(productName).shouldBe(visible);
        getProductPrice(price).shouldBe(visible);
        getProductDescription(description).shouldBe(visible);
        logger.info("Product details verified successfully for: {}", productName);
        return this;
    }

    public CartPage clickCartLink() {
        logger.info("Navigating to cart page");
        cartLink.click();
        logger.info("Successfully navigated to cart page");
        return new CartPage();
    }

    public HomePage clickHomeLink() {
        logger.info("Clicking home link");
        homeLink.click();
        logger.info("Successfully clicked home link");
        return this;
    }
}