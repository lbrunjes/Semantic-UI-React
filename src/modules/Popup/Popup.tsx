import * as React from 'react'

import {
  childrenUtils,
  createHTMLDivision,
  cx,
  getComponentType,
  getUnhandledProps,
  shallowEqual,
  useIsomorphicLayoutEffect,
  getKeyOnly,
  getKeyOrValueAndKey,
  useMergedRefs,
  usePrevious,
} from '../../lib'
import Portal from '../../addons/Portal'
import { placementMapping, positionsMapping } from './lib/positions'
import createReferenceProxy from './lib/createReferenceProxy'
import { Popper } from './lib/Popper'
import type { PopperChildrenProps } from './lib/Popper'
import PopupContent from './PopupContent'
import PopupHeader from './PopupHeader'
import { includes, pick, reduce } from '../../lib/utils'
import type { SemanticShorthandItem } from '../../generic'
import type { StrictPortalProps } from '../../addons/Portal'
import type { PopupContentProps } from './PopupContent'
import type { PopupHeaderProps } from './PopupHeader'
import type * as PopperJS from '@popperjs/core'

type PopperOffsetsFunctionParams = {
  popper: PopperJS.Rect
  reference: PopperJS.Rect
  placement: PopperJS.Placement
}

type PopperOffsetsFunction = (params: PopperOffsetsFunctionParams) => [number?, number?]

export interface PopupProps extends StrictPopupProps {
  [key: string]: any
}

export interface StrictPopupProps extends StrictPortalProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Display the popup without the pointing arrow */
  basic?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Simple text content for the popover. */
  content?: SemanticShorthandItem<PopupContentProps>

  /** Existing element the pop-up should be bound to. */
  context?: Document | Window | HTMLElement | React.RefObject<HTMLElement>

  /** A disabled popup only renders its trigger. */
  disabled?: boolean

  /** Enables the Popper.js event listeners. */
  eventsEnabled?: boolean

  /** A flowing Popup has no maximum width and continues to flow to fit its content. */
  flowing?: boolean

  /** Header displayed above the content in bold. */
  header?: SemanticShorthandItem<PopupHeaderProps>

  /** Hide the Popup when scrolling the window. */
  hideOnScroll?: boolean

  /** Whether the popup should not close on hover. */
  hoverable?: boolean

  /** Invert the colors of the popup */
  inverted?: boolean

  /**
   * Offset values in px unit to apply to rendered popup. The basic offset accepts an
   * array with two numbers in the form [skidding, distance]:
   * - `skidding` displaces the Popup along the reference element
   * - `distance` displaces the Popup away from, or toward, the reference element in the direction of its placement. A positive number displaces it further away, while a negative number lets it overlap the reference.
   *
   * @see https://popper.js.org/docs/v2/modifiers/offset/
   */
  offset?: [number, number?] | PopperOffsetsFunction

  /** Events triggering the popup. */
  on?: 'hover' | 'click' | 'focus' | ('hover' | 'click' | 'focus')[]

  /**
   * Called when a close event happens.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClose?: (event: React.MouseEvent<HTMLElement>, data: PopupProps) => void

  /**
   * Called when the portal is mounted on the DOM.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onMount?: (nothing: null, data: PopupProps) => void

  /**
   * Called when an open event happens.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onOpen?: (event: React.MouseEvent<HTMLElement>, data: PopupProps) => void

  /**
   * Called when the portal is unmounted from the DOM.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onUnmount?: (nothing: null, data: PopupProps) => void

  /** Disables automatic repositioning of the component, it will always be placed according to the position value. */
  pinned?: boolean

  /** Position for the popover. */
  position?:
    | 'top left'
    | 'top right'
    | 'bottom right'
    | 'bottom left'
    | 'right center'
    | 'left center'
    | 'top center'
    | 'bottom center'

  /** Tells `Popper.js` to use the `position: fixed` strategy to position the popover. */
  positionFixed?: boolean

  /** A wrapping element for an actual content that will be used for positioning. */
  popper?: SemanticShorthandItem<React.HTMLAttributes<HTMLDivElement>>

  /** An array containing custom settings for the Popper.js modifiers. */
  popperModifiers?: any[]

  /** A popup can have dependencies which update will schedule a position update. */
  popperDependencies?: any[]

  /** Popup size. */
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'huge'

  /** Custom Popup style. */
  style?: React.CSSProperties

  /** Element to be rendered in-place where the popup is defined. */
  trigger?: React.ReactNode

  /** Popup width. */
  wide?: boolean | 'very'
}

