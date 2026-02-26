import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { StrategyImpact } from "../entities/InterventionEnums";

export class InsightGenerated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public strategyId: UniqueEntityID;
  public impact: StrategyImpact;
  public patternDescription: string;

  constructor(strategyId: UniqueEntityID, impact: StrategyImpact, pattern: string) {
    this.dateTimeOccurred = new Date();
    this.strategyId = strategyId;
    this.impact = impact;
    this.patternDescription = pattern;
  }

  getAggregateId(): UniqueEntityID {
    return this.strategyId;
  }
}