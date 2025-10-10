export default class EventBus {
  private static _events: Map<string, SubscriptionList> = new Map();

  public static subscribe(name: string, callback: EventCallbackFunction) {
    // Add new event if it does not exist
    if (!EventBus._events.get(name)) {
      EventBus._events.set(name, []);
    }

    const event = EventBus._events.get(name);

    console.info('Subscribed', name, callback);
    event!.push(callback);
  }

  public static unsubscribe(name: string, callback: EventCallbackFunction) {
    const event = EventBus._events.get(name);

    if (!event) {
      console.error(
        `Could not unsubscribe as no event with name: "${name}" was found.`,
      );
      return;
    }

    // Remove callback from subscription list
    const filteredEvent = event.filter((fn) => fn !== callback);

    EventBus._events.set(name, filteredEvent);
  }

  public static publish(name: string, data: unknown) {
    console.log('Publish', name, data);
    const event = EventBus._events.get(name);
    if (event) {
      event.forEach((callback) => callback(data));
    }
  }
}

type SubscriptionList = EventCallbackFunction[];
type EventCallbackFunction = (...args: unknown[]) => unknown;
