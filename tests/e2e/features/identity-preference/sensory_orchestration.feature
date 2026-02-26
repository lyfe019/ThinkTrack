# tests/e2e/features/identity-preference/sensory_orchestration.feature

Feature: Sensory & Cognitive UI Orchestration
  As a user with sensory processing sensitivities
  I want the app interface to adjust its atmosphere
  So that the visual environment supports my current cognitive state.

  Scenario: Transitioning to Low Sensory Atmosphere
    Given the user has a "MinimalistMode" preference enabled
    When the system detects "HEAVY" cognitive load
    Then the VisualAtmosphere should shift to "LOW_SENSORY_BLUE"
    And all non-essential notifications must be muted

  Scenario: Manual Atmosphere Override
    Given the user is in a "NEUTRAL" atmosphere
    When the user manually selects "WARM_DUSK"
    Then the VisualAtmosphere must change to "WARM_DUSK" regardless of load