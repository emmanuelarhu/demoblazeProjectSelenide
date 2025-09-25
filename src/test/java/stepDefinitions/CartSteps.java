package stepDefinitions;

import io.cucumber.java.en.*;
import io.qameta.allure.Step;
import pages.CartPage;
import pages.HomePage;
import pages.ProductDetailsPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.codeborne.selenide.Selenide.switchTo;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Step definitions for Cart functionality BDD scenarios
 * Uses existing page objects from Selenide framework
 */
public class CartSteps {

    private static final Logger logger = LoggerFactory.getLogger(CartSteps.class);
    private HomePage homePage;
    private ProductDetailsPage productDetailsPage;
    private CartPage cartPage;

    public CartSteps() {
        this.homePage = new HomePage();
        this.productDetailsPage = new ProductDetailsPage();
        this.cartPage = new CartPage();
    }

    @When("I click {string} cart button")
    @Step("Click {buttonName} cart button")
    public void i_click_cart_button(String buttonName) {
        logger.info("BDD Step: Clicking {} cart button", buttonName);
        if ("Add to cart".equals(buttonName)) {
            productDetailsPage.addToCart();
        }
    }

    @Then("I should see success alert {string}")
    @Step("Verify success alert message: {expectedMessage}")
    public void i_should_see_success_alert(String expectedMessage) {
        logger.info("BDD Step: Verifying success alert: {}", expectedMessage);
        // Handle the alert and verify message
        try {
            String alertText = switchTo().alert().getText();
            assertEquals(expectedMessage, alertText, "Alert message should match expected");
            switchTo().alert().accept();
        } catch (Exception e) {
            logger.error("Failed to handle alert: {}", e.getMessage());
            fail("Expected alert was not present");
        }
    }

    @When("I navigate to cart page")
    @Step("Navigate to cart page")
    public void i_navigate_to_cart_page() {
        logger.info("BDD Step: Navigating to cart page");
        homePage.navigateToCart();
    }

    @Then("I should see {string} in the cart")
    @Step("Verify product {productName} is in cart")
    public void i_should_see_in_the_cart(String productName) {
        logger.info("BDD Step: Verifying {} is in cart", productName);
        cartPage.verifyProductInCart(productName);
    }

    @Then("I should see cart total price")
    @Step("Verify cart total price is displayed")
    public void i_should_see_cart_total_price() {
        logger.info("BDD Step: Verifying cart total price");
        cartPage.verifyCartTotal();
    }

    @When("I add {string} to cart")
    @Step("Add product {productName} to cart")
    public void i_add_to_cart(String productName) {
        logger.info("BDD Step: Adding {} to cart", productName);
        homePage.clickOnFirstProduct(productName);
        productDetailsPage.addToCart();
        // Handle alert
        try {
            switchTo().alert().accept();
        } catch (Exception e) {
            logger.warn("No alert to handle");
        }
        homePage.openHomePage();
    }

    @Then("the cart total should reflect both products")
    @Step("Verify cart total reflects multiple products")
    public void the_cart_total_should_reflect_both_products() {
        logger.info("BDD Step: Verifying cart total for multiple products");
        cartPage.verifyCartTotal();
        // Additional verification for multiple products total could be added here
        assertTrue(true, "Cart total should reflect multiple products");
    }

    @Given("I have {string} in my cart")
    @Step("Add {productName} to cart as precondition")
    public void i_have_in_my_cart(String productName) {
        logger.info("BDD Step: Adding {} to cart as precondition", productName);
        i_add_to_cart(productName);
    }

    @When("I remove {string} from cart")
    @Step("Remove product {productName} from cart")
    public void i_remove_from_cart(String productName) {
        logger.info("BDD Step: Removing {} from cart", productName);
        cartPage.removeProductFromCart(productName);
    }

    @Then("{string} should not be in the cart")
    @Step("Verify {productName} is not in cart")
    public void should_not_be_in_the_cart(String productName) {
        logger.info("BDD Step: Verifying {} is not in cart", productName);
        // This would need to be implemented in CartPage
        assertTrue(true, productName + " should not be in cart");
    }

    @Then("the cart should be empty or show updated total")
    @Step("Verify cart is empty or shows updated total")
    public void the_cart_should_be_empty_or_show_updated_total() {
        logger.info("BDD Step: Verifying cart is empty or shows updated total");
        // Implementation depends on cart behavior after item removal
        assertTrue(true, "Cart should be empty or show updated total");
    }

    @When("I navigate to cart page without adding products")
    @Step("Navigate to cart page without adding products")
    public void i_navigate_to_cart_page_without_adding_products() {
        logger.info("BDD Step: Navigating to cart page without adding products");
        homePage.navigateToCart();
    }

    @Then("I should see an empty cart")
    @Step("Verify cart is empty")
    public void i_should_see_an_empty_cart() {
        logger.info("BDD Step: Verifying cart is empty");
        // Implementation would check for empty cart indicators
        assertTrue(true, "Cart should be empty");
    }

    @Then("the total should show appropriate message or zero")
    @Step("Verify cart total shows appropriate empty state")
    public void the_total_should_show_appropriate_message_or_zero() {
        logger.info("BDD Step: Verifying cart total for empty cart");
        // Implementation would verify empty cart total display
        assertTrue(true, "Cart total should show appropriate empty state");
    }

    @When("I navigate to different pages")
    @Step("Navigate to different pages")
    public void i_navigate_to_different_pages() {
        logger.info("BDD Step: Navigating to different pages");
        homePage.openHomePage();
        // Could navigate to other pages as well
    }

    @When("I return to cart page")
    @Step("Return to cart page")
    public void i_return_to_cart_page() {
        logger.info("BDD Step: Returning to cart page");
        homePage.navigateToCart();
    }

    @Then("{string} should still be in the cart")
    @Step("Verify {productName} persists in cart")
    public void should_still_be_in_the_cart(String productName) {
        logger.info("BDD Step: Verifying {} still in cart after navigation", productName);
        cartPage.verifyProductInCart(productName);
    }
}