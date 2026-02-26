import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";

export class StrategySelected implements IDomainEvent {
  public dateTimeOccurred: Date;
  public interventionId: UniqueEntityID;
  public strategyId: UniqueEntityID;

  constructor(interventionId: UniqueEntityID, strategyId: UniqueEntityID) {
    this.dateTimeOccurred = new Date();
    this.interventionId = interventionId;
    this.strategyId = strategyId;
  }

  getAggregateId(): UniqueEntityID {
    return this.interventionId;
  }
}