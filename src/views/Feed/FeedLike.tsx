import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import Icon from '../../elements/Icon'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { IconProps } from '../../elements/Icon'

export interface FeedLikeProps extends StrictFeedLikeProps {
  [key: string]: any
}

export interface StrictFeedLikeProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for icon. Mutually exclusive with children. */
  icon?: SemanticShorthandItem<IconProps>
}

/**
 * A feed can contain a like element.
 */
const FeedLike = React.forwardRef<HTMLDivElement, FeedLikeProps>(function (props, ref) {
  const { children, className, content, icon } = props

  const classes = cx('like', className)
  const rest = getUnhandledProps(FeedLike, props)
  const ElementType = getComponentType(props, { defaultAs: 'a' })

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {Icon.create(icon, { autoGenerateKey: false })}
      {content}
    </ElementType>
  )
}) as ForwardRefComponent<FeedLikeProps, HTMLDivElement>

FeedLike.displayName = 'FeedLike'
FeedLike.handledProps = ['as', 'children', 'className', 'content', 'icon']

export default FeedLike
