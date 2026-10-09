import PropTypes from 'prop-types'
import * as React from 'react'

import {
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  isRefObject,
  isBrowser,
  useEventCallback,
  useIsomorphicLayoutEffect,
} from '../../lib'
import type { ForwardRefComponent } from '../../generic'

export interface StickyProps extends StrictStickyProps {
  [key: string]: any
}

export interface StrictStickyProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A Sticky can be active. */
  active?: boolean

  /** Offset in pixels from the bottom of the screen when fixing element to viewport. */
  bottomOffset?: number

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Context which sticky element should stick to. */
  context?: Document | Window | HTMLElement | React.Ref<HTMLElement>

  /** Offset in pixels from the top of the screen when fixing element to viewport. */
  offset?: number

  /**
   * Callback when element is bound to bottom of parent container.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onBottom?: (event: React.MouseEvent<HTMLElement>, data: StickyProps) => void

  /**
   * Callback when element is fixed to page.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onStick?: (event: React.MouseEvent<HTMLElement>, data: StickyProps) => void

  /**
   * Callback when element is bound to top of parent container.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onTop?: (event: React.MouseEvent<HTMLElement>, data: StickyProps) => void

  /**
   * Callback when element is unfixed from page.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onUnstick?: (event: React.MouseEvent<HTMLElement>, data: StickyProps) => void

  /** Whether element should be "pushed" by the viewport, attaching to the bottom of the screen when scrolling up. */
  pushing?: boolean

  /** Context which sticky should attach onscroll events. */
  scrollContext?: Document | Window | HTMLElement | React.Ref<HTMLElement>

  /** Custom style for sticky element. */
  styleElement?: React.CSSProperties
}

/**
 * Sticky content stays fixed to the browser viewport while another column of content is visible on the page.
 */
