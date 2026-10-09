import PropTypes from 'prop-types'
import * as React from 'react'

import { childrenUtils, customPropTypes, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface SidebarPushableProps extends StrictSidebarPushableProps {
  [key: string]: any
}

export interface StrictSidebarPushableProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

/**
 * A pushable sub-component for Sidebar.
 */
const SidebarPushable = React.forwardRef<HTMLDivElement, SidebarPushableProps>(
  function (props, ref) {
    const { className, children, content } = props
    const classes = cx('pushable', className)
    const rest = getUnhandledProps(SidebarPushable, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<SidebarPushableProps, HTMLDivElement>

SidebarPushable.displayName = 'SidebarPushable'
SidebarPushable.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

export default SidebarPushable
