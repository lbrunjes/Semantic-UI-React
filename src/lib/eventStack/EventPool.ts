/**
 * A handler subscribed via the event stack. It receives a DOM event, its exact type depends on the
 * event name (i.e. `KeyboardEvent` for "keydown").
 */
export type EventHandler = (event: any) => void

/**
 * An immutable set of event handlers, grouped by event type, that belong to a single pool.
 *
 * The "default" pool dispatches an event to all its handlers, any other pool dispatches it only to
 * the most recently added handler. This allows nested components (i.e. Modals) to handle events
 * like "Escape" only on the top-most instance.
 */
export default class EventPool {
  declare poolName: string
  declare handlerSets: Map<string, EventHandler[]>

  constructor(poolName: string, handlerSets: Map<string, EventHandler[]>) {
    this.poolName = poolName
    this.handlerSets = handlerSets
  }

  static createByType(poolName: string, eventType: string, eventHandlers: EventHandler[]) {
    const handlerSets = new Map<string, EventHandler[]>()
    handlerSets.set(eventType, eventHandlers)

    return new EventPool(poolName, handlerSets)
  }

  addHandlers(eventType: string, eventHandlers: EventHandler[]) {
    const handlerSets = new Map(this.handlerSets)
    const currentHandlers = handlerSets.get(eventType) || []

    handlerSets.set(eventType, [...currentHandlers, ...eventHandlers])

    return new EventPool(this.poolName, handlerSets)
  }

  dispatchEvent(eventType: string, event: Event) {
    const handlers = this.handlerSets.get(eventType)

    if (!handlers || handlers.length === 0) return

    if (this.poolName !== 'default') {
      handlers[handlers.length - 1](event)
      return
    }

    // Dispatches from the most recent handler, a handler that was added multiple times is called once
    const called = new Set<EventHandler>()

    for (let i = handlers.length - 1; i >= 0; i -= 1) {
      if (!called.has(handlers[i])) {
        called.add(handlers[i])
        handlers[i](event)
      }
    }
  }

  hasHandlers(eventType?: string) {
    if (!eventType) return this.handlerSets.size > 0

    const handlers = this.handlerSets.get(eventType)
    return !!handlers && handlers.length > 0
  }

  removeHandlers(eventType: string, eventHandlers: EventHandler[]) {
    const handlerSets = new Map(this.handlerSets)
    const currentHandlers = handlerSets.get(eventType)

    if (!currentHandlers) return new EventPool(this.poolName, handlerSets)

    const nextHandlers = currentHandlers.filter((handler) => !eventHandlers.includes(handler))

    if (nextHandlers.length > 0) {
      handlerSets.set(eventType, nextHandlers)
    } else {
      handlerSets.delete(eventType)
    }

    return new EventPool(this.poolName, handlerSets)
  }
}
