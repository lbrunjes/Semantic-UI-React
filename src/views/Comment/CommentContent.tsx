import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CommentContentProps extends StrictCommentContentProps {
  [key: string]: any
}

export interface StrictCommentContentProps {
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
 * A comment can contain content.
 */
const CommentContent = React.forwardRef<HTMLDivElement, CommentContentProps>(function (props, ref) {
  const { className, children, content } = props
  const classes = cx(className, 'content')
  const rest = getUnhandledProps(CommentContent, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<CommentContentProps, HTMLDivElement>

CommentContent.displayName = 'CommentContent'
CommentContent.handledProps = ['as', 'children', 'className', 'content']

export default CommentContent
