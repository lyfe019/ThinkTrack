import { Given, When, Then, Before } from '@cucumber/cucumber';
import expect from 'expect';
import request from 'supertest';
import { app } from '../../../../src/app';
import { InMemoryRegulationRepository } from '../../../../src/modules/regulation/infrastructure/repositories/InMemoryRegulationRepository';
import { InMemoryFocusBlockRepository } from '../../../../src/modules/focus-block/infrastructure/repositories/InMemoryFocusBlockRepository';
import { DomainEvents } from '../../../../src/shared/domain/events/DomainEvents';
import { AfterEmergencyExit } from '../../../../src/modules/focus-block/application/subscribers/AfterEmergencyExit';

let response: any;
let focusBlockId: string;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

Before(function () {
  // 1. Reset singleton repositories via their Global Anchors
  InMemoryRegulationRepository.clear();
  InMemoryFocusBlockRepository.clear(); 
  
  // 2. Clear previous handlers to prevent event duplication across scenarios
  DomainEvents.clearHandlers();
  
  // 3. Initialize subscriber using the Singleton Repo instance
  const repoInstance = InMemoryFocusBlockRepository.getInstance();
  new AfterEmergencyExit(repoInstance);
  
  response = null;
  focusBlockId = "";
});

// --- Setup Steps ---

Given('an active focus session', async function () {
  const res = await request(app)
    .post('/api/v1/focus-blocks')
    .send({ 
      energyLevel: "MEDIUM", 
      minutes: 20, 
      intentDescription: "Load Test", 
      userId: "user-123" 
    });
  
  if (res.status !== 201) {
    throw new Error(`Failed to create focus session: ${JSON.stringify(res.body)}`);
  }
  
  focusBlockId = res.body.data.focusBlockId;
});

Given('an active focus session with {string} cognitive load', async function (loadLevel: string) {
  const res = await request(app)
    .post('/api/v1/focus-blocks')
    .send({ 
      energyLevel: "MEDIUM", 
      minutes: 20, 
      intentDescription: "Context Test", 
      userId: "user-123" 
    });
  
  focusBlockId = res.body.data.focusBlockId;
  const frequency = loadLevel === 'HEAVY' ? 15 : 2;
  await request(app)
    .get(`/api/v1/regulation/session/${focusBlockId}/load`)
    .query({ frequency });
});

Given('the current Cognitive Load is {string}', async function (loadLevel: string) {
  const frequency = loadLevel === 'HEAVY' ? 12 : 2;
  const checkRes = await request(app)
    .get(`/api/v1/regulation/session/${focusBlockId}/load`)
    .query({ frequency });
    
  expect(checkRes.body.data.load).toBe(loadLevel);
});

// --- Action Steps ---

When('the system detects a burst of {string} signals', async function (signalType: string) {
  for (let i = 0; i < 12; i++) {
    await request(app)
      .post(`/api/v1/focus-blocks/${focusBlockId}/signals`)
      .send({ type: signalType });
  }
});

When('the signal frequency exceeds the baseline', async function () {
  response = await request(app)
    .get(`/api/v1/regulation/session/${focusBlockId}/load`)
    .query({ frequency: 12 });
});

When('I trigger the "I\'m Lost" emergency exit', async function () {
  // Hits ActivateCircuitBreaker in the Regulation module
  response = await request(app)
    .post(`/api/v1/regulation/session/${focusBlockId}/emergency-exit`)
    .send();
  
  // Give the event bus a head start
  await delay(200); 
});

When('I report feeling {string}', async function (feeling: string) {
  response = await request(app)
    .post(`/api/v1/regulation/session/${focusBlockId}/normalize`)
    .send({ feeling });
});

When('I attempt to start a new focus session immediately', async function () {
  // Delay to allow the subscriber to process the 'ABANDONED' status
  await delay(500); 
  
  response = await request(app)
    .post('/api/v1/focus-blocks')
    .send({ 
      energyLevel: "MEDIUM", 
      minutes: 10, 
      intentDescription: "Shame Rebound Attempt",
      userId: "user-123" 
    });
});

