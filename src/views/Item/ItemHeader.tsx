import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ItemHeaderProps extends StrictItemHeaderProps {
  [key: string]: any
}

export interface StrictItemHeaderProps {
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
 * An item can contain a header.
 */
const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('header', className)
  const rest = getUnhandledProps(ItemHeader, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ItemHeaderProps, HTMLDivElement>

ItemHeader.displayName = 'ItemHeader'
ItemHeader.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

ItemHeader.create = createShorthandFactory(ItemHeader, (content) => ({ content }))

export default ItemHeader
