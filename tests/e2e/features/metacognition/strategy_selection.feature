Feature: Strategy Selection
  As a learner
  I want to select a strategy from the offered menu
  So that I can actively manage my cognitive load.

  Scenario: Selecting a Strategy
    Given an intervention is active with 3 strategy options
    When I select the "Active Recall" strategy
    Then the intervention should record the selection
    And a StrategySelected event should be dispatched

Scenario: Dismissing the Strategy Menu
    Given an intervention is active with 3 strategy options
    When I dismiss the strategy menu
    Then the intervention should record the impact as "DISMISSED"
    And no strategy should be selected