Feature: Soft-Landing Closure

  Scenario: Successfully completing a focus block
    Given an active Focus Block with 1 minute remaining
    When the session time expires
    Then the status should transition to "SOFT_LANDING"
    And I should be prompted to provide an Exit Mood
    When I submit an Exit Mood of "ACCOMPLISHED" with intent outcome "ACHIEVED"
    Then the status should be "COMPLETED"
    And a Focus Block Summary should be generated