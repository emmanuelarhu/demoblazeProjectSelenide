package bdd;

import base.BaseTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import pages.HomePage;
import pages.CartPage;
import pages.ContactModal;
import pages.ProductDetailsPage;

import static com.codeborne.selenide.Selenide.switchTo;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * BDD-Style Tests using Given-When-Then methodology
 *
 * These tests follow BDD principles:
 * - Business-readable test names
 * - Given-When-Then structure
 * - User story focused scenarios
 * - Clear acceptance criteria
 *
 * Benefits:
 * - All BDD benefits without Cucumber complexity
 * - Works with existing infrastructure
 * - Easy to read and understand
 * - Stakeholder friendly
 */
@Tag("BDD")
@DisplayName("DemoBlaze E-commerce BDD Scenarios")
public class BddStyleTests extends BaseTest {

    // ========== HOME PAGE SCENARIOS ==========

    @Test
    @Tag("Smoke")
    @Tag("Navigation")
    @DisplayName("SCENARIO: User can view all navigation elements on home page")
    public void givenUserVisitsDemoBlaze_WhenViewingHomePage_ThenAllNavigationElementsShouldBeVisible() {
        // GIVEN: User navigates to DemoBlaze home page
        HomePage homePage = new HomePage().open();

        // WHEN: User views the home page
        // (Page is already loaded)

        // THEN: All navigation elements should be visible
        homePage.verifyNavigationElements()
                .verifyCategoriesSection()
                .verifyCarouselElements()
                .verifyFooterElements();
    }

    @Test
    @Tag("regression")
    @Tag("Products")
    @DisplayName("SCENARIO: User can view product listings with correct details")
    public void givenUserIsOnHomePage_WhenViewingProducts_ThenProductListingsShouldShowCorrectDetails() {
        // GIVEN: User is on the home page
        HomePage homePage = new HomePage().open();

        // WHEN: User views the product listings
        // (Products are displayed on page load)

        // THEN: Product listings should show correct details
        homePage.verifyProductDetails("Samsung galaxy s6", "$360", "The Samsung Galaxy S6")
                .verifyProductDetails("Nexus 6", "$650", "The Motorola Google Nexus 6")
                .verifyProductDetails("Nokia lumia 1520", "$820", "The Nokia Lumia 1520");
    }

    @Test
    @Tag("Navigation")
    @Tag("ProductDetails")
    @DisplayName("SCENARIO: User can navigate to product details and return to home")
    public void givenUserIsOnHomePage_WhenClickingOnProduct_ThenShouldNavigateToProductDetailsAndReturnHome() {
        // GIVEN: User is on the home page
        HomePage homePage = new HomePage().open();

        // WHEN: User clicks on a product
        homePage.clickProduct("Samsung galaxy s6");
        ProductDetailsPage productPage = new ProductDetailsPage();

        // THEN: Should navigate to product details
        productPage.verifyProductImage()
                  .verifyProductDetails("Samsung galaxy s6", "$360 *includes tax");

        // AND WHEN: User navigates back to home
        HomePage returnedHomePage = productPage.clickHome();

        // THEN: Should return to home page successfully
        returnedHomePage.verifyNavigationElements();
    }

    // ========== CART SCENARIOS ==========

    @Test
    @Tag("regression")
    @Tag("Cart")
    @DisplayName("SCENARIO: User can add product to cart and view it")
    public void givenUserViewsProduct_WhenAddingToCart_ThenProductShouldAppearInCart() {
        // GIVEN: User views a specific product
        HomePage homePage = new HomePage().open();
        homePage.clickProduct("Samsung galaxy s6");
        ProductDetailsPage productPage = new ProductDetailsPage();

        // WHEN: User adds the product to cart
        productPage.clickAddToCart();
        // Handle the alert
        handleAlert("Product added.");

        // AND WHEN: User navigates to cart
        homePage.openHomePage();
        CartPage cartPage = homePage.clickCartLink();

        // THEN: Product should appear in cart
        cartPage.verifyCartHeaders()
               .verifyProductInCart("Samsung galaxy s6");
    }

