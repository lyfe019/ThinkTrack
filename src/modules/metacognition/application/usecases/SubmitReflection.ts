import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { InterventionRepository } from "../ports/output/InterventionRepository";
import { ReflectionResponse } from "../../domain/value-objects/ReflectionResponse";

interface SubmitReflectionRequest {
  interventionId: string;
  prompt: string;
  userResponse: string;
  energyImpact: 'TIRING' | 'NEUTRAL' | 'ENERGIZING';
}

export class SubmitReflection implements UseCase<SubmitReflectionRequest, void> {
  constructor(private interventionRepo: InterventionRepository) {}

  async execute(request: SubmitReflectionRequest): Promise<Result<void>> {
    try {
      const intervention = await this.interventionRepo.getById(request.interventionId);
      
      if (!intervention) {
        return Result.fail<void>("Intervention not found.");
      }

      // Create the reflection VO
      const reflection = ReflectionResponse.create({
        prompt: request.prompt,
        response: request.userResponse,
        energyImpact: request.energyImpact,
        occurredAt: new Date()
      });

      // We add a method to our Intervention Aggregate to store these reflections
      // This allows the "Growth Reflection" feature to persist the data.
      intervention.addReflection(reflection);

      await this.interventionRepo.save(intervention);

      return Result.ok<void>();
    } catch (err) {
      return Result.fail<void>(err instanceof Error ? err.message : String(err));
    }
  }
}