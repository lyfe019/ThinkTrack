import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import request from 'supertest';
import { app } from '../../../../src/app';
import { interventionRepo } from '../../../../src/modules/metacognition/api/container';

let activeId: string;

Given('a focus block has ended', async function () {
  const res = await request(app)
    .post('/api/v1/metacognition/calibrate')
    .send({ 
        focusBlockId: "fb-2", 
        confidence: 5, 
        signalRating: "STABLE", 
        regulationState: "FLOW", 
        triggerType: "USER_REQUESTED" 
    });
  activeId = res.body.interventionId;
});

Given('I successfully used {string} to reach {string}', async function (label: string, state: string) {
    // Simulated state transition
});

When('the system asks: {string}', async function (prompt: string) {
    this.currentPrompt = prompt;
});

When('I respond {string}', async function (userResponse: string) {
  await request(app)
    .post(`/api/v1/metacognition/interventions/${activeId}/reflect`)
    .send({
      prompt: this.currentPrompt || "How did it go?",
      userResponse: userResponse,
      energyImpact: "ENERGIZING"
    });
});

Then('my MetacognitiveGrowthData should be updated', async function () {
  const updated = await interventionRepo.getById(activeId);
  expect(updated?.reflections.length).toBe(1);
  // Matches "Clearer" from the feature file
  expect(updated?.reflections[0].props.response).toBe("Clearer");
});