import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";

export class EmergencyExitActivated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public focusBlockId: UniqueEntityID; // Use the domain type we fixed earlier

  constructor(focusBlockId: UniqueEntityID) {
    this.dateTimeOccurred = new Date();
    this.focusBlockId = focusBlockId;
  }

  getAggregateId(): UniqueEntityID {
    return this.focusBlockId;
  }
}