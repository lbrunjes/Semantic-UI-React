import * as React from 'react'

import {
  childrenUtils,
  cx,
  doesNodeContainClick,
  eventStack,
  getComponentType,
  getUnhandledProps,
  isBrowser,
  getKeyOnly,
  shallowEqual,
  useAutoControlledValue,
  useMergedRefs,
} from '../../lib'
import Icon from '../../elements/Icon'
import Portal from '../../addons/Portal'
import ModalActions from './ModalActions'
import ModalContent from './ModalContent'
import ModalDescription from './ModalDescription'
import ModalDimmer from './ModalDimmer'
import ModalHeader from './ModalHeader'
import { canFit, getLegacyStyles, isLegacy } from './utils'
import { includes, isPlainObject, pick, reduce } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { StrictPortalProps } from '../../addons/Portal'
import type { ModalActionsProps } from './ModalActions'
import type { ButtonProps } from '../../elements/Button'
import type { IconProps } from '../../elements/Icon'
import type { ModalContentProps } from './ModalContent'
import type { ModalDimmerProps } from './ModalDimmer'
import type { ModalHeaderProps } from './ModalHeader'

export interface ModalProps extends StrictModalProps {
  [key: string]: any
}

export interface StrictModalProps extends StrictPortalProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Shorthand for Modal.Actions. Typically an array of button shorthand. */
  actions?: SemanticShorthandItem<ModalActionsProps>

  /** A Modal can reduce its complexity */
  basic?: boolean

  /** A modal can be vertically centered in the viewport. */
  centered?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Icon. */
  closeIcon?: any

  /** Whether or not the Modal should close when the dimmer is clicked. */
  closeOnDimmerClick?: boolean

  /** Whether or not the Modal should close when the document is clicked. */
  closeOnDocumentClick?: boolean

  /** A Modal can be passed content via shorthand. */
  content?: SemanticShorthandItem<ModalContentProps>

  /** Initial value of open. */
  defaultOpen?: boolean

  /** A modal can appear in a dimmer. */
  dimmer?: true | 'blurring' | 'inverted' | SemanticShorthandItem<ModalDimmerProps>

  /** Event pool namespace that is used to handle component events */
  eventPool?: string

  /** A Modal can be passed header via shorthand. */
  header?: SemanticShorthandItem<ModalHeaderProps>

  /** The node where the modal should mount. Defaults to document.body. */
  mountNode?: any

  /**
   * Action onClick handler when using shorthand `actions`.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onActionClick?: (event: React.MouseEvent<HTMLElement>, data: ModalProps) => void

  /**
   * Called when a close event happens.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClose?: (event: React.MouseEvent<HTMLElement>, data: ModalProps) => void

  /**
   * Called when the portal is mounted on the DOM.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onMount?: (nothing: null, data: ModalProps) => void

  /**
   * Called when an open event happens.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onOpen?: (event: React.MouseEvent<HTMLElement>, data: ModalProps) => void

  /**
   * Called when the portal is unmounted from the DOM.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onUnmount?: (nothing: null, data: ModalProps) => void

  /** Controls whether or not the Modal is displayed. */
  open?: boolean

  /** A modal can vary in size. */
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'

  /** Custom styles. */
  style?: React.CSSProperties

  /** Element to be rendered in-place where the portal is defined. */
  trigger?: React.ReactNode
}