const Sticky = React.forwardRef<HTMLDivElement, StickyProps>(function (props, ref) {
  const {
    active = true,
    bottomOffset = 0,
    children,
    className,
    context,
    offset = 0,
    scrollContext = isBrowser() ? window : null,
    styleElement,
  } = props

  const [sticky, setSticky] = React.useState(false)
  const [bound, setBound] = React.useState()
  const [bottom, setBottom] = React.useState()
  const [pushing, setPushing] = React.useState()
  const [top, setTop] = React.useState()

  const stickyRef = React.useRef(undefined)
  const triggerRef = React.useRef(undefined)

  const triggerRect = React.useRef(undefined)
  const contextRect = React.useRef(undefined)
  const stickyRect = React.useRef(undefined)

  const frameId = React.useRef(undefined)
  const ticking = React.useRef(undefined)

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  const assignRects = () => {
    const contextNode = isRefObject(context) ? context.current : context || document.body

    triggerRect.current = triggerRef.current.getBoundingClientRect()
    contextRect.current = contextNode.getBoundingClientRect()
    stickyRect.current = stickyRef.current.getBoundingClientRect()
  }

  const computeStyle = () => {
    if (!sticky) {
      return styleElement
    }

    return {
      bottom: bound ? 0 : bottom,
      top: bound ? undefined : top,
      width: triggerRect.current.width,
      ...styleElement,
    }
  }

  // Return true when the component reached the bottom of the context
  const didReachContextBottom = () =>
    stickyRect.current.height + offset >= contextRect.current.bottom

  // Return true when the component reached the starting point
  const didReachStartingPoint = () => stickyRect.current.top <= triggerRect.current.top

  // Return true when the top of the screen overpasses the Sticky component
  const didTouchScreenTop = () => triggerRect.current.top < offset

  // Return true when the bottom of the screen overpasses the Sticky component
  const didTouchScreenBottom = () => contextRect.current.bottom + bottomOffset > window.innerHeight

  // Return true if the height of the component is higher than the window
  const isOversized = () => stickyRect.current.height > window.innerHeight

  // ----------------------------------------
  // Stick helpers
  // ----------------------------------------

  // If true, the component will stick to the bottom of the screen instead of the top
  const togglePushing = (value) => {
    if (props.pushing) {
      setPushing(value)
    }
  }

  const setSticked = (e, newBound) => {
    setBound(newBound)
    setSticky(true)

    props?.onStick?.(e, props)
  }

  const setUnsticked = (e, newBound) => {
    setBound(newBound)
    setSticky(false)

    props?.onUnstick?.(e, props)
  }

  const stickToContextBottom = (e) => {
    setSticked(e, true)
    togglePushing(true)

    props?.onBottom?.(e, props)
  }

  const stickToContextTop = (e) => {
    setUnsticked(e, false)
    togglePushing(false)

    props?.onTop?.(e, props)
  }

  const stickToScreenBottom = (e) => {
    setSticked(e, false)

    setBottom(bottomOffset)
    setTop(null)
  }

  const stickToScreenTop = (e) => {
    setSticked(e, false)

    setBottom(null)
    setTop(offset)
  }

  // ----------------------------------------
  // Handlers
  // ----------------------------------------

  const update = (e) => {
    ticking.current = false
    assignRects()

    if (pushing) {
      if (didReachStartingPoint()) {
        stickToContextTop(e)
        return
      }

      if (didTouchScreenBottom()) {
        stickToScreenBottom(e)
        return
      }

      stickToContextBottom(e)
      return
    }

    if (isOversized()) {
      if (contextRect.current.top > 0) {
        stickToContextTop(e)
        return
      }

      if (contextRect.current.bottom < window.innerHeight) {
        stickToContextBottom(e)
        return
      }
    }

    if (didTouchScreenTop()) {
      if (didReachContextBottom()) {
        stickToContextBottom(e)
        return
      }

      stickToScreenTop(e)
      return
    }

    stickToContextTop(e)
  }

  const handleUpdate = useEventCallback((e) => {
    if (!ticking.current) {
      ticking.current = true
      frameId.current = requestAnimationFrame(() => update(e))
    }
  })

  // ----------------------------------------
  // State control
  // ----------------------------------------

  useIsomorphicLayoutEffect(() => {
    if (!active) {
      setSticky(false)
    }
  }, [active])

  // ----------------------------------------
  // Effects
  // ----------------------------------------

  useIsomorphicLayoutEffect(() => {
    if (active) {
      handleUpdate()
    }
  }, [active])

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(frameId.current)
    }
  }, [])

  // ----------------------------------------
  // Document events
  // ----------------------------------------

  React.useEffect(() => {
    const scrollContextNode = isRefObject(scrollContext) ? scrollContext.current : scrollContext

    if (active && scrollContextNode) {
      scrollContextNode?.addEventListener('resize', handleUpdate)
      scrollContextNode?.addEventListener('scroll', handleUpdate)
    }

    return () => {
      scrollContextNode?.removeEventListener('resize', handleUpdate)
      scrollContextNode?.removeEventListener('scroll', handleUpdate)
    }
  }, [active, scrollContext])

  // ----------------------------------------
  // Render
  // ----------------------------------------

  const rest = getUnhandledProps(Sticky, props)
  const ElementType = getComponentType(props)

  const containerClasses = cx(
    sticky && 'ui',
    sticky && 'stuck-container',
    sticky && (bound ? 'bound-container' : 'fixed-container'),
    className,
  )
  const elementClasses = cx(
    'ui',
    sticky && (bound ? 'bound bottom' : 'fixed'),
    sticky && !bound && (bottom === null ? 'top' : 'bottom'),
    'sticky',
  )
  const triggerStyles = sticky ? { height: stickyRect.current?.height } : {}

  return (
    <ElementType {...rest} className={containerClasses} ref={ref}>
      <div ref={triggerRef} style={triggerStyles} />
      <div className={elementClasses} ref={stickyRef} style={computeStyle()}>
        {children}
      </div>
    </ElementType>
  )
}) as ForwardRefComponent<StickyProps, HTMLDivElement>

Sticky.displayName = 'Sticky'
Sticky.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A Sticky can be active. */
  active: PropTypes.bool,

  /** Offset in pixels from the bottom of the screen when fixing element to viewport. */
  bottomOffset: PropTypes.number,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Context which sticky element should stick to. */
  context: PropTypes.oneOfType([customPropTypes.domNode, customPropTypes.refObject]),

  /** Offset in pixels from the top of the screen when fixing element to viewport. */
  offset: PropTypes.number,

  /**
   * Callback when element is bound to bottom of parent container.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onBottom: PropTypes.func,

  /**
   * Callback when element is fixed to page.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onStick: PropTypes.func,

  /**
   * Callback when element is bound to top of parent container.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onTop: PropTypes.func,

  /**
   * Callback when element is unfixed from page.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onUnstick: PropTypes.func,

  /** Whether element should be "pushed" by the viewport, attaching to the bottom of the screen when scrolling up. */
  pushing: PropTypes.bool,

  /** Context which sticky should attach onscroll events. */
  scrollContext: PropTypes.oneOfType([customPropTypes.domNode, customPropTypes.refObject]),

  /** Custom style for sticky element. */
  styleElement: PropTypes.object,
}

export default Sticky
