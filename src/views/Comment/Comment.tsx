import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import CommentAction from './CommentAction'
import CommentActions from './CommentActions'
import CommentAuthor from './CommentAuthor'
import CommentAvatar from './CommentAvatar'
import CommentContent from './CommentContent'
import CommentGroup from './CommentGroup'
import CommentMetadata from './CommentMetadata'
import CommentText from './CommentText'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CommentProps extends StrictCommentProps {
  [key: string]: any
}

export interface StrictCommentProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Comment can be collapsed, or hidden from view. */
  collapsed?: boolean

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

/**
 * A comment displays user feedback to site content.
 */
const Comment = React.forwardRef<HTMLDivElement, CommentProps>(function (props, ref) {
  const { className, children, collapsed, content } = props

  const classes = cx(getKeyOnly(collapsed, 'collapsed'), 'comment', className)
  const rest = getUnhandledProps(Comment, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<CommentProps, HTMLDivElement> & {
  Action: typeof CommentAction
  Actions: typeof CommentActions
  Author: typeof CommentAuthor
  Avatar: typeof CommentAvatar
  Content: typeof CommentContent
  Group: typeof CommentGroup
  Metadata: typeof CommentMetadata
  Text: typeof CommentText
}

Comment.displayName = 'Comment'
Comment.handledProps = ['as', 'children', 'className', 'collapsed', 'content']

Comment.Author = CommentAuthor
Comment.Action = CommentAction
Comment.Actions = CommentActions
Comment.Avatar = CommentAvatar
Comment.Content = CommentContent
Comment.Group = CommentGroup
Comment.Metadata = CommentMetadata
Comment.Text = CommentText

export default Comment
