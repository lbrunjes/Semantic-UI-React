import * as React from 'react'

import {
  childrenUtils,
  cx,
  doesNodeContainClick,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  getVerticalAlignProp,
  useIsomorphicLayoutEffect,
  useMergedRefs,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface DimmerInnerProps extends StrictDimmerInnerProps {
  [key: string]: any
}

export interface StrictDimmerInnerProps {
  /** An element type to render as (string or function). */
  as?: any

  /** An active dimmer will dim its parent container. */
  active?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A disabled dimmer cannot be activated */
  disabled?: boolean

  /**
   * Called when the dimmer is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>, data: DimmerInnerProps) => void

  /**
   * Handles click outside Dimmer's content, but inside Dimmer area.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClickOutside?: (event: React.MouseEvent<HTMLDivElement>, data: DimmerInnerProps) => void

  /** A dimmer can be formatted to have its colors inverted. */
  inverted?: boolean

  /** A dimmer can be formatted to be fixed to the page. */
  page?: boolean

  /** A dimmer can be controlled with simple prop. */
  simple?: boolean

  /** A dimmer can have its content top or bottom aligned. */
  verticalAlign?: 'bottom' | 'top'
}

/**
 * An inner element for a Dimmer.
 */
const DimmerInner = React.forwardRef<HTMLDivElement, DimmerInnerProps>(function (props, ref) {
  const { active, children, className, content, disabled, inverted, page, simple, verticalAlign } =
    props

  const containerRef = useMergedRefs(ref, React.useRef(undefined))
  const contentRef = React.useRef<HTMLDivElement>(undefined)

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current?.style) {
      return
    }

    if (active) {
      containerRef.current.style.setProperty('display', 'flex', 'important')
    } else {
      containerRef.current.style.removeProperty('display')
    }
  }, [active])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    props?.onClick?.(e, props)

    if (contentRef.current !== e.target && doesNodeContainClick(contentRef.current, e)) {
      return
    }

    props?.onClickOutside?.(e, props)
  }

  const classes = cx(
    'ui',
    getKeyOnly(active, 'active transition visible'),
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(page, 'page'),
    getKeyOnly(simple, 'simple'),
    getVerticalAlignProp(verticalAlign),
    'dimmer',
    className,
  )
  const rest = getUnhandledProps(DimmerInner, props)
  const ElementType = getComponentType(props)

  const childrenContent = childrenUtils.isNil(children) ? content : children

  return (
    <ElementType {...rest} className={classes} onClick={handleClick} ref={containerRef}>
      {childrenContent && (
        <div className='content' ref={contentRef as React.RefObject<HTMLDivElement>}>
          {childrenContent}
        </div>
      )}
    </ElementType>
  )
}) as ForwardRefComponent<DimmerInnerProps, HTMLDivElement>

DimmerInner.displayName = 'DimmerInner'
DimmerInner.handledProps = [
  'active',
  'as',
  'children',
  'className',
  'content',
  'disabled',
  'inverted',
  'onClick',
  'onClickOutside',
  'page',
  'simple',
  'verticalAlign',
]

export default DimmerInner
