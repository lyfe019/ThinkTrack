Feature: Burnout Warning

  Scenario: Detecting high load velocity during heavy work
    Given an active focus session with "HEAVY" cognitive load
    And the load velocity is "RISING"
    Then I should receive a burnout warning: "You've been working hard. Would a 2-minute stretch help?"