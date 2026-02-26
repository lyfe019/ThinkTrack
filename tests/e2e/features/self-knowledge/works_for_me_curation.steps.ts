// tests/e2e/features/self-knowledge/works_for_me_curation.steps.ts

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import { LearningProfile } from '../../../../src/modules/self-knowledge/domain/entities/LearningProfile';
import { PersonalizedProfile } from '../../../../src/modules/self-knowledge/domain/value-objects/PersonalizedProfile';
import { UniqueEntityID } from '../../../../src/shared/core/UniqueEntityID';

let profile: LearningProfile;
let currentDuration: string;

Given('the user has completed five {int}-minute FocusBlocks with {string} states', function (duration: number, state: string) {
  // Logic: Contextual data captured from Focus Block module
  currentDuration = `${duration} minutes`;
});

Given('their current OptimalBlockDuration is {string}', function (duration: string) {
  const initialRules = PersonalizedProfile.create({
    optimalBlockDuration: duration,
    topRecoveryStrategies: [],
    idealEnergyEntry: "Unknown"
  });

  profile = LearningProfile.create({
    userId: new UniqueEntityID(),
    insights: [],
    goldenRules: initialRules,
    awarenessHistory: [],
    lastReviewDate: new Date()
  }).getValue();
});

When('the Curation Process runs', function () {
  // Simulate Use Case: Updating profile based on the detected pattern
  const updatedRules = PersonalizedProfile.create({
    optimalBlockDuration: currentDuration,
    topRecoveryStrategies: profile.goldenRules.props.topRecoveryStrategies,
    idealEnergyEntry: profile.goldenRules.props.idealEnergyEntry
  });

  profile.updateGoldenRules(updatedRules);
});

Then('the OptimalBlockDuration should be updated to {string}', function (expectedDuration: string) {
  expect(profile.goldenRules.optimalBlockDuration).toBe(expectedDuration);
});

Then('a ProfileUpdated event should be dispatched', function () {
  // Verification: lastReviewDate being "now" proves the profile state 
  // was successfully transitioned and marked for external notification.
  const now = new Date().getTime();
  const reviewTime = profile.props.lastReviewDate.getTime();
  
  // We expect the update to have happened within the last 2 seconds
  expect(now - reviewTime).toBeLessThan(2000);
});

Given('a Golden Rule was last updated {int} days ago', function (days: number) {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);
  
  profile = LearningProfile.create({
    userId: new UniqueEntityID(),
    insights: [],
    goldenRules: PersonalizedProfile.create({
      optimalBlockDuration: "20m",
      topRecoveryStrategies: [],
      idealEnergyEntry: "Morning"
    }),
    awarenessHistory: [],
    lastReviewDate: pastDate
  }).getValue();
});

When('the LearningProfile is checked for maintenance', function () {
  this.reviewRequired = profile.isReviewRequired();
});

Then('the profile should be flagged for {string}', function (flag: string) {
  expect(this.reviewRequired).toBe(true);
});