import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { InterventionRepository } from "../ports/output/InterventionRepository";

interface DismissInterventionRequest {
  interventionId: string;
}

export class DismissIntervention implements UseCase<DismissInterventionRequest, void> {
  constructor(private interventionRepo: InterventionRepository) {}

  async execute(request: DismissInterventionRequest): Promise<Result<void>> {
    try {
      const intervention = await this.interventionRepo.getById(request.interventionId);
      
      if (!intervention) {
        return Result.fail<void>(`Intervention with id ${request.interventionId} not found`);
      }

      // Domain Logic: Mark as dismissed per Agency Rule
      intervention.dismiss();

      // Persist the dismissal
      await this.interventionRepo.save(intervention);

      return Result.ok<void>();
    } catch (err) {
      return Result.fail<void>(err instanceof Error ? err.message : String(err));
    }
  }
}