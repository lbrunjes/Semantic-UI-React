import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CommentMetadataProps extends StrictCommentMetadataProps {
  [key: string]: any
}

export interface StrictCommentMetadataProps {
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
 * A comment can contain metadata about the comment, an arbitrary amount of metadata may be defined.
 */
const CommentMetadata = React.forwardRef<HTMLDivElement, CommentMetadataProps>(
  function (props, ref) {
    const { className, children, content } = props
    const classes = cx('metadata', className)
    const rest = getUnhandledProps(CommentMetadata, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<CommentMetadataProps, HTMLDivElement>

CommentMetadata.displayName = 'CommentMetadata'
CommentMetadata.handledProps = ['as', 'children', 'className', 'content']

export default CommentMetadata
