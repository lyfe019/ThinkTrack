import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import request from 'supertest';
import { app } from '../../../../src/app';

let apiResponse: any;
let lastSignalRating: string;
let lastRegulationState: string;

Given('a focus block is active with high signal friction', async function () {
  lastSignalRating = "HIGH_FRICTION";
  lastRegulationState = "STUCK";
});

Given('a focus block is active with stable interaction signals', async function () {
  lastSignalRating = "STABLE";
  lastRegulationState = "FLOW";
});

When('I report a confidence level of {int}', async function (confidence: number) {
  apiResponse = await request(app)
    .post('/api/v1/metacognition/calibrate')
    .send({
      focusBlockId: "test-block-123",
      confidence,
      signalRating: lastSignalRating,
      regulationState: lastRegulationState,
      triggerType: "HIGH_LOAD_DETECTED"
    });
});

Then('a Calibration Snapshot should be generated', async function () {
  expect(apiResponse.status).toBe(200);
  expect(apiResponse.body.snapshot).toBeDefined();
});

Then('the Gap Value should be high', async function () {
  expect(apiResponse.body.snapshot.insightKey).toBe("ILLUSION_OF_COMPETENCE_RISK");
});

Then('the Gap Value should be low', async function () {
  expect(apiResponse.body.snapshot.gapValue).toBeLessThanOrEqual(2);
});

Then('the insight should be {string}', async function (expectedKey: string) {
  expect(apiResponse.body.snapshot.insightKey).toBe(expectedKey);
});

Then('at least {int} strategy options should be offered', async function (count: number) {
  expect(apiResponse.body.strategies.length).toBeGreaterThanOrEqual(count);
});

Then('a CalibrationCompleted event should be dispatched', async function () {
  expect(apiResponse.body.interventionId).toBeDefined();
});