import { StrategyImpact } from "../entities/InterventionEnums";
import { StrategyEfficacyScore } from "../value-objects/StrategyEfficacyScore";

export class EfficacyEvaluator {
  /**
   * Effectiveness Window Rule logic
   * Compares the state shift to determine impact.
   */
  public static evaluate(initialState: string, finalState: string): StrategyEfficacyScore {
    let impact = StrategyImpact.NO_CHANGE;

    if (initialState !== "FLOW" && finalState === "FLOW") {
      impact = StrategyImpact.IMPROVED_FLOW;
    } else if (initialState === "OVERLOADED" && finalState !== "OVERLOADED") {
      impact = StrategyImpact.STABILIZED;
    } else if (finalState === "DRAINED" || finalState === "OVERLOADED") {
      impact = StrategyImpact.INCREASED_OVERWHELM;
    }

    return StrategyEfficacyScore.create({
      impact,
      initialState,
      resultingState: finalState,
      analysisNote: `Transitioned from ${initialState} to ${finalState} after strategy use.`
    });
  }
}