/**
 * A modal displays content that temporarily blocks interactions with the main view of a site.
 * @see Confirm
 * @see Portal
 */
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(function (props, ref) {
  const {
    actions,
    basic,
    centered = true,
    children,
    className,
    closeIcon,
    closeOnDimmerClick = true,
    closeOnDocumentClick = false,
    content,
    dimmer = true,
    eventPool = 'Modal',
    header,
    size,
    style,
    trigger,
  } = props
  // Do not access document when server side rendering
  const mountNode = isBrowser() ? props.mountNode || document.body : null

  const [open, setOpen] = useAutoControlledValue({
    state: props.open,
    defaultState: props.defaultOpen,
    initialState: false,
  })

  const [legacyStyles, setLegacyStyles] = React.useState<React.CSSProperties>({})
  const [scrolling, setScrolling] = React.useState(false)

  const [legacy] = React.useState(() => isBrowser() && isLegacy())

  const elementRef = useMergedRefs(ref, React.useRef(undefined))
  const dimmerRef = React.useRef<HTMLElement | undefined>(undefined)

  const animationRequestId = React.useRef<number | undefined>(undefined)
  const latestDocumentMouseDownEvent = React.useRef<MouseEvent | null | undefined>(undefined)

  React.useEffect(() => {
    return () => {
      // `cancelAnimationFrame()` ignores `undefined` (no frame was requested)
      cancelAnimationFrame(animationRequestId.current as number)
      latestDocumentMouseDownEvent.current = null
    }
  }, [])

  // ----------------------------------------
  // Styles calc
  // ----------------------------------------

  const setPositionAndClassNames = () => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      const isFitted = canFit(rect)

      setScrolling(!isFitted)

      // Styles should be computed for IE11
      const computedLegacyStyles = legacy ? getLegacyStyles(isFitted, centered, rect) : {}

      if (!shallowEqual(computedLegacyStyles, computedLegacyStyles)) {
        setLegacyStyles(computedLegacyStyles)
      }
    }

    animationRequestId.current = requestAnimationFrame(setPositionAndClassNames)
  }

  // ----------------------------------------
  // Document Event Handlers
  // ----------------------------------------

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false)
    props?.onClose?.(e, { ...props, open: false })
  }

  const handleDocumentMouseDown = (e: MouseEvent) => {
    latestDocumentMouseDownEvent.current = e
  }

  const handleDocumentClick = (e: MouseEvent) => {
    const currentDocumentMouseDownEvent = latestDocumentMouseDownEvent.current
    latestDocumentMouseDownEvent.current = null

    if (
      !closeOnDimmerClick ||
      doesNodeContainClick(elementRef.current, currentDocumentMouseDownEvent) ||
      doesNodeContainClick(elementRef.current, e)
    )
      return

    setOpen(false)
    // A DOM event is passed, the public type of `onClose()` declares a React event
    props?.onClose?.(e as unknown as React.MouseEvent<HTMLElement>, { ...props, open: false })
  }

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(true)
    props?.onOpen?.(e, { ...props, open: true })
  }

  const handlePortalMount = (e: null) => {
    setScrolling(false)
    setPositionAndClassNames()

    eventStack.sub('mousedown', handleDocumentMouseDown, {
      pool: eventPool,
      target: dimmerRef.current,
    })
    eventStack.sub('click', handleDocumentClick, {
      pool: eventPool,
      target: dimmerRef.current,
    })
    props?.onMount?.(e, props)
  }

  const handlePortalUnmount = (e: null) => {
    cancelAnimationFrame(animationRequestId.current as number)
    eventStack.unsub('mousedown', handleDocumentMouseDown, {
      pool: eventPool,
      target: dimmerRef.current,
    })
    eventStack.unsub('click', handleDocumentClick, {
      pool: eventPool,
      target: dimmerRef.current,
    })
    props?.onUnmount?.(e, props)
  }

  // ----------------------------------------
  // Render
  // ----------------------------------------

  const renderContent = (rest: Record<string, any>) => {
    const classes = cx(
      'ui',
      size,
      getKeyOnly(basic, 'basic'),
      getKeyOnly(legacy, 'legacy'),
      getKeyOnly(scrolling, 'scrolling'),
      'modal transition visible active',
      className,
    )
    const ElementType = getComponentType(props)

    const closeIconName = closeIcon === true ? 'close' : closeIcon
    const closeIconJSX = Icon.create(closeIconName, {
      overrideProps: (predefinedProps: IconProps) => ({
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          predefinedProps?.onClick?.(e)
          handleClose(e)
        },
      }),
    })

    return (
      <ElementType
        {...rest}
        className={classes}
        ref={elementRef}
        style={{ ...legacyStyles, ...style }}
      >
        {closeIconJSX}
        {childrenUtils.isNil(children) ? (
          <>
            {ModalHeader.create(header, { autoGenerateKey: false })}
            {ModalContent.create(content, { autoGenerateKey: false })}
            {ModalActions.create(actions, {
              overrideProps: (predefinedProps: ModalActionsProps) => ({
                onActionClick: (
                  e: React.MouseEvent<HTMLAnchorElement>,
                  actionProps: ButtonProps,
                ) => {
                  predefinedProps?.onActionClick?.(e, actionProps)
                  props?.onActionClick?.(e, props)

                  handleClose(e)
                },
              }),
            })}
          </>
        ) : (
          children
        )}
      </ElementType>
    )
  }

  // Short circuit when server side rendering
  if (!isBrowser()) {
    return React.isValidElement(trigger) ? trigger : null
  }

  const unhandled = getUnhandledProps(Modal, props)
  // Portal always defines its handled props
  const portalPropNames = Portal.handledProps!

  const rest = reduce(
    unhandled,
    (acc: Record<string, any>, val: unknown, key: string) => {
      if (!includes(portalPropNames, key)) acc[key] = val

      return acc
    },
    {},
  )
  const portalProps = pick(unhandled, portalPropNames)

  // Heads up!
  //
  // The SUI CSS selector to prevent the modal itself from blurring requires an immediate .dimmer child:
  // .blurring.dimmed.dimmable>:not(.dimmer) { ... }
  //
  // The .blurring.dimmed.dimmable is the body, so that all body content inside is blurred.
  // We need the immediate child to be the dimmer to :not() blur the modal itself!
  // Otherwise, the portal div is also blurred, blurring the modal.
  //
  // We cannot them wrap the modalJSX in an actual <Dimmer /> instead, we apply the dimmer classes to the <Portal />.

  return (
    <Portal
      closeOnDocumentClick={closeOnDocumentClick}
      {...portalProps}
      trigger={trigger}
      eventPool={eventPool}
      mountNode={mountNode}
      open={open}
      onClose={handleClose}
      onMount={handlePortalMount}
      onOpen={handleOpen}
      onUnmount={handlePortalUnmount}
    >
      {ModalDimmer.create(isPlainObject(dimmer) ? dimmer : {}, {
        autoGenerateKey: false,
        defaultProps: {
          blurring: dimmer === 'blurring',
          inverted: dimmer === 'inverted',
        },
        overrideProps: {
          children: renderContent(rest),
          centered,
          mountNode,
          scrolling,
          ref: dimmerRef,
        },
      })}
    </Portal>
  )
}) as ForwardRefComponent<ModalProps, HTMLDivElement> & {
  Actions: typeof ModalActions
  Content: typeof ModalContent
  Description: typeof ModalDescription
  Dimmer: typeof ModalDimmer
  Header: typeof ModalHeader
}

Modal.displayName = 'Modal'
Modal.handledProps = [
  'actions',
  'as',
  'basic',
  'centered',
  'children',
  'className',
  'closeIcon',
  'closeOnDimmerClick',
  'closeOnDocumentClick',
  'content',
  'defaultOpen',
  'dimmer',
  'eventPool',
  'header',
  'mountNode',
  'onActionClick',
  'onClose',
  'onMount',
  'onOpen',
  'onUnmount',
  'open',
  'size',
  'style',
  'trigger',
]

Modal.Actions = ModalActions
Modal.Content = ModalContent
Modal.Description = ModalDescription
Modal.Dimmer = ModalDimmer
Modal.Header = ModalHeader

export default Modal
