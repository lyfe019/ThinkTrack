import { IDomainEvent } from "./IDomainEvent";
import { UniqueEntityID } from "../../core/UniqueEntityID";

export class DomainEvents {
  private static handlersMap: any = {};
  private static markedAggregates: any[] = [];

  /**
   * Register a handler (subscriber) for a specific event.
   */
  public static register(callback: (event: any) => void, eventClassName: string): void {
    if (!this.handlersMap.hasOwnProperty(eventClassName)) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  /**
   * Dispatches the event immediately to all registered handlers.
   */
  public static dispatch(event: IDomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (this.handlersMap.hasOwnProperty(eventClassName)) {
      const handlers: any[] = this.handlersMap[eventClassName];
      for (let handler of handlers) {
        handler(event);
      }
    }
  }

  /**
   * Clears all handlers (Useful for unit testing)
   */
  public static clearHandlers(): void {
    this.handlersMap = {};
  }
}