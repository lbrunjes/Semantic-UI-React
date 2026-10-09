import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ItemExtraProps extends StrictItemExtraProps {
  [key: string]: any
}

export interface StrictItemExtraProps {
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
 * An item can contain extra content meant to be formatted separately from the main content.
 */
const ItemExtra = React.forwardRef<HTMLDivElement, ItemExtraProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('extra', className)
  const rest = getUnhandledProps(ItemExtra, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ItemExtraProps, HTMLDivElement>

ItemExtra.displayName = 'ItemExtra'
ItemExtra.handledProps = ['as', 'children', 'className', 'content']

ItemExtra.create = createShorthandFactory(ItemExtra, (content) => ({ content }))

export default ItemExtra
