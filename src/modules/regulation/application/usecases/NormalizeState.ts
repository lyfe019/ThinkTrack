import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { RegulationRepository } from "../ports/output/RegulationRepository";
import { StateLabel } from "../../domain/value-objects/RegulationState";
import { LoadLevel } from "../../domain/value-objects/CognitiveLoad";

interface NormalizationRequest {
  focusBlockId: string;
  selfReportedFeeling: string;
}

export class NormalizeState implements UseCase<NormalizationRequest, any> {
  constructor(private repo: RegulationRepository) {}

  async execute(request: NormalizationRequest): Promise<Result<any>> {
    const session = await this.repo.findByFocusBlockId(request.focusBlockId);
    
    if (!session) {
      return Result.fail("Regulation session not found");
    }

    // Accessing through getters (assuming session.loadHistory is exposed)
    const history = session.loadHistory; 
    const latestLoad = history[history.length - 1];
    const loadLevel = latestLoad ? latestLoad.level : LoadLevel.LIGHT;

    let label: StateLabel = StateLabel.CALM;

    // Business Logic: Mapping objective Load + subjective Feeling to a Label
    const feeling = request.selfReportedFeeling.toUpperCase();

    if (loadLevel === LoadLevel.HEAVY) {
      label = (feeling === 'FRUSTRATED') 
        ? StateLabel.STUCK 
        : StateLabel.OVERLOADED;
    } else if (loadLevel === LoadLevel.LIGHT && feeling === 'TIRED') {
      label = StateLabel.DRAINED;
    }

    session.updateState(label);
    await this.repo.save(session);

    return Result.ok({
      label: session.currentState.label,
      normalizationText: session.currentState.text
    });
  }
}