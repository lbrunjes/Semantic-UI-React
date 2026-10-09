import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CommentTextProps extends StrictCommentTextProps {
  [key: string]: any
}

export interface StrictCommentTextProps {
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
 * A comment can contain text.
 */
const CommentText = React.forwardRef<HTMLDivElement, CommentTextProps>(function (props, ref) {
  const { className, children, content } = props
  const classes = cx(className, 'text')
  const rest = getUnhandledProps(CommentText, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<CommentTextProps, HTMLDivElement>

CommentText.displayName = 'CommentText'
CommentText.handledProps = ['as', 'children', 'className', 'content']

export default CommentText
