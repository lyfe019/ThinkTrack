# tests/e2e/features/identity-preference/preference_evolution.feature

Feature: Preference Evolution
  As a user whose needs change over time
  I want the system to recognize my manual override patterns
  So that my environment evolves without me having to manage settings.

  Scenario: Detecting consistent focus duration overrides
    Given a user has a default focus duration of 25 minutes
    And the user manually sets it to 15 minutes in 8 out of the last 10 sessions
    When the evolution analysis runs
    Then the system should suggest updating the "baseConfig" to 15 minutes

  Scenario: Ignoring inconsistent overrides
    Given a user has a default focus duration of 25 minutes
    And the user manually sets it to 45 minutes in only 3 out of the last 10 sessions
    When the evolution analysis runs
    Then the system should NOT suggest any changes