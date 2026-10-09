import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface StatisticValueProps extends StrictStatisticValueProps {
  [key: string]: any
}

export interface StrictStatisticValueProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Format the value with smaller font size to fit nicely beside number values. */
  text?: boolean
}

/**
 * A statistic can contain a numeric, icon, image, or text value.
 */
const StatisticValue = React.forwardRef<HTMLDivElement, StatisticValueProps>(function (props, ref) {
  const { children, className, content, text } = props

  const classes = cx(getKeyOnly(text, 'text'), 'value', className)
  const rest = getUnhandledProps(StatisticValue, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<StatisticValueProps, HTMLDivElement>

StatisticValue.displayName = 'StatisticValue'
StatisticValue.handledProps = ['as', 'children', 'className', 'content', 'text']

StatisticValue.create = createShorthandFactory(StatisticValue, (content) => ({ content }))

export default StatisticValue
