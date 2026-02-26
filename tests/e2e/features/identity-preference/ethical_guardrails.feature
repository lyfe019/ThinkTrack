# tests/e2e/features/identity-preference/ethical_guardrails.feature

Feature: Ethical Guardrail Enforcement
  As a user in a high-stress state
  I want the system to protect me from sensory overload and shame
  So that I can recover without added pressure.

  Scenario: Auto-Minimalism during Heavy Load
    Given the user is currently using "STANDARD" UI complexity
    When the Regulation Context signals a "HEAVY" cognitive load
    Then the UI complexity must automatically switch to "MINIMALIST"
    And it should remain "MINIMALIST" even if the load drops to "CALM" for only 1 minute

  Scenario: Blocking forbidden metrics
    Given a developer attempts to request a "User Streak" metric
    When the Identity & Preference context processes the request
    Then an "AccessDenied" exception should be thrown
    And the system must refuse to calculate any comparative rankings