import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ListListProps extends StrictListListProps {
  [key: string]: any
}

export interface StrictListListProps {
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
 * A list can contain a sub list.
 */
const ListList = React.forwardRef<HTMLDivElement, ListListProps>(function (props, ref) {
  const { children, className, content } = props

  const rest = getUnhandledProps(ListList, props)
  const ElementType = getComponentType(props)
  const classes = cx(getKeyOnly(ElementType !== 'ul' && ElementType !== 'ol', 'list'), className)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ListListProps, HTMLDivElement>

ListList.displayName = 'ListList'
ListList.handledProps = ['as', 'children', 'className', 'content']

export default ListList
