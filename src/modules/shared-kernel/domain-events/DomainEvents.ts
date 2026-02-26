export class DomainEvents {
  private static readonly BUS_KEY = Symbol.for('bric.event_bus');

  private static getHandlersMap(): { [key: string]: any[] } {
    if (!(global as any)[this.BUS_KEY]) { (global as any)[this.BUS_KEY] = {}; }
    return (global as any)[this.BUS_KEY];
  }

  public static register(callback: (event: any) => void, eventClassName: string): void {
    const map = this.getHandlersMap();
    if (!map[eventClassName]) map[eventClassName] = [];
    map[eventClassName].push(callback);
  }

  public static dispatch(event: any): void {
    const eventName = event.constructor.name;
    const map = this.getHandlersMap();
    if (map[eventName]) {
      map[eventName].forEach((handler) => handler(event));
    }
  }
}
