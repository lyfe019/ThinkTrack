Feature: Cool-Down Enforcement
  As a user who just had an emergency exit
  I want the system to prevent me from jumping back in too quickly
  So that I have time to regulate my nervous system and avoid shame-cycling.

  Scenario: Attempting to restart too quickly after an emergency exit
    Given an active focus session
    When I trigger the "I'm Lost" emergency exit
    And I attempt to start a new focus session immediately
    Then I should be blocked with a message: "Cool-down active. Please wait"
    #And the focus session should be "ABANDONED"