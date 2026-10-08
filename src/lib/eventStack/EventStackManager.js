import isRefObject from '../isRefObject'
import EventTarget from './EventTarget'

// Heads up! Not `isBrowser()`: it can be overridden (i.e. to simulate SSR in tests), which would
// silently skip unsubscribing handlers that were subscribed before.
const canUseDOM = () =>
  typeof window !== 'undefined' && !!window.document && !!window.document.createElement

const normalizeHandlers = (handlers) => (Array.isArray(handlers) ? handlers : [handlers])

const normalizeTarget = (target) => {
  if (target === 'document') return document
  if (target === 'window') return window
  if (isRefObject(target)) return target.current || document

  return target || document
}

/**
 * Subscribes handlers to DOM events in pools, see `EventPool` for the dispatching rules.
 */
export default class EventStackManager {
  constructor() {
    this.targets = new Map()
  }

  sub(eventName, eventHandlers, options = {}) {
    if (!canUseDOM()) return

    const { pool = 'default', target = document } = options
    const normalizedTarget = normalizeTarget(target)

    let eventTarget = this.targets.get(normalizedTarget)

    if (!eventTarget) {
      eventTarget = new EventTarget(normalizedTarget)
      this.targets.set(normalizedTarget, eventTarget)
    }

    eventTarget.addHandlers(pool, eventName, normalizeHandlers(eventHandlers))
  }

  unsub(eventName, eventHandlers, options = {}) {
    if (!canUseDOM()) return

    const { pool = 'default', target = document } = options
    const normalizedTarget = normalizeTarget(target)
    const eventTarget = this.targets.get(normalizedTarget)

    if (!eventTarget) return

    eventTarget.removeHandlers(pool, eventName, normalizeHandlers(eventHandlers))

    if (!eventTarget.hasHandlers()) this.targets.delete(normalizedTarget)
  }
}
