import * as React from 'react'

import {
  doesNodeContainClick,
  EventStack,
  keyboardKey,
  useAutoControlledValue,
  useEventCallback,
} from '../../lib'
import useTrigger from './utils/useTrigger'
import PortalInner from './PortalInner'
import { isElement } from '../../lib/utils'
export interface PortalProps extends StrictPortalProps {
  [key: string]: any
}

export interface StrictPortalProps {
  /** Primary content. */
  children?: React.ReactNode

  /** Controls whether or not the portal should close on a click outside. */
  closeOnDocumentClick?: boolean

  /** Controls whether or not the portal should close when escape is pressed is displayed. */
  closeOnEscape?: boolean

  /**
   * Controls whether or not the portal should close when mousing out of the portal.
   * NOTE: This will prevent `closeOnTriggerMouseLeave` when mousing over the
   * gap from the trigger to the portal.
   */
  closeOnPortalMouseLeave?: boolean

  /** Controls whether or not the portal should close on blur of the trigger. */
  closeOnTriggerBlur?: boolean

  /** Controls whether or not the portal should close on click of the trigger. */
  closeOnTriggerClick?: boolean

  /** Controls whether or not the portal should close when mousing out of the trigger. */
  closeOnTriggerMouseLeave?: boolean

  /** Initial value of open. */
  defaultOpen?: boolean

  /** Event pool namespace that is used to handle component events. */
  eventPool?: string

  /** Hide the Popup when scrolling the window. */
  hideOnScroll?: boolean

  /** The node where the portal should mount. */
  mountNode?: any

  /** Milliseconds to wait before opening on mouse over */
  mouseEnterDelay?: number

  /** Milliseconds to wait before closing on mouse leave */
  mouseLeaveDelay?: number

  /**
   * Called when a close event happens
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClose?: (event: React.MouseEvent<HTMLElement>, data: PortalProps) => void

  /**
   * Called when the portal is mounted on the DOM
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onMount?: (nothing: null, data: PortalProps) => void

  /**
   * Called when an open event happens
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onOpen?: (event: React.MouseEvent<HTMLElement>, data: PortalProps) => void

  /**
   * Called when the portal is unmounted from the DOM
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onUnmount?: (nothing: null, data: PortalProps) => void

  /** Controls whether or not the portal is displayed. */
  open?: boolean

  /** Controls whether or not the portal should open when the trigger is clicked. */
  openOnTriggerClick?: boolean

  /** Controls whether or not the portal should open on focus of the trigger. */
  openOnTriggerFocus?: boolean

  /** Controls whether or not the portal should open when mousing over the trigger. */
  openOnTriggerMouseEnter?: boolean

  /** Element to be rendered in-place where the portal is defined. */
  trigger?: React.ReactNode

  /** Called with a ref to the trigger node. */
  triggerRef?: React.Ref<any>
}

/**
 * A component that allows you to render children outside their parent.
 * @see Modal
 * @see Popup
 * @see Dimmer
 * @see Confirm
 */
