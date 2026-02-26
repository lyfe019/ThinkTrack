Feature: Intent Continuity

  Scenario: Carrying forward a partial intent
    Given an active Focus Block with 1 minute remaining
    When the session time expires
    And I submit an Exit Mood of "TIRED" with intent outcome "PARTIAL"
    Then the status should be "COMPLETED"
    And the response should suggest a "CONTINUATION" block for the next session