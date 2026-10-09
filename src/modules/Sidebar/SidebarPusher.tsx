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

export interface SidebarPusherProps extends StrictSidebarPusherProps {
  [key: string]: any
}

export interface StrictSidebarPusherProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Controls whether or not the dim is displayed. */
  dimmed?: boolean
}

/**
 * A pushable sub-component for Sidebar.
 */
const SidebarPusher = React.forwardRef<HTMLDivElement, SidebarPusherProps>(function (props, ref) {
  const { className, dimmed, children, content } = props

  const classes = cx('pusher', getKeyOnly(dimmed, 'dimmed'), className)
  const rest = getUnhandledProps(SidebarPusher, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<SidebarPusherProps, HTMLDivElement>

SidebarPusher.displayName = 'SidebarPusher'
SidebarPusher.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Controls whether or not the dim is displayed. */
  dimmed: PropTypes.bool,
}

export default SidebarPusher
