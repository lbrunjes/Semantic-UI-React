import type * as React from 'react'

import isRefObject from '../isRefObject'
import type { EventHandler } from './EventPool'
import EventTarget from './EventTarget'

export type { EventHandler }

/**
 * A target to subscribe to: "document", "window", a DOM node or a ref object with it. A missing
 * target (or a ref without a value) falls back to `document`.
 */
export type EventStackTarget =
  | 'document'
  | 'window'
  | globalThis.EventTarget
  | React.RefObject<globalThis.EventTarget | null | undefined>
  | null
  | undefined

export interface EventStackOptions {
  /** A pool name, see `EventPool` for the dispatching rules. Defaults to "default". */
  pool?: string

  /** A target to subscribe to. Defaults to `document`. */
  target?: EventStackTarget
}

// Heads up! Not `isBrowser()`: it can be overridden (i.e. to simulate SSR in tests), which would
// silently skip unsubscribing handlers that were subscribed before.
const canUseDOM = () =>
  typeof window !== 'undefined' && !!window.document && !!window.document.createElement

const normalizeHandlers = (handlers: EventHandler | EventHandler[]) =>
  Array.isArray(handlers) ? handlers : [handlers]

const normalizeTarget = (target: EventStackTarget): globalThis.EventTarget => {
  if (target === 'document') return document
  if (target === 'window') return window
  if (isRefObject(target)) return target.current || document

  return target || document
}

/**
 * Subscribes handlers to DOM events in pools, see `EventPool` for the dispatching rules.
 */
export default class EventStackManager {
  declare targets: Map<globalThis.EventTarget, EventTarget>

  constructor() {
    this.targets = new Map()
  }

  sub(
    eventName: string,
    eventHandlers: EventHandler | EventHandler[],
    options: EventStackOptions = {},
  ) {
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

  unsub(
    eventName: string,
    eventHandlers: EventHandler | EventHandler[],
    options: EventStackOptions = {},
  ) {
    if (!canUseDOM()) return

    const { pool = 'default', target = document } = options
    const normalizedTarget = normalizeTarget(target)
    const eventTarget = this.targets.get(normalizedTarget)

    if (!eventTarget) return

    eventTarget.removeHandlers(pool, eventName, normalizeHandlers(eventHandlers))

    if (!eventTarget.hasHandlers()) this.targets.delete(normalizedTarget)
  }
}