const Portal = function Portal(props: PortalProps) {
  const {
    children,
    closeOnDocumentClick = true,
    closeOnEscape = true,
    closeOnPortalMouseLeave,
    closeOnTriggerBlur,
    closeOnTriggerClick,
    closeOnTriggerMouseLeave,
    eventPool = 'default',
    mountNode,
    mouseEnterDelay,
    mouseLeaveDelay,
    openOnTriggerClick = true,
    openOnTriggerFocus,
    openOnTriggerMouseEnter,
    hideOnScroll = false,
  } = props

  const [open, setOpen] = useAutoControlledValue({
    state: props.open,
    defaultState: props.defaultOpen,
    initialState: false,
  })

  const contentRef = React.useRef<HTMLElement | null | undefined>(undefined)
  const [triggerRef, trigger] = useTrigger(props.trigger, props.triggerRef)

  const mouseEnterTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mouseLeaveTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const latestDocumentMouseDownEvent = React.useRef<MouseEvent | null | undefined>(undefined)

  // ----------------------------------------
  // Behavior
  // ----------------------------------------

  // Portal events are React events from the trigger, DOM events from the document/window or
  // clones of them (see below), they are passed as is to `onOpen()` & `onClose()`
  const openPortal = (e: any) => {
    setOpen(true)
    props?.onOpen?.(e, { ...props, open: true })
  }

  const openPortalWithTimeout = (
    e: React.SyntheticEvent<HTMLElement>,
    delay: number | undefined,
  ) => {
    // React wipes the entire event object and suggests using e.persist() if
    // you need the event for async access. However, even with e.persist
    // certain required props (e.g. currentTarget) are null so we're forced to clone.
    const eventClone = { ...e }
    return setTimeout(() => openPortal(eventClone), delay || 0)
  }

  const closePortal = useEventCallback((e: any) => {
    setOpen(false)
    props?.onClose?.(e, { ...props, open: false })
  })

  const closePortalWithTimeout = (
    e: MouseEvent | React.SyntheticEvent<HTMLElement>,
    delay: number | undefined,
  ) => {
    // React wipes the entire event object and suggests using e.persist() if
    // you need the event for async access. However, even with e.persist
    // certain required props (e.g. currentTarget) are null so we're forced to clone.
    const eventClone = { ...e }
    return setTimeout(() => closePortal(eventClone), delay || 0)
  }

  // ----------------------------------------
  // Document Event Handlers
  // ----------------------------------------

  React.useEffect(() => {
    // Clean up timers
    clearTimeout(mouseEnterTimer.current)
    clearTimeout(mouseLeaveTimer.current)
  }, [])

  const handleDocumentMouseDown = (e: MouseEvent) => {
    latestDocumentMouseDownEvent.current = e
  }

  const handleDocumentClick = (e: MouseEvent) => {
    const currentMouseDownEvent = latestDocumentMouseDownEvent.current
    latestDocumentMouseDownEvent.current = null

    // event happened in trigger (delegate to trigger handlers)
    const isInsideTrigger = doesNodeContainClick(triggerRef.current, e)
    // event originated in the portal but was ended outside
    const isOriginatedFromPortal =
      currentMouseDownEvent && doesNodeContainClick(contentRef.current, currentMouseDownEvent)
    // event happened in the portal
    const isInsidePortal = doesNodeContainClick(contentRef.current, e)

    if (
      !contentRef.current?.contains || // no portal
      isInsideTrigger ||
      isOriginatedFromPortal ||
      isInsidePortal
    ) {
      return
    } // ignore the click

    if (closeOnDocumentClick) {
      closePortal(e)
    }
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (!closeOnEscape) {
      return
    }
    if (keyboardKey.getCode(e) !== keyboardKey.Escape) {
      return
    }

    closePortal(e)
  }

  // ----------------------------------------
  // Component Event Handlers
  // ----------------------------------------

  React.useEffect(() => {
    if (!hideOnScroll) {
      return
    }

    const handleScroll = (e: Event) => {
      // Do not hide the popup when scroll comes from inside the popup
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/4305
      // TODO(bug): the listener is also registered while the portal is closed, `contentRef.current`
      // is unset then and this throws if the event target is an element (window scroll events
      // target the document, so only for synthetic/captured events)
      if (isElement(e.target) && contentRef.current!.contains(e.target as Node)) {
        return
      }

      closePortal(e)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [closePortal, hideOnScroll])

  const handlePortalMouseLeave = (e: MouseEvent) => {
    if (!closeOnPortalMouseLeave) {
      return
    }

    // Do not close the portal when 'mouseleave' is triggered by children
    if (e.target !== contentRef.current) {
      return
    }

    mouseLeaveTimer.current = closePortalWithTimeout(e, mouseLeaveDelay)
  }

  const handlePortalMouseEnter = () => {
    // In order to enable mousing from the trigger to the portal, we need to
    // clear the mouseleave timer that was set when leaving the trigger.
    if (!closeOnPortalMouseLeave) {
      return
    }

    clearTimeout(mouseLeaveTimer.current)
  }

  const handleTriggerBlur = (e: React.FocusEvent<HTMLElement>, ...rest: unknown[]) => {
    // Call original event handler
    trigger?.props?.onBlur?.(e, ...rest)

    // IE 11 doesn't work with relatedTarget in blur events
    const target = e.relatedTarget || document.activeElement
    // do not close if focus is given to the portal
    const didFocusPortal = contentRef.current?.contains?.(target)

    if (!closeOnTriggerBlur || didFocusPortal) {
      return
    }

    closePortal(e)
  }

  const handleTriggerClick = (e: React.MouseEvent<HTMLElement>, ...rest: unknown[]) => {
    // Call original event handler
    trigger?.props?.onClick?.(e, ...rest)

    if (open && closeOnTriggerClick) {
      closePortal(e)
    } else if (!open && openOnTriggerClick) {
      openPortal(e)
    }
  }

  const handleTriggerFocus = (e: React.FocusEvent<HTMLElement>, ...rest: unknown[]) => {
    // Call original event handler
    trigger?.props?.onFocus?.(e, ...rest)

    if (!openOnTriggerFocus) {
      return
    }

    openPortal(e)
  }

  const handleTriggerMouseLeave = (e: React.MouseEvent<HTMLElement>, ...rest: unknown[]) => {
    clearTimeout(mouseEnterTimer.current)

    // Call original event handler
    trigger?.props?.onMouseLeave?.(e, ...rest)

    if (!closeOnTriggerMouseLeave) {
      return
    }

    mouseLeaveTimer.current = closePortalWithTimeout(e, mouseLeaveDelay)
  }

  const handleTriggerMouseEnter = (e: React.MouseEvent<HTMLElement>, ...rest: unknown[]) => {
    clearTimeout(mouseLeaveTimer.current)

    // Call original event handler
    trigger?.props?.onMouseEnter?.(e, ...rest)

    if (!openOnTriggerMouseEnter) {
      return
    }

    mouseEnterTimer.current = openPortalWithTimeout(e, mouseEnterDelay)
  }

  return (
    <>
      {open && (
        <>
          <PortalInner
            mountNode={mountNode}
            onMount={() => props?.onMount?.(null, props)}
            onUnmount={() => props?.onUnmount?.(null, props)}
            ref={contentRef}
          >
            {children}
          </PortalInner>

          <EventStack
            name='mouseleave'
            on={handlePortalMouseLeave}
            pool={eventPool}
            target={contentRef}
          />
          <EventStack
            name='mouseenter'
            on={handlePortalMouseEnter}
            pool={eventPool}
            target={contentRef}
          />
          <EventStack name='mousedown' on={handleDocumentMouseDown} pool={eventPool} />
          <EventStack name='click' on={handleDocumentClick} pool={eventPool} />
          <EventStack name='keydown' on={handleEscape} pool={eventPool} />
        </>
      )}
      {trigger &&
        React.cloneElement(trigger, {
          onBlur: handleTriggerBlur,
          onClick: handleTriggerClick,
          onFocus: handleTriggerFocus,
          onMouseLeave: handleTriggerMouseLeave,
          onMouseEnter: handleTriggerMouseEnter,
          ref: triggerRef,
        })}
    </>
  )
}

Portal.displayName = 'Portal'
Portal.handledProps = [
  'children',
  'closeOnDocumentClick',
  'closeOnEscape',
  'closeOnPortalMouseLeave',
  'closeOnTriggerBlur',
  'closeOnTriggerClick',
  'closeOnTriggerMouseLeave',
  'defaultOpen',
  'eventPool',
  'hideOnScroll',
  'mountNode',
  'mouseEnterDelay',
  'mouseLeaveDelay',
  'onClose',
  'onMount',
  'onOpen',
  'onUnmount',
  'open',
  'openOnTriggerClick',
  'openOnTriggerFocus',
  'openOnTriggerMouseEnter',
  'trigger',
  'triggerRef',
]

Portal.Inner = PortalInner

export default Portal as React.FC<PortalProps> & {
  Inner: typeof PortalInner
}
