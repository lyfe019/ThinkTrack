Feature: Intentional Entry

  # Scenario 1: Happy Path
  Scenario: Starting a session with clear intent
    Given I have a "Medium" energy level
    And I have a Micro-Intent to "Draft the introduction"
    When I select a duration of 15 minutes
    Then a new Focus Block should be initiated
    And the status should be "ACTIVE"
    And the Target End Time should be 15 minutes from now

  # Scenario 2: Angry Path (Validation)
  Scenario: Attempting to start without a Micro-Intent
    Given I have a "High" energy level
    And my Micro-Intent is empty
    When I try to start a 10-minute block
    Then the system should reject the initiation
    And I should see a message: "Micro-Intent cannot be empty."