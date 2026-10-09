import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import FeedContent from './FeedContent'
import FeedDate from './FeedDate'
import FeedEvent from './FeedEvent'
import FeedExtra from './FeedExtra'
import FeedLabel from './FeedLabel'
import FeedLike from './FeedLike'
import FeedMeta from './FeedMeta'
import FeedSummary from './FeedSummary'
import FeedUser from './FeedUser'
import { map } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandCollection } from '../../generic'
import type { FeedEventProps } from './FeedEvent'

export interface FeedProps extends StrictFeedProps {
  [key: string]: any
}

export interface StrictFeedProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand array of props for FeedEvent. */
  events?: SemanticShorthandCollection<FeedEventProps>

  /** A feed can have different sizes. */
  size?: 'small' | 'large'
}

/**
 * A feed presents user activity chronologically.
 */
const Feed = React.forwardRef<HTMLDivElement, FeedProps>(function (props, ref) {
  const { children, className, events, size } = props

  const classes = cx('ui', size, 'feed', className)
  const rest = getUnhandledProps(Feed, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  const eventElements = map(events, (eventProps: FeedEventProps) => {
    const { childKey, date, meta, summary, ...eventData } = eventProps
    const finalKey = childKey ?? [date, meta, summary].join('-')

    // TODO: use .create() factory
    return <FeedEvent date={date} key={finalKey} meta={meta} summary={summary} {...eventData} />
  })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {eventElements}
    </ElementType>
  )
}) as ForwardRefComponent<FeedProps, HTMLDivElement> & {
  Content: typeof FeedContent
  Date: typeof FeedDate
  Event: typeof FeedEvent
  Extra: typeof FeedExtra
  Label: typeof FeedLabel
  Meta: typeof FeedMeta
  Like: typeof FeedLike
  Summary: typeof FeedSummary
  User: typeof FeedUser
}

Feed.displayName = 'Feed'
Feed.handledProps = ['as', 'children', 'className', 'events', 'size']

Feed.Content = FeedContent
Feed.Date = FeedDate
Feed.Event = FeedEvent
Feed.Extra = FeedExtra
Feed.Label = FeedLabel
Feed.Like = FeedLike
Feed.Meta = FeedMeta
Feed.Summary = FeedSummary
Feed.User = FeedUser

export default Feed
