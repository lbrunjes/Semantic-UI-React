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
import MessageItem from './MessageItem'
import { map } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandCollection } from '../../generic'
import type { MessageItemProps } from './MessageItem'

export interface MessageListProps extends StrictMessageListProps {
  [key: string]: any
}

export interface StrictMessageListProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand Message.Items. */
  items?: SemanticShorthandCollection<MessageItemProps>
}

/**
 * A message can contain a list of items.
 */
const MessageList = React.forwardRef<HTMLUListElement, MessageListProps>(function (props, ref) {
  const { children, className, items } = props

  const classes = cx('list', className)
  const rest = getUnhandledProps(MessageList, props)
  const ElementType = getComponentType(props, { defaultAs: 'ul' })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? map(items, MessageItem.create) : children}
    </ElementType>
  )
}) as ForwardRefComponent<MessageListProps, HTMLUListElement>

MessageList.displayName = 'MessageList'
MessageList.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand Message.Items. */
  items: customPropTypes.collectionShorthand,
}

MessageList.create = createShorthandFactory(MessageList, (val) => ({ items: val }))

export default MessageList
