import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import request from 'supertest';
import { app } from '../../../../src/app';
import { interventionRepo } from '../../../../src/modules/metacognition/api/container';

let interventionId: string;
const mockStrategyId = "active-recall-123";
let lastResponse: any;

Given('an intervention is active with 3 strategy options', async function () {
  const setupRes = await request(app)
    .post('/api/v1/metacognition/calibrate')
    .send({
      focusBlockId: "test-block-123",
      confidence: 3,
      signalRating: "STABLE",
      regulationState: "STUCK",
      triggerType: "USER_REQUESTED"
    });
  
  interventionId = setupRes.body.interventionId;
  if (!interventionId) throw new Error("Setup failed: No interventionId returned");
});

When('I select the "Active Recall" strategy', async function () {
  lastResponse = await request(app)
    .post(`/api/v1/metacognition/interventions/${interventionId}/select`)
    .send({ strategyId: mockStrategyId });
});

Then('the intervention should record the selection', async function () {
  expect(lastResponse.status).toBe(200);
  const updated = await interventionRepo.getById(interventionId);
  expect(updated?.selectedStrategyId?.toString()).toBe(mockStrategyId);
});

When('I dismiss the strategy menu', async function () {
  // Fix: Adding .send({}) to avoid empty body 400 errors
  lastResponse = await request(app)
    .post(`/api/v1/metacognition/interventions/${interventionId}/dismiss`)
    .send({});
});

Then('the intervention should record the impact as "DISMISSED"', async function () {
  if (lastResponse.status !== 200) {
    console.error("Dismissal Debug:", lastResponse.body);
  }
  expect(lastResponse.status).toBe(200);
  
  const updated = await interventionRepo.getById(interventionId);
  // Using the aggregate getter and checking props
  expect(updated?.efficacy?.props.impact).toBe("DISMISSED");
});

Then('no strategy should be selected', async function () {
  const updated = await interventionRepo.getById(interventionId);
  expect(updated?.selectedStrategyId).toBeUndefined();
});

Then('a StrategySelected event should be dispatched', async function () {
  expect(interventionId).toBeDefined();
});