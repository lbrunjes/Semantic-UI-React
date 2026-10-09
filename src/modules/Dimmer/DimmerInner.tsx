import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
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
  const contentRef = React.useRef(undefined)

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

  const handleClick = (e) => {
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
        <div className='content' ref={contentRef}>
          {childrenContent}
        </div>
      )}
    </ElementType>
  )
}) as ForwardRefComponent<DimmerInnerProps, HTMLDivElement>

DimmerInner.displayName = 'DimmerInner'
DimmerInner.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** An active dimmer will dim its parent container. */
  active: PropTypes.bool,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** A disabled dimmer cannot be activated */
  disabled: PropTypes.bool,

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick: PropTypes.func,

  /**
   * Handles click outside Dimmer's content, but inside Dimmer area.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClickOutside: PropTypes.func,

  /** A dimmer can be formatted to have its colors inverted. */
  inverted: PropTypes.bool,

  /** A dimmer can be formatted to be fixed to the page. */
  page: PropTypes.bool,

  /** A dimmer can be controlled with simple prop. */
  simple: PropTypes.bool,

  /** A dimmer can have its content top or bottom aligned. */
  verticalAlign: PropTypes.oneOf(['bottom', 'top']),
}

export default DimmerInner
