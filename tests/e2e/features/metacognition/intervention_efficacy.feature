Feature: Intervention Impact Analyzer
  As a learner
  I want the system to track if a strategy actually helps me
  So that I can build a library of what works for my brain.

  Scenario: Successful Strategy Impact
    Given I selected "Active Recall" while in an "OVERLOADED" state
    When 5 minutes have passed
    And my current state is now "FLOW"
    Then the intervention efficacy should be recorded as "IMPROVED_FLOW"
    And an InsightGenerated event should be dispatched