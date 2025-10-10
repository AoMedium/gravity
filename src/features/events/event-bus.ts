export default class EventBus {
  private static instance: EventBus;

  private _events: Map<string, SubscriptionList> = new Map();

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EventBus();
    }
    return this.instance;
  }

  public subscribe(name: string, callback: EventCallbackFunction) {
    // Add new event if it does not exist
    if (!this._events.get(name)) {
      this._events.set(name, []);
    }

    const event = this._events.get(name);

    event!.push(callback);
  }

  public unsubscribe(name: string, callback: EventCallbackFunction) {
    const event = this._events.get(name);

    if (!event) {
      console.error(
        `Could not unsubscribe as no event with name: "${name}" was found.`,
      );
      return;
    }

    // Remove callback from subscription list
    const filteredEvent = event.filter((fn) => fn !== callback);

    this._events.set(name, filteredEvent);
  }

  public publish(name: string, data: unknown) {
    const event = this._events.get(name);

    if (event) {
      event.forEach((callback) => callback(data));
    }
  }
}

type SubscriptionList = EventCallbackFunction[];
type EventCallbackFunction = (...args: unknown[]) => unknown;
