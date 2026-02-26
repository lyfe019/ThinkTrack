import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { InterventionRepository } from "../ports/output/InterventionRepository";

interface SelectStrategyRequest {
  interventionId: string;
  strategyId: string;
}

export class SelectStrategy implements UseCase<SelectStrategyRequest, void> {
  constructor(private interventionRepo: InterventionRepository) {}

  async execute(request: SelectStrategyRequest): Promise<Result<void>> {
    try {
      // 1. Fetch the existing intervention
      const intervention = await this.interventionRepo.getById(request.interventionId);
      
      if (!intervention) {
        return Result.fail<void>(`Intervention with id ${request.interventionId} not found`);
      }

      // 2. Domain Logic: Apply the selection
      // This method (in our Entity) will dispatch the StrategySelected event
      intervention.selectStrategy(new UniqueEntityID(request.strategyId));

      // 3. Persist the change
      await this.interventionRepo.save(intervention);

      return Result.ok<void>();
    } catch (err) {
      return Result.fail<void>(err instanceof Error ? err.message : String(err));
    }
  }
}