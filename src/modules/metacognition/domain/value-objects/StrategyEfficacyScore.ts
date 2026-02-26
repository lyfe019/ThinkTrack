import { ValueObject } from "../../../../shared/core/ValueObject";
import { StrategyImpact } from "../entities/InterventionEnums";

interface StrategyEfficacyScoreProps {
  impact: StrategyImpact;
  initialState: string; // RegulationState at T0
  resultingState: string; // RegulationState at T+5
  analysisNote?: string;
}

export class StrategyEfficacyScore extends ValueObject<StrategyEfficacyScoreProps> {
  private constructor(props: StrategyEfficacyScoreProps) {
    super(props);
  }

  public static create(props: StrategyEfficacyScoreProps): StrategyEfficacyScore {
    return new StrategyEfficacyScore(props);
  }
}