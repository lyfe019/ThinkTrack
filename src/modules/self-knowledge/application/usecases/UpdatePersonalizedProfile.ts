// src/modules/self-knowledge/application/usecases/UpdatePersonalizedProfile.ts

import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { LearningProfileRepository } from "../ports/output/LearningProfileRepository";
import { PersonalizedProfile } from "../../domain/value-objects/PersonalizedProfile";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";

interface UpdateProfileRequest {
  userId: string;
  newOptimalDuration: string;
  topStrategies: string[]; // Strategy IDs
  idealEnergyEntry: string;
}

export class UpdatePersonalizedProfile implements UseCase<UpdateProfileRequest, void> {
  constructor(private profileRepo: LearningProfileRepository) {}

  async execute(request: UpdateProfileRequest): Promise<Result<void>> {
    try {
      const profile = await this.profileRepo.getByUserId(request.userId);
      if (!profile) return Result.fail<void>("Profile not found");

      // Create the new Value Object
      const newRules = PersonalizedProfile.create({
        optimalBlockDuration: request.newOptimalDuration,
        topRecoveryStrategies: request.topStrategies.map(id => new UniqueEntityID(id)),
        idealEnergyEntry: request.idealEnergyEntry
      });

      // Update the Aggregate Root (This also updates lastReviewDate internally)
      profile.updateGoldenRules(newRules);

      await this.profileRepo.save(profile);
      return Result.ok<void>();
    } catch (err) {
      return Result.fail<void>(err instanceof Error ? err.message : String(err));
    }
  }
}