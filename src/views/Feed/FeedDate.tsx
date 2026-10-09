import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface FeedDateProps extends StrictFeedDateProps {
  [key: string]: any
}

export interface StrictFeedDateProps {
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
 * An event or an event summary can contain a date.
 */
const FeedDate = React.forwardRef<HTMLDivElement, FeedDateProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('date', className)
  const rest = getUnhandledProps(FeedDate, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<FeedDateProps, HTMLDivElement>

FeedDate.displayName = 'FeedDate'
FeedDate.handledProps = ['as', 'children', 'className', 'content']

export default FeedDate
