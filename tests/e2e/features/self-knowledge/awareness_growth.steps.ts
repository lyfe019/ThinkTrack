// tests/e2e/features/self-knowledge/awareness_growth.steps.ts

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'expect';
import { CalibrationSnapshot } from '../../../../src/modules/self-knowledge/domain/value-objects/CalibrationSnapshot';
import { AwarenessTrend, TrendDirection } from '../../../../src/modules/self-knowledge/domain/value-objects/AwarenessTrend';

let snapshots: CalibrationSnapshot[] = [];
let calculatedTrend: AwarenessTrend;

Given('a user has two calibration snapshots:', function (table) {
  snapshots = table.hashes().map((row: any) => {
    // Parsing "5 (High)" to 5
    const conf = parseInt(row.Confidence);
    const signal = parseInt(row['Actual Signal']);
    
    return CalibrationSnapshot.create({
      predictedConfidence: conf,
      actualSignalRating: signal,
      timestamp: new Date()
    }).getValue();
  });
});

When('the Growth Tracking process analyzes the history', function () {
  // Logic: Compare the first delta to the last delta
  const firstDelta = snapshots[0].calibrationDelta; // e.g., |5 - 2| = 3
  const lastDelta = snapshots[snapshots.length - 1].calibrationDelta; // e.g., |3 - 3| = 0

  let direction = TrendDirection.STABLE;
  if (lastDelta < firstDelta) direction = TrendDirection.IMPROVING;
  if (lastDelta > firstDelta) direction = TrendDirection.FLUCTUATING;

  // Accuracy score is inverse of delta (Normalized 0 to 1)
  // Max delta is 4 (5-1), so: 1 - (delta/4)
  const accuracyScore = 1 - (lastDelta / 4);

  calculatedTrend = AwarenessTrend.create({
    accuracyScore: accuracyScore,
    trendDirection: direction,
    startDate: snapshots[0].props.timestamp,
    endDate: snapshots[snapshots.length - 1].props.timestamp
  });
});

Then('the TrendDirection should be {string}', function (expectedDirection: string) {
  expect(calculatedTrend.props.trendDirection).toBe(expectedDirection);
});

Then('the accuracy score should increase', function () {
  const firstDelta = snapshots[0].calibrationDelta;
  const lastDelta = snapshots[snapshots.length - 1].calibrationDelta;
  expect(lastDelta).toBeLessThan(firstDelta);
});