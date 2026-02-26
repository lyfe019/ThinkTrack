// src/modules/self-knowledge/domain/events/StrengthDiscovered.ts
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";

export class StrengthDiscovered implements IDomainEvent {
  public dateTimeOccurred: Date;
  public profileId: UniqueEntityID;
  public insightId: UniqueEntityID;

  constructor(profileId: UniqueEntityID, insightId: UniqueEntityID) {
    this.dateTimeOccurred = new Date();
    this.profileId = profileId;
    this.insightId = insightId;
  }

  getAggregateId(): UniqueEntityID {
    return this.profileId;
  }
}