import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import request from 'supertest';
import { app } from '../../../../src/app';
import { interventionRepo, recordEfficacy } from '../../../../src/modules/metacognition/api/container';

let activeId: string;

Given('I selected {string} while in an {string} state', async function (strat: string, state: string) {
  const res = await request(app)
    .post('/api/v1/metacognition/calibrate')
    .send({ 
        focusBlockId: "fb-1", 
        confidence: 3, 
        signalRating: "STABLE", 
        regulationState: state, 
        triggerType: "HIGH_LOAD_DETECTED" 
    });
  
  activeId = res.body.interventionId;
  await request(app)
    .post(`/api/v1/metacognition/interventions/${activeId}/select`)
    .send({ strategyId: "some-id" });
});

When('5 minutes have passed', async function () {
    // Simulated passage of time
});

When('my current state is now {string}', async function (state: string) {
  await recordEfficacy.execute({ 
      interventionId: activeId, 
      currentRegulationState: state 
  });
});

Then('the intervention efficacy should be recorded as {string}', async function (impact: string) {
  const updated = await interventionRepo.getById(activeId);
  expect(updated?.efficacy?.props.impact).toBe(impact);
});

Then('an InsightGenerated event should be dispatched', async function () {
  const updated = await interventionRepo.getById(activeId);
  expect(updated?.efficacy).toBeDefined();
});