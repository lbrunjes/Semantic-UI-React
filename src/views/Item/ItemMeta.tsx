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

export interface ItemMetaProps extends StrictItemMetaProps {
  [key: string]: any
}

export interface StrictItemMetaProps {
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
 * An item can contain content metadata.
 */
const ItemMeta = React.forwardRef<HTMLDivElement, ItemMetaProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('meta', className)
  const rest = getUnhandledProps(ItemMeta, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ItemMetaProps, HTMLDivElement>

ItemMeta.displayName = 'ItemMeta'
ItemMeta.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

ItemMeta.create = createShorthandFactory(ItemMeta, (content) => ({ content }))

export default ItemMeta
