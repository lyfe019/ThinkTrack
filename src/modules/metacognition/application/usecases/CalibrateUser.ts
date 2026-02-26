import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { StrategyRepository } from "../ports/output/StrategyRepository";
import { InterventionRepository } from "../ports/output/InterventionRepository";
import { ScaffoldingService } from "../../domain/services/ScaffoldingService";
import { CalibrationSnapshot, ObjectiveSignalRating } from "../../domain/value-objects/CalibrationSnapshot";
import { Intervention } from "../../domain/entities/Intervention";
import { InterventionTriggerType } from "../../domain/entities/InterventionEnums";

interface CalibrateUserRequest {
  focusBlockId: string;
  confidence: number;
  signalRating: ObjectiveSignalRating;
  regulationState: string; 
  triggerType: InterventionTriggerType;
}

export class CalibrateUser implements UseCase<CalibrateUserRequest, any> {
  constructor(
    private strategyRepo: StrategyRepository,
    private interventionRepo: InterventionRepository
  ) {}

  async execute(request: CalibrateUserRequest): Promise<Result<any>> {
    const allStrategies = await this.strategyRepo.findAll();
    const selectedStrategies = ScaffoldingService.selectBestStrategies(
      allStrategies, 
      request.regulationState
    );

    const snapshotResult = CalibrationSnapshot.create(request.confidence, request.signalRating);
    if (snapshotResult.isFailure) return Result.fail(snapshotResult.error!);
    const snapshot = snapshotResult.getValue();

    const interventionResult = Intervention.create({
      focusBlockId: new UniqueEntityID(request.focusBlockId),
      triggerType: request.triggerType,
      calibrationData: snapshot,
      optionsOffered: selectedStrategies.map(s => new UniqueEntityID(s.id.toString()))
    });

    if (interventionResult.isFailure) return Result.fail(interventionResult.error!);
    const intervention = interventionResult.getValue();

    // PERSISTENCE FIX: Save to memory so subsequent API calls can find it
    await this.interventionRepo.save(intervention);

    return Result.ok({
      interventionId: intervention.id.toString(),
      snapshot: {
        gapValue: snapshot.props.gapValue,
        insightKey: snapshot.props.insightKey,
        confidence: snapshot.props.confidenceScore
      },
      strategies: selectedStrategies.map(s => ({
        id: s.id.toString(),
        label: s.label,
        category: s.category
      }))
    });
  }
}