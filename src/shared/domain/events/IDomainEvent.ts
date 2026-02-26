import { UniqueEntityID } from "../../core/UniqueEntityID";

export interface IDomainEvent {
  /**
   * The date and time when the event occurred.
   * Crucial for sequencing events and audit trails.
   */
  dateTimeOccurred: Date;

  /**
   * Returns the ID of the Aggregate Root that emitted this event.
   * Returning the UniqueEntityID object allows for better type safety 
   * than a raw string.
   */
  getAggregateId(): UniqueEntityID;
}