/**
 * Calculates props specific for Portal component.
 *
 * @param {Object} props
 */
function getPortalProps(props: PopupProps) {
  const portalProps: Record<string, any> = {}

  const on = props.on ?? ['click', 'hover']
  const normalizedOn = Array.isArray(on) ? on : [on]

  if (props.hoverable) {
    portalProps.closeOnPortalMouseLeave = true
    portalProps.mouseLeaveDelay = 300
  }

  if (includes(normalizedOn, 'hover')) {
    portalProps.openOnTriggerClick = false
    portalProps.closeOnTriggerClick = false
    portalProps.openOnTriggerMouseEnter = true
    portalProps.closeOnTriggerMouseLeave = true
    // Taken from SUI: https://git.io/vPmCm
    portalProps.mouseLeaveDelay = 70
    portalProps.mouseEnterDelay = 50
  }

  if (includes(normalizedOn, 'click')) {
    portalProps.openOnTriggerClick = true
    portalProps.closeOnTriggerClick = true
    portalProps.closeOnDocumentClick = true
  }

  if (includes(normalizedOn, 'focus')) {
    portalProps.openOnTriggerFocus = true
    portalProps.closeOnTriggerBlur = true
  }

  return portalProps
}

/**
 * Splits props for Portal & Popup.
 *
 * @param {Object} unhandledProps
 * @param {Boolean} disabled
 */
function partitionPortalProps(
  unhandledProps: Record<string, any>,
  disabled: boolean,
): { contentRestProps?: Record<string, any>; portalRestProps?: Record<string, any> } {
  if (disabled) {
    return {}
  }

  const contentRestProps = reduce(
    unhandledProps,
    (acc: Record<string, any>, val: unknown, key: string) => {
      if (!includes(Portal.handledProps, key)) acc[key] = val

      return acc
    },
    {},
  )
  const portalRestProps = pick(unhandledProps, Portal.handledProps)

  return { contentRestProps, portalRestProps }
}

/**
 * Performs updates when "popperDependencies" are not shallow equal.
 *
 * @param {Array} popperDependencies
 * @param {React.Ref} positionUpdate
 */
function usePositioningEffect(
  popperDependencies: unknown[] | undefined,
  positionUpdate: React.RefObject<(() => unknown) | null | undefined>,
) {
  const previousDependencies = usePrevious(popperDependencies)

  useIsomorphicLayoutEffect(() => {
    if (positionUpdate.current) {
      positionUpdate.current()
    }
  }, [shallowEqual(previousDependencies, popperDependencies)])
}

/**
 * A Popup displays additional information on top of a page.
 */
