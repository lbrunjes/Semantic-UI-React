import * as React from 'react'

import isBrowser from './isBrowser'

/** A ref object pointing to `document`, a default target for listeners. */
export const documentRef: React.RefObject<Document | null> = {
  current: isBrowser() ? document : null,
}

// `window.event` is deprecated and missing in some typings, hence `any`
const getWindowEvent = (target: any): Event | undefined => {
  if (!target) return undefined
  if (typeof target.window === 'object' && target.window === target) return target.event

  return target.ownerDocument?.defaultView?.event
}

export interface EventListenerProps {
  /** Use the capture phase. */
  capture?: boolean

  /** A handler for the event, the latest one is always invoked. */
  listener(e: Event): void

  /** A DOM node to subscribe on. */
  target?: EventTarget | null

  /** A ref to a DOM node to subscribe on, takes precedence over `target`. */
  targetRef?: React.RefObject<EventTarget | null | undefined>

  /** The DOM event type. */
  type: string
}

/**
 * Subscribes to a DOM event on a target while mounted, always invoking the latest listener.
 * A drop-in replacement for "@fluentui/react-component-event-listener".
 *
 * @param {Object} props
 * @param {boolean} [props.capture=false] Use the capture phase.
 * @param {Function} props.listener A handler for the event.
 * @param {Document|Window|HTMLElement} [props.target] A DOM node to subscribe on.
 * @param {React.RefObject} [props.targetRef] A ref to a DOM node to subscribe on, takes precedence.
 * @param {string} props.type The DOM event type.
 */
function EventListener(props: EventListenerProps) {
  const { capture = false, listener, target, targetRef, type } = props

  const latestListener = React.useRef(listener)
  latestListener.current = listener

  React.useEffect(() => {
    const element = targetRef ? targetRef.current : target

    if (!element) return undefined

    // Heads up!
    // Skips the event that is being dispatched while the listener is attached, otherwise i.e. a
    // click that opens a component would also be handled as a click outside of it.
    // https://github.com/facebook/react/issues/20074
    let currentEvent = getWindowEvent(window)

    const handler = (e: Event) => {
      if (e === currentEvent) {
        currentEvent = undefined
        return
      }

      latestListener.current(e)
    }

    const timeoutId = setTimeout(() => {
      currentEvent = undefined
    }, 1)

    element.addEventListener(type, handler, capture)

    return () => {
      clearTimeout(timeoutId)
      element.removeEventListener(type, handler, capture)
    }
  }, [capture, target, targetRef, type])

  return null
}

EventListener.displayName = 'EventListener'

export default EventListener
