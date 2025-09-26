@OrderPlacement @E2E @regression
Feature: DemoBlaze Order Placement
  As a customer on DemoBlaze e-commerce website
  I want to place orders for items in my cart
  So that I can complete my purchase and receive the products

  Background:
    Given I navigate to the DemoBlaze home page

  @PlaceOrder @Smoke
  Scenario: Place order successfully with valid details
    Given I add "Samsung galaxy s6" to cart
    When I navigate to cart page
    And I click place order button
    Then I should see the order placement form
    When I fill order details with valid information:
      | field       | value              |
      | name        | John Doe           |
      | country     | USA                |
      | city        | New York           |
      | creditCard  | 1234567890123456   |
      | month       | 12                 |
      | year        | 2025               |
    And I click purchase button
    Then I should see order success message
    And I should see order confirmation with details

  @OrderValidation @Functional
  Scenario: Validate order form fields
    Given I add "Nokia lumia 1520" to cart
    When I navigate to cart page
    And I click place order button
    Then I should see the order placement form
    And I should see all required order fields:
      | field       |
      | name        |
      | country     |
      | city        |
      | creditCard  |
      | month       |
      | year        |
    And I should see purchase button
    And I should see close button

  @OrderFormValidation @Edge
  Scenario Outline: Validate order form with different data combinations
    Given I add "Nexus 6" to cart
    When I navigate to cart page
    And I click place order button
    And I fill order details:
      | field       | value        |
      | name        | <name>       |
      | country     | <country>    |
      | city        | <city>       |
      | creditCard  | <creditCard> |
      | month       | <month>      |
      | year        | <year>       |
    And I click purchase button
    Then I should see appropriate response for order "<scenario>"

    Examples:
      | name      | country | city      | creditCard       | month | year | scenario        |
      | John Doe  | USA     | New York  | 1234567890123456 | 12    | 2025 | valid_order     |
      |           | USA     | New York  | 1234567890123456 | 12    | 2025 | missing_name    |
      | John Doe  |         | New York  | 1234567890123456 | 12    | 2025 | missing_country |
      | John Doe  | USA     |           | 1234567890123456 | 12    | 2025 | missing_city    |
      | John Doe  | USA     | New York  |                  | 12    | 2025 | missing_card    |

  @OrderCancel @UI
  Scenario: Cancel order placement
    Given I add "Iphone 6 32gb" to cart
    When I navigate to cart page
    And I click place order button
    Then I should see the order placement form
    When I fill order details with sample data
    And I click close button
    Then I should be back to cart page
    And the order should not be processed

  @MultipleProductsOrder @E2E
  Scenario: Place order with multiple products
    Given I add "Samsung galaxy s6" to cart
    And I add "Nokia lumia 1520" to cart
    When I navigate to cart page
    Then I should see "Samsung galaxy s6" in the cart
    And I should see "Nokia lumia 1520" in the cart
    When I click place order button
    And I fill order details with valid information:
      | field       | value              |
      | name        | Jane Smith         |
      | country     | Canada             |
      | city        | Toronto            |
      | creditCard  | 9876543210987654   |
      | month       | 06                 |
      | year        | 2026               |
    And I click purchase button
    Then I should see order success message
    And the order should include all products

  @OrderPersistence @Functional
  Scenario: Verify order form data persistence during session
    Given I add "MacBook air" to cart
    When I navigate to cart page
    And I click place order button
    And I fill order details partially:
      | field       | value              |
      | name        | Test User          |
      | country     | Test Country       |
      | city        | Test City          |
    And I click close button
    And I click place order button again
    Then the order form should be empty

  @EmptyCartOrder @Edge
  Scenario: Attempt to place order with empty cart
    When I navigate to cart page without adding products
    Then I should see an empty cart
    And the place order button should be disabled or not visible