# tests/e2e/features/self-knowledge/awareness_growth.feature

Feature: Awareness Growth Tracking
  As a learner
  I want to see how my ability to predict my focus improves
  So that I can trust my internal signals more.

  Scenario: Calculating an Improving Awareness Trend
    Given a user has two calibration snapshots:
      | Confidence | Actual Signal |
      | 5 (High)   | 2 (Low)       |
      | 3 (Mid)    | 3 (Mid)       |
    When the Growth Tracking process analyzes the history
    Then the TrendDirection should be "IMPROVING"
    And the accuracy score should increase