import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ListHeaderProps extends StrictListHeaderProps {
  [key: string]: any
}

export interface StrictListHeaderProps {
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
 * A list item can contain a header.
 */
const ListHeader = React.forwardRef<HTMLDivElement, ListHeaderProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('header', className)
  const rest = getUnhandledProps(ListHeader, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ListHeaderProps, HTMLDivElement>

ListHeader.displayName = 'ListHeader'
ListHeader.handledProps = ['as', 'children', 'className', 'content']

ListHeader.create = createShorthandFactory(ListHeader, (content) => ({ content }))

export default ListHeader
