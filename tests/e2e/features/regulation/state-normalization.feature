Feature: State Normalization

  Scenario: Normalizing heavy load into a "Stuck" state
    Given an active focus session with "HEAVY" cognitive load
    When I report feeling "FRUSTRATED"
    Then the Regulation State should be "STUCK"
    And I should receive a normalization message: "Being 'Stuck' is a natural part of deep learning. Your brain is searching for a connection."