@HomePage @UI
Feature: DemoBlaze Home Page
  As a user visiting DemoBlaze e-commerce website
  I want to navigate and interact with the home page
  So that I can browse products and access different sections

  Background:
    Given I navigate to the DemoBlaze home page

  @Navigation @Smoke
  Scenario: Verify navigation bar elements are visible
    When I view the home page
    Then I should see the navigation bar with all elements
    And the "Home" link should be visible
    And the "Contact" link should be visible
    And the "About us" link should be visible
    And the "Cart" link should be visible
    And the "Log in" link should be visible
    And the "Sign up" link should be visible

  @Categories @Smoke
  Scenario: Verify product categories section
    When I view the home page
    Then I should see the categories section
    And I should see "CATEGORIES" header
    And I should see "Phones" category
    And I should see "Laptops" category
    And I should see "Monitors" category

  @Products @regression
  Scenario: Verify product listings on home page
    When I view the home page
    Then I should see product listings
    And I should see "Samsung galaxy s6" product with price "$360"
    And I should see "Nexus 6" product with price "$650"
    And I should see "Samsung galaxy s7" product with price "$800"
    And I should see "Iphone 6 32gb" product with price "$790"
    And I should see "Sony xperia z5" product with price "$320"
    And I should see "Nokia lumia 1520" product with price "$820"

  @ProductDetails @regression
  Scenario Outline: Verify individual product details
    When I view the home page
    And I click on "<productName>" product
    Then I should navigate to the product details page
    And I should see the product image
    And I should see product title as "<productName>"
    And I should see product price as "<price> *includes tax"
    When I navigate back to home page
    Then I should be on the home page

    Examples:
      | productName      | price |
      | Samsung galaxy s6| $360  |
      | Nexus 6          | $650  |
      | Nokia lumia 1520 | $820  |

  @Footer @UI
  Scenario: Verify footer elements
    When I view the home page
    And I scroll to the footer
    Then I should see footer section
    And I should see "About Us" in footer
    And I should see "Get in Touch" in footer
    And I should see contact information in footer

  @Carousel @UI
  Scenario: Verify carousel functionality
    When I view the home page
    Then I should see the product carousel
    And the carousel should be functional