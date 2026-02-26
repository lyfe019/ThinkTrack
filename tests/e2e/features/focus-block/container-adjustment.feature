Feature: Flexible Container Adjustment

  Scenario: Extending a session in Flow
    Given an active Focus Block with 5 minutes remaining
    When I request to "Swell" the block by 10 minutes
    Then the status must remain "ACTIVE"
    And the Target End Time should be updated to 15 minutes from now

  Scenario: Shortening the block due to sudden fatigue
    Given an active Focus Block with 15 minutes remaining
    When I request to "Shrink" the block by 13 minutes
    Then the status must remain "ACTIVE"
    And the Target End Time should be updated to 2 minutes from now