// eslint-disable-next-line react/display-name -- it is assigned below, the cast to the public type hides it from the rule
const Popup = React.forwardRef<any, PopupProps>(function (props, ref) {
  const {
    basic,
    className,
    content,
    context,
    children,
    disabled = false,
    eventsEnabled = true,
    flowing,
    header,
    hideOnScroll = false,
    inverted,
    offset,
    pinned = false,
    popper,
    popperDependencies,
    popperModifiers = [],
    position = 'top left',
    positionFixed,
    size,
    style,
    trigger,
    wide,
  } = props

  const unhandledProps = getUnhandledProps(Popup, props)
  const { contentRestProps, portalRestProps } = partitionPortalProps(unhandledProps, disabled)

  const elementRef = useMergedRefs(ref)
  const positionUpdate = React.useRef<(() => unknown) | null | undefined>(undefined)
  const triggerRef = React.useRef<HTMLElement | undefined>(undefined)
  const zIndexWasSynced = React.useRef(false)

  // ----------------------------------------
  // Effects
  // ----------------------------------------

  usePositioningEffect(popperDependencies, positionUpdate)

  // ----------------------------------------
  // Handlers
  // ----------------------------------------

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    props?.onClose?.(e, { ...props, open: false })
  }

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    props?.onOpen?.(e, { ...props, open: true })
  }

  const handlePortalMount = (e: null) => {
    props?.onMount?.(e, props)
  }

  const handlePortalUnmount = (e: null) => {
    positionUpdate.current = null
    props?.onUnmount?.(e, props)
  }

  // ----------------------------------------
  // Render
  // ----------------------------------------

  const renderBody = ({
    placement: popperPlacement,
    ref: popperRef,
    update,
    style: popperStyle,
  }: PopperChildrenProps) => {
    positionUpdate.current = update

    const classes = cx(
      'ui',
      placementMapping[popperPlacement],
      size,
      getKeyOrValueAndKey(wide, 'wide'),
      getKeyOnly(basic, 'basic'),
      getKeyOnly(flowing, 'flowing'),
      getKeyOnly(inverted, 'inverted'),
      'popup transition visible',
      className,
    )
    const ElementType = getComponentType(props)

    const styles = {
      // Heads up! We need default styles to get working correctly `flowing`
      left: 'auto',
      right: 'auto',
      // This is required to be properly positioned inside wrapping `div`
      position: 'initial',
      ...style,
    }

    const innerElement = (
      <ElementType {...contentRestProps} className={classes} style={styles} ref={elementRef}>
        {childrenUtils.isNil(children) ? (
          <>
            {PopupHeader.create(header, { autoGenerateKey: false })}
            {PopupContent.create(content, { autoGenerateKey: false })}
          </>
        ) : (
          children
        )}
      </ElementType>
    )

    // https://github.com/popperjs/popper-core/blob/f1f9d1ab75b6b0e962f90a5b2a50f6cfd307d794/src/createPopper.js#L136-L137
    // Heads up!
    // A wrapping `div` there is a pure magic, it's required as Popper warns on margins that are
    // defined by SUI CSS. It also means that this `div` will be positioned instead of `content`.
    return createHTMLDivision(popper || {}, {
      overrideProps: {
        children: innerElement,
        ref: popperRef,
        style: {
          // Fixes layout for floated elements
          // https://github.com/Semantic-Org/Semantic-UI-React/issues/4092
          display: 'flex',
          ...popperStyle,
        },
      },
    })
  }

  if (disabled) {
    return trigger
  }

  const modifiers = [
    { name: 'arrow', enabled: false },
    { name: 'eventListeners', options: { scroll: !!eventsEnabled, resize: !!eventsEnabled } },
    { name: 'flip', enabled: !pinned },
    { name: 'preventOverflow', enabled: !!offset },
    { name: 'offset', enabled: !!offset, options: { offset } },
    ...popperModifiers,

    // We are syncing zIndex from `.ui.popup.content` to avoid layering issues as in SUIR we are using an additional
    // `div` for Popper.js
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/4083
    {
      name: 'syncZIndex',
      enabled: true,
      phase: 'beforeRead',
      fn: ({ state }: { state: PopperJS.State }) => {
        if (zIndexWasSynced.current) {
          return
        }

        // if zIndex defined in <Popup popper={{ style: {} }} /> there is no sense to override it
        const definedZIndex = popper?.style?.zIndex

        if (definedZIndex === undefined) {
          state.elements.popper.style.zIndex = window.getComputedStyle(
            // The wrapping `div` always renders the popup element as its child
            state.elements.popper.firstChild as Element,
          ).zIndex
        }

        zIndexWasSynced.current = true
      },
      effect: () => {
        return () => {
          zIndexWasSynced.current = false
        }
      },
    },
  ]

  const referenceElement = createReferenceProxy(context == null ? triggerRef : context)
  const mergedPortalProps = { ...getPortalProps(props), ...portalRestProps }

  return (
    <Portal
      {...mergedPortalProps}
      onClose={handleClose}
      onMount={handlePortalMount}
      onOpen={handleOpen}
      onUnmount={handlePortalUnmount}
      trigger={trigger}
      triggerRef={triggerRef}
      hideOnScroll={hideOnScroll}
    >
      <Popper
        modifiers={modifiers}
        placement={positionsMapping[position]}
        strategy={positionFixed ? 'fixed' : null}
        referenceElement={referenceElement}
      >
        {renderBody}
      </Popper>
    </Portal>
  )
}) as unknown as React.FC<PopupProps> & {
  Content: typeof PopupContent
  Header: typeof PopupHeader
}

Popup.displayName = 'Popup'
Popup.handledProps = [
  'as',
  'basic',
  'children',
  'className',
  'content',
  'context',
  'disabled',
  'eventsEnabled',
  'flowing',
  'header',
  'hideOnScroll',
  'hoverable',
  'inverted',
  'offset',
  'on',
  'onClose',
  'onMount',
  'onOpen',
  'onUnmount',
  'pinned',
  'popper',
  'popperDependencies',
  'popperModifiers',
  'position',
  'positionFixed',
  'size',
  'style',
  'trigger',
  'wide',
]

Popup.Content = PopupContent
Popup.Header = PopupHeader

export default Popup
