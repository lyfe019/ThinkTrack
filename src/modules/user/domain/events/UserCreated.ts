// src/modules/user/domain/events/UserCreated.ts
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { User } from "../entities/User";

export class UserCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public user: User;

  constructor(user: User) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  // Used by the DomainEvents bus to identify the event
  getAggregateId(): string {
    return this.user.id;
  }
}