    @Test
    @Tag("Functional")
    @Tag("Cart")
    @DisplayName("SCENARIO: User can manage multiple products in cart")
    public void givenUserHasMultipleProducts_WhenManagingCart_ThenCartShouldReflectChanges() {
        // GIVEN: User adds multiple products to cart
        HomePage homePage = new HomePage().open();

        // Add first product
        homePage.clickProduct("Samsung galaxy s6");
        new ProductDetailsPage().clickAddToCart();
        handleAlert("Product added.");

        // Return to home and add second product
        homePage.openHomePage()
                .clickProduct("Nexus 6");
        new ProductDetailsPage().clickAddToCart();
        handleAlert("Product added.");

        // WHEN: User views the cart
        CartPage cartPage = homePage.openHomePage().clickCartLink();

        // THEN: Cart should contain both products
        cartPage.verifyProductInCart("Samsung galaxy s6")
               .verifyProductInCart("Nexus 6");

        // AND WHEN: User removes one product
        cartPage.clickDeleteButton("Samsung galaxy s6");

        // THEN: Only the remaining product should be in cart
        cartPage.verifyProductInCart("Nexus 6")
               .verifyProductNotInCart("Samsung galaxy s6");
    }

    // ========== CONTACT SCENARIOS ==========

    @Test
    @Tag("Smoke")
    @Tag("Contact")
    @DisplayName("SCENARIO: User can open and close contact modal")
    public void givenUserIsOnHomePage_WhenClickingContact_ThenContactModalShouldOpenAndClose() {
        // GIVEN: User is on the home page
        HomePage homePage = new HomePage().open();

        // WHEN: User clicks on Contact link
        homePage.clickContactLink();
        ContactModal contactModal = new ContactModal();

        // THEN: Contact modal should be displayed with all fields
        contactModal.verifyContactModalVisible();

        // AND WHEN: User closes the modal
        contactModal.clickClose();

        // THEN: Modal should be closed and user returns to home page
        homePage.verifyNavigationElements();
    }

    @Test
    @Tag("regression")
    @Tag("Contact")
    @DisplayName("SCENARIO: User can send contact message successfully")
    public void givenUserOpensContactModal_WhenFillingValidData_ThenMessageShouldBeSentSuccessfully() {
        // GIVEN: User opens the contact modal
        HomePage homePage = new HomePage().open();
        homePage.clickContactLink();
        ContactModal contactModal = new ContactModal();

        // WHEN: User fills the form with valid data
        contactModal.fillContactForm("emmanuel@example.com", "Emmanuel Arhu", "Test inquiry about your products");

        // AND WHEN: User sends the message
        contactModal.clickSendMessage();

        // THEN: Success message should be displayed
        handleAlert("Thanks for the message!!");
    }

    // ========== EDGE CASE SCENARIOS ==========

    @Test
    @Tag("Edge")
    @Tag("Navigation")
    @DisplayName("SCENARIO: User can navigate between different sections seamlessly")
    public void givenUserIsOnHomePage_WhenNavigatingBetweenSections_ThenNavigationShouldWorkSeamlessly() {
        // GIVEN: User starts on home page
        HomePage homePage = new HomePage().open();

        // WHEN: User navigates to cart
        CartPage cartPage = homePage.clickCartLink();
        cartPage.verifyCartHeaders();

        // AND WHEN: User returns to home
        homePage = cartPage.navigateToHome();
        homePage.verifyNavigationElements();

        // AND WHEN: User opens contact modal
        homePage.clickContactLink();
        ContactModal contactModal = new ContactModal();
        contactModal.verifyContactModalVisible();

        // AND WHEN: User closes modal
        contactModal.clickClose();

        // THEN: User should be back on home page with all elements working
        homePage.verifyNavigationElements()
               .verifyCategoriesSection();
    }

    // ========== HELPER METHODS ==========

    /**
     * Handles JavaScript alerts with expected message
     */
    private void handleAlert(String expectedMessage) {
        try {
            String alertText = switchTo().alert().getText();
            assertEquals(expectedMessage, alertText,
                "Alert message should match expected: " + expectedMessage);
            switchTo().alert().accept();
            // Use static logger since BaseTest logger is private
            System.out.println("✅ Successfully handled alert: " + expectedMessage);
        } catch (Exception e) {
            System.err.println("❌ Failed to handle alert: " + e.getMessage());
            throw new RuntimeException("Alert handling failed", e);
        }
    }
}