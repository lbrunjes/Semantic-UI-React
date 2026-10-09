import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface MessageItemProps extends StrictMessageItemProps {
  [key: string]: any
}

export interface StrictMessageItemProps {
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
 * A message list can contain an item.
 */
const MessageItem = React.forwardRef<HTMLLIElement, MessageItemProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('content', className)
  const rest = getUnhandledProps(MessageItem, props)
  const ElementType = getComponentType(props, { defaultAs: 'li' })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<MessageItemProps, HTMLLIElement>

MessageItem.displayName = 'MessageItem'
MessageItem.handledProps = ['as', 'children', 'className', 'content']

MessageItem.create = createShorthandFactory(MessageItem, (content) => ({ content }))

export default MessageItem