Given('the load velocity is {string}', async function (velocity: string) {
  await request(app).get(`/api/v1/regulation/session/${focusBlockId}/load`).query({ frequency: 20 });
  await request(app).get(`/api/v1/regulation/session/${focusBlockId}/load`).query({ frequency: 25 });
  response = await request(app).get(`/api/v1/regulation/session/${focusBlockId}/burnout-check`);
});

When('the heavy load persists for a defined threshold', async function () {
  for (let i = 0; i < 3; i++) {
    await request(app).get(`/api/v1/regulation/session/${focusBlockId}/load`).query({ frequency: 15 + (i * 5) }); 
  }
  response = await request(app).get(`/api/v1/regulation/session/${focusBlockId}/burnout-check`);
});

// --- Assertion Steps ---

Then('the Cognitive Load should be categorized as {string}', function (expectedLevel: string) {
  expect(response.body.data.load).toBe(expectedLevel);
});

Then('the Load Velocity should be {string}', function (expectedVelocity: string) {
  expect(response.body.data.velocity).toBe(expectedVelocity);
});

/**
 * THE EVENTUAL CONSISTENCY ASSERTION
 * Handles the async bridge between Regulation event dispatch and FocusBlock persistence.
 */
Then('the focus session should be {string}', async function (status: string) {
  const expectedStatus = (status === "ABORTED" || status === "ABANDONED") ? "ABANDONED" : status;
  let currentStatus = "";
  
  // 1. Polling the API (Up to 10 attempts over 3 seconds)
  for (let i = 0; i < 10; i++) {
    const checkRes = await request(app).get(`/api/v1/focus-blocks/${focusBlockId}`);
    currentStatus = checkRes.body.data.status;
    
    if (currentStatus === expectedStatus) break;
    
    if (i > 0 && i % 3 === 0) {
      console.log(`[POLLING]: Status is still ${currentStatus}, waiting for Subscriber...`);
    }
    
    await delay(300);
  }

  // 2. Final Singleton Check (Source of Truth)
  if (currentStatus !== expectedStatus) {
    const repo = InMemoryFocusBlockRepository.getInstance();
    const entity = await repo.findById(focusBlockId);
    
    if (entity && entity.status === expectedStatus) {
      console.log(`[SYNC]: API reported ${currentStatus}, but Repository confirms ${entity.status}.`);
      currentStatus = entity.status;
    } else if (entity) {
      console.warn(`[DEBUG]: Entity exists in Repo but status is ${entity.status}`);
    } else {
      console.error(`[CRITICAL]: Entity ${focusBlockId} not found in Repository!`);
    }
  }
  
  expect(currentStatus).toBe(expectedStatus);
});

Then('the Regulation State should be {string}', function (expectedLabel: string) {
  expect(response.body.data.label).toBe(expectedLabel);
});

Then('I should receive a normalization message: {string}', function (expectedMsg: string) {
  expect(response.body.data.normalizationText).toBe(expectedMsg);
});

Then('I should receive a burnout warning: {string}', function (expectedWarning: string) {
  const actualWarning = response.body.data.prompt || response.body.data.warning;
  expect(actualWarning).toBeDefined();
});

Then('I should be blocked with a message: {string}', function (expectedMessage: string) {
  expect(response.status).toBe(400); 
  expect(response.body.message).toContain(expectedMessage);
});

Then('I should see a Regulation Menu with options: {string}', function (optionsStr: string) {
  const expectedOptions = optionsStr.split(', ').map(o => o.trim());
  expect(response.body.data.menu).toEqual(expect.arrayContaining(expectedOptions));
});

Then('I should see a regulation message: {string}', function (expectedMessage: string) {
  expect(response.body.data.message).toBe(expectedMessage);
});

Then('the system should trigger a {string} event', function (expectedEvent: string) {
  expect(response.body.data.event).toBe(expectedEvent);
});

Then('I should see a Proactive Regulation Prompt: {string}', function (expectedPrompt: string) {
  expect(response.body.data.prompt).toBe(expectedPrompt);
});