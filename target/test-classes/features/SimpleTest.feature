@Simple @Smoke
Feature: Simple DemoBlaze Test
  Simple test to verify BDD integration

  @Navigation
  Scenario: Verify home page loads
    Given I navigate to the DemoBlaze home page
    When I view the home page
    Then I should see the navigation bar with all elements