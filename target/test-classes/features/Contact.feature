@Contact @UI @Communication
Feature: DemoBlaze Contact Modal
  As a user of DemoBlaze website
  I want to contact the support team
  So that I can get help or send inquiries

  Background:
    Given I navigate to the DemoBlaze home page

  @ContactModal @Smoke
  Scenario: Open and close contact modal
    When I click on "Contact" link
    Then the contact modal should be displayed
    And I should see contact form fields
    When I close the contact modal
    Then the contact modal should be hidden

  @ContactForm @regression
  Scenario: Send valid contact message
    When I click on "Contact" link
    And I fill the contact form with valid data:
      | field   | value                |
      | email   | emmanuel@example.com |
      | name    | Emmanuel Arhu        |
      | message | Test inquiry message |
    And I click "Send message" contact button
    Then I should see success alert "Thanks for the message!!"

  @ContactValidation @Functional
  Scenario Outline: Validate contact form fields
    When I click on "Contact" link
    And I fill the contact form with:
      | field   | value      |
      | email   | <email>    |
      | name    | <name>     |
      | message | <message>  |
    And I click "Send message" contact button
    Then I should see appropriate response for "<scenario>"

    Examples:
      | email                | name          | message           | scenario        |
      | valid@email.com      | Valid Name    | Valid message     | valid_data      |
      |                      | Test User     | Valid message     | missing_email   |
      | invalid@email.com    |               | Valid message     | missing_name    |
      | valid@email.com      | Valid Name    |                   | missing_message |

  @ContactFormReset @UI
  Scenario: Reset contact form
    When I click on "Contact" link
    And I fill the contact form with test data
    And I close the contact modal
    And I click on "Contact" link again
    Then the contact form should be empty

  @ContactFormPersistence @Edge
  Scenario: Contact form data persistence during session
    When I click on "Contact" link
    And I fill the contact form partially
    And I close the contact modal without sending
    And I click on "Contact" link again
    Then the form data should be cleared