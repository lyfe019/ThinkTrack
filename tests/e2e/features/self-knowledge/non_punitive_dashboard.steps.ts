// tests/e2e/features/self-knowledge/non_punitive_dashboard.steps.ts

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import { NonPunitiveDashboardData } from '../../../../src/modules/self-knowledge/domain/value-objects/NonPunitiveDashboardData';

let rawData: any;
let dashboardResult: any;

Given('raw data containing {string} and {string}', function (key1: string, key2: string) {
  rawData = { [key1]: {}, [key2]: "85%" };
});

Given('raw data containing a {string} count', function (forbiddenKey: string) {
  // Simulating the presence of a forbidden metric like "session_streaks"
  rawData = { [forbiddenKey]: 5, stateHeatmap: {} };
});

When('the Dashboard Data is generated', function () {
  // We pass the rawData to the Factory/Value Object to check for the No-Shame Rule
  dashboardResult = NonPunitiveDashboardData.create({
    stateHeatmap: rawData.stateHeatmap || {},
    recoveryRate: rawData.recoveryRate || "0%",
    insightSummary: "Looking good!"
  }, rawData);
});

Then('the dashboard should be created successfully', function () {
  expect(dashboardResult.isSuccess).toBe(true);
});

/**
 * FIXED: Renamed to "the dashboard creation should fail" 
 * to avoid ambiguity with Strength Synthesis tests.
 */
Then('the dashboard creation should fail', function () {
  expect(dashboardResult.isFailure).toBe(true);
});

/**
 * FIXED: Renamed to "the dashboard error should be"
 * to avoid global naming collisions.
 */
Then('the dashboard error should be {string}', function (expectedError: string) {
  expect(dashboardResult.error).toBe(expectedError);
});