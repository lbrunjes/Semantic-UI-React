import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CommentAuthorProps extends StrictCommentAuthorProps {
  [key: string]: any
}

export interface StrictCommentAuthorProps {
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
 * A comment can contain an author.
 */
const CommentAuthor = React.forwardRef<HTMLDivElement, CommentAuthorProps>(function (props, ref) {
  const { className, children, content } = props
  const classes = cx('author', className)
  const rest = getUnhandledProps(CommentAuthor, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<CommentAuthorProps, HTMLDivElement>

CommentAuthor.displayName = 'CommentAuthor'
CommentAuthor.handledProps = ['as', 'children', 'className', 'content']

export default CommentAuthor
