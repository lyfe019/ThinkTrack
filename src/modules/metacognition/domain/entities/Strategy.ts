import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { Result } from "../../../../shared/core/Result";
import { Guard } from "../../../../shared/core/Guard";
import { StrategyCategory } from "./StrategyCategory";
import { NDSuitability } from "../value-objects/NDSuitability";

interface StrategyProps {
  label: string;
  description: string;
  category: StrategyCategory;
  suitability: NDSuitability;
  // ADD THIS: This allows the agent to match strategies to the user's state
  requiredRegulationState: string; 
}

export class Strategy extends Entity<StrategyProps> {
  get label(): string { return this.props.label; }
  get description(): string { return this.props.description; }
  get category(): StrategyCategory { return this.props.category; }
  get suitability(): NDSuitability { return this.props.suitability; }
  // ADD THIS: Getter for the scaffolding logic
  get requiredRegulationState(): string { return this.props.requiredRegulationState; }

  private constructor(props: StrategyProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: StrategyProps, id?: UniqueEntityID): Result<Strategy> {
    const guardResult = Guard.againstNullOrUndefined(props.label, 'label');
    if (guardResult.isFailure) return Result.fail<Strategy>(guardResult.error!);

    const descGuard = Guard.againstNullOrUndefined(props.description, 'description');
    if (descGuard.isFailure) return Result.fail<Strategy>(descGuard.error!);

    // ADD THIS: Guard for the regulation state
    const stateGuard = Guard.againstNullOrUndefined(props.requiredRegulationState, 'requiredRegulationState');
    if (stateGuard.isFailure) return Result.fail<Strategy>(stateGuard.error!);

    return Result.ok<Strategy>(new Strategy(props, id));
  }
}