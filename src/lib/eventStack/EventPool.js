/**
 * An immutable set of event handlers, grouped by event type, that belong to a single pool.
 *
 * The "default" pool dispatches an event to all its handlers, any other pool dispatches it only to
 * the most recently added handler. This allows nested components (i.e. Modals) to handle events
 * like "Escape" only on the top-most instance.
 */
export default class EventPool {
  constructor(poolName, handlerSets) {
    this.poolName = poolName
    this.handlerSets = handlerSets
  }

  static createByType(poolName, eventType, eventHandlers) {
    const handlerSets = new Map()
    handlerSets.set(eventType, eventHandlers)

    return new EventPool(poolName, handlerSets)
  }

  addHandlers(eventType, eventHandlers) {
    const handlerSets = new Map(this.handlerSets)
    const currentHandlers = handlerSets.get(eventType) || []

    handlerSets.set(eventType, [...currentHandlers, ...eventHandlers])

    return new EventPool(this.poolName, handlerSets)
  }

  dispatchEvent(eventType, event) {
    const handlers = this.handlerSets.get(eventType)

    if (!handlers || handlers.length === 0) return

    if (this.poolName !== 'default') {
      handlers[handlers.length - 1](event)
      return
    }

    // Dispatches from the most recent handler, a handler that was added multiple times is called once
    const called = new Set()

    for (let i = handlers.length - 1; i >= 0; i -= 1) {
      if (!called.has(handlers[i])) {
        called.add(handlers[i])
        handlers[i](event)
      }
    }
  }

  hasHandlers(eventType) {
    if (!eventType) return this.handlerSets.size > 0

    const handlers = this.handlerSets.get(eventType)
    return !!handlers && handlers.length > 0
  }

  removeHandlers(eventType, eventHandlers) {
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
