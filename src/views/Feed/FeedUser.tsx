import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface FeedUserProps extends StrictFeedUserProps {
  [key: string]: any
}

export interface StrictFeedUserProps {
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
 * A feed can contain a user element.
 */
const FeedUser = React.forwardRef<HTMLAnchorElement, FeedUserProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('user', className)
  const rest = getUnhandledProps(FeedUser, props)
  const ElementType = getComponentType(props, { defaultAs: 'a' })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<FeedUserProps, HTMLAnchorElement>

FeedUser.displayName = 'FeedUser'
FeedUser.handledProps = ['as', 'children', 'className', 'content']

export default FeedUser
