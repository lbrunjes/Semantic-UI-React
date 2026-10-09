import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ItemDescriptionProps extends StrictItemDescriptionProps {
  [key: string]: any
}

export interface StrictItemDescriptionProps {
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
 * An item can contain a description with a single or multiple paragraphs.
 */
const ItemDescription = React.forwardRef<HTMLDivElement, ItemDescriptionProps>(
  function (props, ref) {
    const { children, className, content } = props

    const classes = cx('description', className)
    const rest = getUnhandledProps(ItemDescription, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<ItemDescriptionProps, HTMLDivElement>

ItemDescription.displayName = 'ItemDescription'
ItemDescription.handledProps = ['as', 'children', 'className', 'content']

ItemDescription.create = createShorthandFactory(ItemDescription, (content) => ({ content }))

export default ItemDescription
