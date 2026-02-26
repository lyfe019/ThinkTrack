# tests/e2e/features/self-knowledge/non_punitive_dashboard.feature

Feature: Non-Punitive Dashboard
  As a neurodivergent user
  I want a dashboard that focuses on my growth and states
  So that I don't feel shamed by streaks or missed goals.

  Scenario: Successfully creating a safe dashboard
    Given raw data containing "stateHeatmap" and "recoveryRate"
    When the Dashboard Data is generated
    Then the dashboard should be created successfully

  Scenario: Blocking punitive data
    Given raw data containing a "session_streaks" count
    When the Dashboard Data is generated
    Then the dashboard creation should fail
    And the dashboard error should be "No-Shame Rule: Dashboard data cannot contain punitive or deficit-based metrics."