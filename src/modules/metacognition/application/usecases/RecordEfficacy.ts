import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { InterventionRepository } from "../ports/output/InterventionRepository";
import { EfficacyEvaluator } from "../../domain/services/EfficacyEvaluator";
import { DomainEvents } from "../../../../shared/domain/events/DomainEvents";
import { InsightGenerated } from "../../domain/events/InsightGenerated";

interface RecordEfficacyRequest {
  interventionId: string;
  currentRegulationState: string;
}

export class RecordEfficacy implements UseCase<RecordEfficacyRequest, void> {
  constructor(private interventionRepo: InterventionRepository) {}

  async execute(request: RecordEfficacyRequest): Promise<Result<void>> {
    try {
      const intervention = await this.interventionRepo.getById(request.interventionId);
      
      if (!intervention) {
        return Result.fail<void>(`Intervention ${request.interventionId} not found`);
      }

      if (!intervention.selectedStrategyId) {
        return Result.fail<void>(`No strategy was selected for intervention ${request.interventionId}`);
      }

      // 1. Determine the shift (Process 3 logic)
      // We compare the state from the moment of intervention to the state 5 minutes later
      const efficacyScore = EfficacyEvaluator.evaluate(
        "OVERLOADED", // This should ideally be pulled from the intervention's initial record
        request.currentRegulationState
      );

      // 2. Update the Aggregate Root
      intervention.recordEfficacy(efficacyScore);

      // 3. Persist
      await this.interventionRepo.save(intervention);

      // 4. Insight Generation (Process 3 Output)
      if (efficacyScore.props.impact.includes("IMPROVED")) {
        DomainEvents.dispatch(new InsightGenerated(
          intervention.selectedStrategyId,
          efficacyScore.props.impact,
          `Strategy successfully helped transition from OVERLOADED to ${request.currentRegulationState}`
        ));
      }

      return Result.ok<void>();
    } catch (err) {
      return Result.fail<void>(err instanceof Error ? err.message : String(err));
    }
  }
}