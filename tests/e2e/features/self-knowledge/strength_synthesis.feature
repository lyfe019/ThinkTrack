# tests/e2e/features/self-knowledge/strength_synthesis.feature

Feature: Strength-Based Synthesis
  As a learner with a neurodivergent profile
  I want my behavioral patterns to be reframed as strengths
  So that I can build self-knowledge without triggering shame.

  Scenario: Successfully synthesizing a new Strength Insight
    Given the user has 3 recent FocusBlocks showing a "High distraction after 15 mins" pattern
    When the Synthesis Process runs
    Then a new Insight should be created in the LearningProfile
    And the ReframedText should be "You are an Adaptable Explorer with high environmental awareness"
    And the Insight status should be "NEW"

  Scenario: Rejecting an insight with deficit-based language
    Given a pattern is detected as "Poor attention span"
    When the system attempts to create a ReframedInsight with this text
    Then the creation should fail
    And an error "Strength-First Rule: Insight contains forbidden deficit-based language" should be returned

  Scenario: Insufficient evidence for an insight
    Given the user has only 1 FocusBlock showing a "Morning energy spike" pattern
    When the system attempts to generate an Insight
    Then the creation should fail
    And an error "Insight requires at least 3 evidence links" should be returned