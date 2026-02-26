// src/modules/self-knowledge/application/usecases/GenerateAwarenessTrend.ts

import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { LearningProfileRepository } from "../ports/output/LearningProfileRepository";
import { CalibrationSnapshot } from "../../domain/value-objects/CalibrationSnapshot";
import { AwarenessTrend, TrendDirection } from "../../domain/value-objects/AwarenessTrend";

interface GenerateTrendRequest {
  userId: string;
  snapshots: {
    predictedConfidence: number;
    actualSignalRating: number;
    timestamp: Date;
  }[];
}

export class GenerateAwarenessTrend implements UseCase<GenerateTrendRequest, void> {
  constructor(private profileRepo: LearningProfileRepository) {}

  async execute(request: GenerateTrendRequest): Promise<Result<void>> {
    try {
      // 1. Fetch the Aggregate Root
      const profile = await this.profileRepo.getByUserId(request.userId);
      if (!profile) return Result.fail<void>("Learning Profile not found");

      // 2. Convert raw data to CalibrationSnapshot Value Objects
      const snapshots = request.snapshots.map(s => 
        CalibrationSnapshot.create({
          predictedConfidence: s.predictedConfidence,
          actualSignalRating: s.actualSignalRating,
          timestamp: s.timestamp
        }).getValue()
      );

      if (snapshots.length < 2) {
        return Result.fail<void>("At least two snapshots are required to calculate a trend.");
      }

      // 3. Calculate Trend (Domain Logic)
      const firstDelta = snapshots[0].calibrationDelta;
      const lastDelta = snapshots[snapshots.length - 1].calibrationDelta;

      let direction = TrendDirection.STABLE;
      if (lastDelta < firstDelta) direction = TrendDirection.IMPROVING;
      if (lastDelta > firstDelta) direction = TrendDirection.FLUCTUATING;

      // Accuracy score: 1 - (delta / max_possible_delta)
      const accuracyScore = 1 - (lastDelta / 4);

      const trend = AwarenessTrend.create({
        accuracyScore,
        trendDirection: direction,
        startDate: snapshots[0].props.timestamp,
        endDate: snapshots[snapshots.length - 1].props.timestamp
      });

      // 4. Update the Aggregate Root
      // We'll add a method to the entity to handle this history
      profile.recordAwarenessTrend(trend);

      // 5. Persist
      await this.profileRepo.save(profile);

      return Result.ok<void>();
    } catch (err) {
      return Result.fail<void>(err instanceof Error ? err.message : String(err));
    }
  }
}