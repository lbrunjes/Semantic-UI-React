import EventPool from './EventPool'

/**
 * Manages pools of handlers for a single DOM node. A single native listener (in the capture phase)
 * is attached per event type and dispatches the event to every pool.
 */
export default class EventTarget {
  declare target: any
  declare listeners: Map<string, (event: any) => void>
  declare pools: Map<string, EventPool>

  constructor(target) {
    this.target = target
    this.listeners = new Map()
    this.pools = new Map()
  }

  addHandlers(poolName, eventType, eventHandlers) {
    const pool = this.pools.get(poolName)
    const nextPool = pool
      ? pool.addHandlers(eventType, eventHandlers)
      : EventPool.createByType(poolName, eventType, eventHandlers)

    this.pools.set(poolName, nextPool)

    if (!this.listeners.has(eventType)) this.addTargetListener(eventType)
  }

  hasHandlers() {
    return this.listeners.size > 0
  }

  removeHandlers(poolName, eventType, eventHandlers) {
    const pool = this.pools.get(poolName)

    if (!pool) return

    const nextPool = pool.removeHandlers(eventType, eventHandlers)

    if (nextPool.hasHandlers()) {
      this.pools.set(poolName, nextPool)
    } else {
      this.pools.delete(poolName)
    }

    let hasHandlers = false
    this.pools.forEach((p) => {
      hasHandlers = hasHandlers || p.hasHandlers(eventType)
    })

    if (!hasHandlers) this.removeTargetListener(eventType)
  }

  addTargetListener(eventType) {
    const listener = (event) => {
      this.pools.forEach((pool) => pool.dispatchEvent(eventType, event))
    }

    this.listeners.set(eventType, listener)
    this.target.addEventListener(eventType, listener, true)
  }

  removeTargetListener(eventType) {
    const listener = this.listeners.get(eventType)

    if (!listener) return

    this.target.removeEventListener(eventType, listener, true)
    this.listeners.delete(eventType)
  }
}
