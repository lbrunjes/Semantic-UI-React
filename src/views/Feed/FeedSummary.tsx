import * as React from 'react'

import { childrenUtils, createShorthand, cx, getComponentType, getUnhandledProps } from '../../lib'
import FeedDate from './FeedDate'
import FeedUser from './FeedUser'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { FeedDateProps } from './FeedDate'
import type { FeedUserProps } from './FeedUser'

export interface FeedSummaryProps extends StrictFeedSummaryProps {
  [key: string]: any
}

export interface StrictFeedSummaryProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for FeedDate. */
  date?: SemanticShorthandItem<FeedDateProps>

  /** Shorthand for FeedUser. */
  user?: SemanticShorthandItem<FeedUserProps>
}

/**
 * A feed can contain a summary.
 */
const FeedSummary = React.forwardRef<HTMLDivElement, FeedSummaryProps>(function (props, ref) {
  const { children, className, content, date, user } = props

  const classes = cx('summary', className)
  const rest = getUnhandledProps(FeedSummary, props)
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
      {createShorthand(FeedUser, (val) => ({ content: val }), user, { autoGenerateKey: false })}
      {/*
        Content styles require wrapping whitespace
        https://github.com/Semantic-Org/Semantic-UI-React/pull/3836
      */}
      {content && ' '}
      {content}
      {content && ' '}
      {createShorthand(FeedDate, (val) => ({ content: val }), date, { autoGenerateKey: false })}
    </ElementType>
  )
}) as ForwardRefComponent<FeedSummaryProps, HTMLDivElement>

FeedSummary.displayName = 'FeedSummary'
FeedSummary.handledProps = ['as', 'children', 'className', 'content', 'date', 'user']

export default FeedSummary
