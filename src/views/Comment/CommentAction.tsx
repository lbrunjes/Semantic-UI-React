import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CommentActionProps extends StrictCommentActionProps {
  [key: string]: any
}

export interface StrictCommentActionProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Style as the currently active action. */
  active?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

/**
 * A comment can contain an action.
 */
const CommentAction = React.forwardRef<HTMLDivElement, CommentActionProps>(function (props, ref) {
  const { active, className, children, content } = props

  const classes = cx(getKeyOnly(active, 'active'), className)
  const rest = getUnhandledProps(CommentAction, props)
  const ElementType = getComponentType(props, { defaultAs: 'a' })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<CommentActionProps, HTMLDivElement>

CommentAction.displayName = 'CommentAction'
CommentAction.handledProps = ['active', 'as', 'children', 'className', 'content']

export default CommentAction
