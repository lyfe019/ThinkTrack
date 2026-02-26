Feature: Calibration Assessment
  As a learner
  I want the app to compare my self-reported confidence with my actual interaction data
  So that I can identify the "Illusion of Competence" without feeling judged.

  Scenario: Detecting a Calibration Gap (Illusion of Competence)
    Given a focus block is active with high signal friction
    When I report a confidence level of 5
    Then a Calibration Snapshot should be generated
    And the Gap Value should be high
    And the insight should be "ILLUSION_OF_COMPETENCE_RISK"
    And a CalibrationCompleted event should be dispatched

  Scenario: High Alignment (Flow State)
    Given a focus block is active with stable interaction signals
    When I report a confidence level of 4
    Then the Gap Value should be low
    And the insight should be "STABLE_ALIGNMENT"