import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { CalibrationSnapshot } from "../value-objects/CalibrationSnapshot";

export class CalibrationCompleted implements IDomainEvent {
  public dateTimeOccurred: Date;
  public interventionId: UniqueEntityID;
  public snapshot: CalibrationSnapshot;

  constructor(interventionId: UniqueEntityID, snapshot: CalibrationSnapshot) {
    this.dateTimeOccurred = new Date();
    this.interventionId = interventionId;
    this.snapshot = snapshot;
  }

  getAggregateId(): UniqueEntityID {
    return this.interventionId;
  }
}