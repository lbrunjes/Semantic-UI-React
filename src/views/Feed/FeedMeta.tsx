import * as React from 'react'

import { childrenUtils, createShorthand, cx, getComponentType, getUnhandledProps } from '../../lib'
import FeedLike from './FeedLike'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { FeedLikeProps } from './FeedLike'

export interface FeedMetaProps extends StrictFeedMetaProps {
  [key: string]: any
}

export interface StrictFeedMetaProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for FeedLike. */
  like?: SemanticShorthandItem<FeedLikeProps>
}

/**
 * A feed can contain a meta.
 */
const FeedMeta = React.forwardRef<HTMLDivElement, FeedMetaProps>(function (props, ref) {
  const { children, className, content, like } = props

  const classes = cx('meta', className)
  const rest = getUnhandledProps(FeedMeta, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {createShorthand(FeedLike, (val) => ({ content: val }), like, { autoGenerateKey: false })}
      {content}
    </ElementType>
  )
}) as ForwardRefComponent<FeedMetaProps, HTMLDivElement>

FeedMeta.displayName = 'FeedMeta'
FeedMeta.handledProps = ['as', 'children', 'className', 'content', 'like']

export default FeedMeta
