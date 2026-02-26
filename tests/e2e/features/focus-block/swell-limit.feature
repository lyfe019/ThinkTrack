Feature: Swell Limit Safety Valve

  Scenario: Extending within safe limits
    Given an active Focus Block with an original duration of 10 minutes
    When I request to "Swell" the block by 15 minutes
    Then the status must remain "ACTIVE"

  Scenario: Reaching the hyperfocus safety limit
    Given an active Focus Block with an original duration of 10 minutes
    When I request to "Swell" the block by 25 minutes
    Then the system should reject the adjustment
    And the status should transition to "META_CHECKPOINT"
    And I should see a message: "Hyperfocus limit reached. Please complete a metacognitive check."