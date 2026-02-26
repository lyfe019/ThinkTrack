# tests/e2e/features/identity-preference/profile_initialization.feature

Feature: Profile-Driven Initialization
  As a new user
  I want the app to pre-configure itself based on my neurodivergent profile
  So that I don't have to face a complex setup process while overwhelmed.

  Scenario: Setting defaults for an ADHD profile
    Given a new user selects the "ADHD" identity tag
    When the initialization process runs
    Then the "DefaultFocusBlockDuration" should be set to 10 minutes
    And the "PromptFrequency" should be "HIGH"
    And the UI complexity should be "STANDARD"

  Scenario: Voluntary nature of identity tags
    Given a user has an "ADHD" profile
    When the user changes their tag to "NEUROTYPICAL"
    Then the system should suggest a new configuration
    But the user's previous learning history must not be reset