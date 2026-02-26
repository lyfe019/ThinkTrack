# tests/e2e/features/self-knowledge/works_for_me_curation.feature

Feature: "Works for Me" Curation
  As a learner
  I want the app to track which study conditions actually work for me
  So that I can automate my success and reduce decision fatigue.

  Scenario: Updating an Optimal Block Duration
    Given the user has completed five 12-minute FocusBlocks with "FLOW" states
    And their current OptimalBlockDuration is "25 minutes"
    When the Curation Process runs
    Then the OptimalBlockDuration should be updated to "12 minutes"
    And a ProfileUpdated event should be dispatched

  Scenario: Strategy Re-evaluation Rule (30-day logic)
    Given a Golden Rule was last updated 31 days ago
    When the LearningProfile is checked for maintenance
    Then the profile should be flagged for "Re-evaluation"