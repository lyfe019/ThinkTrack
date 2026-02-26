Feature: Growth Reflection
  As a learner
  I want to reflect on how a strategy made me feel
  So that I can build better self-awareness of what works for my brain.

  Scenario: Completing a Micro-Reflection after a successful session
    Given a focus block has ended
    And I successfully used "Active Recall" to reach "FLOW"
    When the system asks: "Did Active Recall make this clearer, or just more tiring?"
    And I respond "Clearer"
    Then my MetacognitiveGrowthData should be updated