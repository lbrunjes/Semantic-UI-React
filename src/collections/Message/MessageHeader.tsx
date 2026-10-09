import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface MessageHeaderProps extends StrictMessageHeaderProps {
  [key: string]: any
}

export interface StrictMessageHeaderProps {
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
 * A message can contain a header.
 */
const MessageHeader = React.forwardRef<HTMLDivElement, MessageHeaderProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('header', className)
  const rest = getUnhandledProps(MessageHeader, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<MessageHeaderProps, HTMLDivElement>

MessageHeader.displayName = 'MessageHeader'
MessageHeader.handledProps = ['as', 'children', 'className', 'content']

MessageHeader.create = createShorthandFactory(MessageHeader, (val) => ({ content: val }))

export default MessageHeader
