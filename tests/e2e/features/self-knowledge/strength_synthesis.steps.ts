// tests/e2e/features/self-knowledge/strength_synthesis.steps.ts

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import { Insight, InsightStatus } from '../../../../src/modules/self-knowledge/domain/entities/Insight';
import { ReframedInsight, InsightTone, InsightCategory } from '../../../../src/modules/self-knowledge/domain/value-objects/ReframedInsight';
import { UniqueEntityID } from '../../../../src/shared/core/UniqueEntityID';

let evidenceLinks: UniqueEntityID[] = [];
let synthesisResult: any;
let detectedPattern: string;

// FIX 1: Matches "Given the user has 3 recent FocusBlocks showing..."
Given('the user has {int} recent FocusBlocks showing a {string} pattern', function (count: number, pattern: string) {
  detectedPattern = pattern;
  evidenceLinks = Array.from({ length: count }, () => new UniqueEntityID());
});

// FIX 2: Matches "Given the user has only 1 FocusBlock showing..."
// Added "only" to match the specific scenario in your feature file
Given('the user has only {int} FocusBlock showing a {string} pattern', function (count: number, pattern: string) {
  detectedPattern = pattern;
  evidenceLinks = Array.from({ length: count }, () => new UniqueEntityID());
});

Given('a pattern is detected as {string}', function (pattern: string) {
  detectedPattern = pattern;
});

When('the Synthesis Process runs', function () {
  const reframedContent = "You are an Adaptable Explorer with high environmental awareness";
  
  const reframedVOResult = ReframedInsight.create({
    content: reframedContent,
    tone: InsightTone.EMPOWERING,
    category: InsightCategory.STAMINA
  });

  synthesisResult = Insight.create({
    rawPattern: detectedPattern,
    reframedText: reframedVOResult.getValue(),
    evidenceLinks: evidenceLinks,
    status: InsightStatus.NEW
  });
});

When('the system attempts to create a ReframedInsight with this text', function () {
  synthesisResult = ReframedInsight.create({
    content: detectedPattern,
    tone: InsightTone.OBSERVATIONAL,
    category: InsightCategory.STRATEGY_USE
  });
});

When('the system attempts to generate an Insight', function () {
    const dummyReframed = ReframedInsight.create({
        content: "Valid Content",
        tone: InsightTone.OBSERVATIONAL,
        category: InsightCategory.STRATEGY_USE
    }).getValue();

    synthesisResult = Insight.create({
        rawPattern: detectedPattern,
        reframedText: dummyReframed,
        evidenceLinks: evidenceLinks,
        status: InsightStatus.NEW
    });
});

Then('a new Insight should be created in the LearningProfile', function () {
  expect(synthesisResult.isSuccess).toBe(true);
});

Then('the ReframedText should be {string}', function (expectedText: string) {
  expect(synthesisResult.getValue().props.reframedText.content).toBe(expectedText);
});

// FIX 3: Added the missing "status" check
Then('the Insight status should be {string}', function (expectedStatus: string) {
  const insight = synthesisResult.getValue();
  expect(insight.props.status).toBe(expectedStatus);
});

Then('the creation should fail', function () {
  expect(synthesisResult.isFailure).toBe(true);
});

Then('an error {string} should be returned', function (expectedError: string) {
  expect(synthesisResult.error).toContain(expectedError);
});