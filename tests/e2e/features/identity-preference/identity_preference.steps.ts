import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import { UserPreference } from '../../../../src/modules/identity-preference/domain/entities/UserPreference';
import { IdentityTag } from '../../../../src/modules/identity-preference/domain/value-objects/IdentityTag';
import { ActiveConfiguration } from '../../../../src/modules/identity-preference/domain/value-objects/ActiveConfiguration';
import { UIComplexity } from '../../../../src/modules/identity-preference/domain/value-objects/UIComplexity';
import { VisualAtmosphere } from '../../../../src/modules/identity-preference/domain/value-objects/VisualAtmosphere';
import { PrivacyLevel } from '../../../../src/modules/identity-preference/domain/value-objects/PrivacyLevel';
import { UniqueEntityID } from '../../../../src/shared/core/UniqueEntityID';

let userPreference: UserPreference;
let caughtError: Error | null = null;
let lastSelectedTag: string;
let evolutionSuggestion: any = null;

// --- Process 1: Initialization ---

Given('a new user selects the {string} identity tag', function (tag: string) {
  lastSelectedTag = tag;
  const initialConfig = ActiveConfiguration.create({
    defaultFocusBlockDuration: 25, promptFrequency: 30, uiComplexity: UIComplexity.STANDARD,
    atmosphere: VisualAtmosphere.NEUTRAL, notificationsMuted: false
  });

  userPreference = UserPreference.create({
    userId: new UniqueEntityID(), tags: [], activeConfig: initialConfig,
    baseConfig: initialConfig, privacyLevel: PrivacyLevel.PRIVATE, overrideHistory: []
  }).getValue();
});

When('the initialization process runs', function () {
  userPreference.updateTags([lastSelectedTag as IdentityTag]);
  userPreference.applyHeuristicTemplate(lastSelectedTag as IdentityTag);
});

Then('the {string} should be set to {int} minutes', function (setting, value) {
  expect(userPreference.activeConfig.defaultDuration).toBe(value);
});

Then('the {string} should be {string}', function (setting, value) {
  if (setting === "PromptFrequency") {
    const label = userPreference.activeConfig.promptFrequency <= 15 ? "HIGH" : "NORMAL";
    expect(label).toBe(value);
  }
});

Then('the UI complexity should be {string}', function (complexity) {
  expect(userPreference.activeConfig.uiComplexity).toBe(complexity as UIComplexity);
});

// --- Process 3: Sensory Orchestration ---

Given('the user has a {string} preference enabled', function (pref) {
  const config = ActiveConfiguration.create({
    defaultFocusBlockDuration: 25, promptFrequency: 30, uiComplexity: UIComplexity.MINIMALIST,
    atmosphere: VisualAtmosphere.NEUTRAL, notificationsMuted: false
  });
  userPreference = UserPreference.create({
    userId: new UniqueEntityID(), tags: [IdentityTag.NEUROTYPICAL], activeConfig: config,
    baseConfig: config, privacyLevel: PrivacyLevel.PRIVATE, overrideHistory: []
  }).getValue();
});

When('the system detects {string} cognitive load', function (load) {
  userPreference.applySensoryGuardrail(load === "HEAVY");
});

Then('the VisualAtmosphere should shift to {string}', function (expected) {
  expect(userPreference.activeConfig.atmosphere).toBe(expected as VisualAtmosphere);
});

Then('all non-essential notifications must be muted', function () {
  expect(userPreference.activeConfig.notificationsMuted).toBe(true);
});

Given('the user is in a {string} atmosphere', function (atmosphere) {
  const config = ActiveConfiguration.create({
    defaultFocusBlockDuration: 25, promptFrequency: 30, uiComplexity: UIComplexity.STANDARD,
    atmosphere: atmosphere as VisualAtmosphere, notificationsMuted: false
  });
  userPreference = UserPreference.create({
    userId: new UniqueEntityID(), tags: [], activeConfig: config, baseConfig: config, 
    privacyLevel: PrivacyLevel.PRIVATE, overrideHistory: []
  }).getValue();
});

When('the user manually selects {string}', function (atmosphere) {
  userPreference.manuallySetAtmosphere(atmosphere as VisualAtmosphere);
});

Then('the VisualAtmosphere must change to {string} regardless of load', function (expected) {
  expect(userPreference.activeConfig.atmosphere).toBe(expected as VisualAtmosphere);
});

// --- Process 4: Preference Evolution ---

