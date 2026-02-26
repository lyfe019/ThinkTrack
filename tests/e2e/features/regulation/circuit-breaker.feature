Feature: The Circuit Breaker (Emergency Exit)

  Scenario: Activating the "I'm Lost" button during a high-load session
    Given an active focus session
    And the current Cognitive Load is "HEAVY"
    When I trigger the "I'm Lost" emergency exit
    Then the focus session should be "ABANDONED"
    And I should see a Regulation Menu with options: "TAKE_5, SHRINK_TASK, SAVE_FOR_LATER"
    And I should see a regulation message: "Circuit breaker activated. Session aborted for your wellbeing."