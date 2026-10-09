import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface MessageContentProps extends StrictMessageContentProps {
  [key: string]: any
}

export interface StrictMessageContentProps {
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
 * A message can contain a content.
 */
const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('content', className)
  const rest = getUnhandledProps(MessageContent, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<MessageContentProps, HTMLDivElement>

MessageContent.displayName = 'MessageContent'
MessageContent.handledProps = ['as', 'children', 'className', 'content']

export default MessageContent
