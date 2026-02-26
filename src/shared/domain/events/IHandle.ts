// src/shared/domain/events/IHandle.ts
import { IDomainEvent } from "./IDomainEvent";

/**
 * T corresponds to the specific Type of Domain Event 
 * this class is responsible for handling.
 */
export interface IHandle<T extends IDomainEvent> {
  /**
   * This method is called by the DomainEvents bus 
   * when an event of type T is dispatched.
   */
  // Note: We use the naming convention 'on[EventName]' in implementation,
  // but the interface ensures the contract for subscription.
  setupSubscriptions(): void;
}