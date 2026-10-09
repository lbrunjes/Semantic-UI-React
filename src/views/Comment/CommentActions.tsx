import PropTypes from 'prop-types'
import * as React from 'react'

import { childrenUtils, customPropTypes, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CommentActionsProps extends StrictCommentActionsProps {
  [key: string]: any
}

export interface StrictCommentActionsProps {
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
 * A comment can contain an list of actions a user may perform related to this comment.
 */
const CommentActions = React.forwardRef<HTMLDivElement, CommentActionsProps>(function (props, ref) {
  const { className, children, content } = props
  const classes = cx('actions', className)
  const rest = getUnhandledProps(CommentActions, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<CommentActionsProps, HTMLDivElement>

CommentActions.displayName = 'CommentActions'
CommentActions.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

export default CommentActions
