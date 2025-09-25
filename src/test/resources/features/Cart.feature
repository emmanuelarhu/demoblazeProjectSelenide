@Cart @UI @Critical
Feature: DemoBlaze Shopping Cart
  As a customer on DemoBlaze e-commerce website
  I want to manage items in my shopping cart
  So that I can review and purchase selected products

  Background:
    Given I navigate to the DemoBlaze home page

  @AddToCart @Smoke
  Scenario: Add product to cart successfully
    When I click on "Samsung galaxy s6" product
    And I click "Add to cart" cart button
    Then I should see success alert "Product added"
    When I navigate to cart page
    Then I should see "Samsung galaxy s6" in the cart
    And I should see cart total price

  @CartManagement @Critical
  Scenario: Manage multiple products in cart
    When I add "Samsung galaxy s6" to cart
    And I add "Nexus 6" to cart
    And I navigate to cart page
    Then I should see "Samsung galaxy s6" in the cart
    And I should see "Nexus 6" in the cart
    And the cart total should reflect both products

  @RemoveFromCart @Functional
  Scenario: Remove product from cart
    Given I have "Samsung galaxy s6" in my cart
    When I navigate to cart page
    And I remove "Samsung galaxy s6" from cart
    Then "Samsung galaxy s6" should not be in the cart
    And the cart should be empty or show updated total

  @EmptyCart @Edge
  Scenario: Verify empty cart behavior
    When I navigate to cart page without adding products
    Then I should see an empty cart
    And the total should show appropriate message or zero

  @CartPersistence @Functional
  Scenario: Verify cart maintains items across navigation
    Given I add "Nokia lumia 1520" to cart
    When I navigate to different pages
    And I return to cart page
    Then "Nokia lumia 1520" should still be in the cart