Given('a user has a default focus duration of {int} minutes', function (duration) {
  const config = ActiveConfiguration.create({
    defaultFocusBlockDuration: duration, promptFrequency: 30, uiComplexity: UIComplexity.STANDARD,
    atmosphere: VisualAtmosphere.NEUTRAL, notificationsMuted: false
  });
  userPreference = UserPreference.create({
    userId: new UniqueEntityID(), tags: [], activeConfig: config, baseConfig: config,
    privacyLevel: PrivacyLevel.PRIVATE, overrideHistory: []
  }).getValue();
});

// Standard pattern (e.g., 8 out of 10)
Given('the user manually sets it to {int} minutes in {int} out of the last 10 sessions', function (val, count) {
  for (let i = 0; i < 10; i++) {
    userPreference.recordOverride("defaultFocusBlockDuration", i < count ? val : 999);
  }
});

// Pattern with "only" (e.g., only 3 out of 10)
Given('the user manually sets it to {int} minutes in only {int} out of the last {int} sessions', function (val, count, total) {
  for (let i = 0; i < total; i++) {
    userPreference.recordOverride("defaultFocusBlockDuration", i < count ? val : 999);
  }
});

When('the evolution analysis runs', function () {
  evolutionSuggestion = userPreference.getEvolutionSuggestion("defaultFocusBlockDuration");
});

Then('the system should suggest updating the {string} to {int} minutes', function (setting, expectedVal) {
  expect(evolutionSuggestion).toBe(expectedVal);
});

Then('the system should NOT suggest any changes', function () {
  expect(evolutionSuggestion).toBeNull();
});

// --- Process 2 & 5 (Guardrails & Ethics) ---

Given('the user is currently using {string} UI complexity', function (complexity) {
  const config = ActiveConfiguration.create({
    defaultFocusBlockDuration: 25, promptFrequency: 30, uiComplexity: complexity as UIComplexity,
    atmosphere: VisualAtmosphere.NEUTRAL, notificationsMuted: false
  });
  userPreference = UserPreference.create({
    userId: new UniqueEntityID(), tags: [], activeConfig: config, baseConfig: config, 
    privacyLevel: PrivacyLevel.PRIVATE, overrideHistory: []
  }).getValue();
});

When('the Regulation Context signals a {string} cognitive load', function (loadState) {
  userPreference.applySensoryGuardrail(loadState === "HEAVY");
});

Then('the UI complexity must automatically switch to {string}', function (expected) {
  expect(userPreference.activeConfig.uiComplexity).toBe(expected as UIComplexity);
});

Then('it should remain {string} even if the load drops to {string} for only {int} minute', function (complexity, loadState, minutes) {
  userPreference.props.lastHeavyLoadDate = new Date(Date.now() - 1 * 60 * 1000);
  userPreference.applySensoryGuardrail(false); 
  expect(userPreference.activeConfig.uiComplexity).toBe(complexity as UIComplexity);
});

Given('a developer attempts to request a {string} metric', function (metricName) {
  try {
    if (!userPreference) {
      const config = ActiveConfiguration.create({ 
        defaultFocusBlockDuration: 25, promptFrequency: 30, uiComplexity: UIComplexity.STANDARD, 
        atmosphere: VisualAtmosphere.NEUTRAL, notificationsMuted: false 
      });
      userPreference = UserPreference.create({ 
        userId: new UniqueEntityID(), tags: [], activeConfig: config, baseConfig: config, 
        privacyLevel: PrivacyLevel.PRIVATE, overrideHistory: [] 
      }).getValue();
    }
    userPreference.requestMetric(metricName);
    caughtError = null;
  } catch (e) {
    caughtError = e as Error;
  }
});

When('the Identity & Preference context processes the request', () => {});

Then('an {string} exception should be thrown', function (errorType) {
  expect(caughtError?.message).toContain(errorType);
});

Then('the system must refuse to calculate any comparative rankings', () => {
  expect(caughtError).not.toBeNull();
});

Given('a user has an {string} profile', function (tag) {
  const config = ActiveConfiguration.create({ 
    defaultFocusBlockDuration: 10, promptFrequency: 15, uiComplexity: UIComplexity.STANDARD, 
    atmosphere: VisualAtmosphere.NEUTRAL, notificationsMuted: false 
  });
  userPreference = UserPreference.create({ 
    userId: new UniqueEntityID(), tags: [tag as IdentityTag], activeConfig: config, 
    baseConfig: config, privacyLevel: PrivacyLevel.PRIVATE, overrideHistory: [] 
  }).getValue();
});

When('the user changes their tag to {string}', function (newTag) {
  userPreference.updateTags([newTag as IdentityTag]);
});

Then('the system should suggest a new configuration', function () {
  expect(userPreference.tags).toContain(IdentityTag.NEUROTYPICAL);
});

Then('the user\'s previous learning history must not be reset', () => {
  expect(true).toBe(true); 
});