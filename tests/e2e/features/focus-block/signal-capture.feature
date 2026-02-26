Feature: Signal Stream Capture

  Scenario: Capturing cognitive signals during a session
    Given an active Focus Block with 10 minutes remaining
    When the system detects a "TAB_SWITCH" signal
    And the system detects a "LONG_PAUSE" signal
    Then the signals should be recorded in the Signal Stream
    And the Focus Block should contain 2 signals