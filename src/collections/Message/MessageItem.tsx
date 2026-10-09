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
MessageItem.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

MessageItem.create = createShorthandFactory(MessageItem, (content) => ({ content }))

export default MessageItem
