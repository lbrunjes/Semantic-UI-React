import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface DividerProps extends StrictDividerProps {
  [key: string]: any
}

export interface StrictDividerProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Divider can clear the content above it. */
  clearing?: boolean

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Divider can be fitted without any space above or below it. */
  fitted?: boolean

  /** Divider can divide content without creating a dividing line. */
  hidden?: boolean

  /** Divider can segment content horizontally. */
  horizontal?: boolean

  /** Divider can have its colours inverted. */
  inverted?: boolean

  /** Divider can provide greater margins to divide sections of content. */
  section?: boolean

  /** Divider can segment content vertically. */
  vertical?: boolean
}

/**
 * A divider visually segments content into groups.
 */
const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function (props, ref) {
  const {
    children,
    className,
    clearing,
    content,
    fitted,
    hidden,
    horizontal,
    inverted,
    section,
    vertical,
  } = props

  const classes = cx(
    'ui',
    getKeyOnly(clearing, 'clearing'),
    getKeyOnly(fitted, 'fitted'),
    getKeyOnly(hidden, 'hidden'),
    getKeyOnly(horizontal, 'horizontal'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(section, 'section'),
    getKeyOnly(vertical, 'vertical'),
    'divider',
    className,
  )
  const rest = getUnhandledProps(Divider, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<DividerProps, HTMLDivElement>

Divider.displayName = 'Divider'
Divider.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Divider can clear the content above it. */
  clearing: PropTypes.bool,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Divider can be fitted without any space above or below it. */
  fitted: PropTypes.bool,

  /** Divider can divide content without creating a dividing line. */
  hidden: PropTypes.bool,

  /** Divider can segment content horizontally. */
  horizontal: PropTypes.bool,

  /** Divider can have its colours inverted. */
  inverted: PropTypes.bool,

  /** Divider can provide greater margins to divide sections of content. */
  section: PropTypes.bool,

  /** Divider can segment content vertically. */
  vertical: PropTypes.bool,
}

export default Divider
