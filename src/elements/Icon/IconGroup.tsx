import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
} from '../../lib'
import { without } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'
import type { IconSizeProp } from './Icon'

export interface IconGroupProps extends StrictIconGroupProps {
  [key: string]: any
}

export interface StrictIconGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Size of the icon group. */
  size?: IconSizeProp
}

/**
 * Several icons can be used together as a group.
 */
const IconGroup = React.forwardRef<HTMLElement, IconGroupProps>(function (props, ref) {
  const { children, className, content, size } = props

  const classes = cx(size, 'icons', className)
  const rest = getUnhandledProps(IconGroup, props)
  const ElementType = getComponentType(props, { defaultAs: 'i' })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<IconGroupProps, HTMLElement>

IconGroup.displayName = 'IconGroup'
IconGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Size of the icon group. */
  size: PropTypes.oneOf(without(SUI.SIZES, 'medium')),
}

export default IconGroup
