Feature: Cognitive Load Estimation

  Scenario: Detecting a heavy load from rapid signals
    Given an active focus session
    When the system detects a burst of "TAB_SWITCH" signals
    And the signal frequency exceeds the baseline
    Then the Cognitive Load should be categorized as "HEAVY"
    And the Load Velocity should be "RISING"