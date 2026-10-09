import * as React from 'react'

import {
  childrenUtils,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  getWidthProp,
} from '../../lib'
import Statistic from './Statistic'
import { map } from '../../lib/utils'
import type {
  ForwardRefComponent,
  SemanticCOLORS,
  SemanticShorthandCollection,
  SemanticShorthandContent,
  SemanticWIDTHS,
  SemanticShorthandItem,
} from '../../generic'
import type { StatisticProps, StatisticSizeProp } from './Statistic'

export interface StatisticGroupProps extends StrictStatisticGroupProps {
  [key: string]: any
}

export interface StrictStatisticGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** A statistic group can be formatted to be different colors. */
  color?: SemanticCOLORS

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A statistic group can present its measurement horizontally. */
  horizontal?: boolean

  /** A statistic group can present its measurement horizontally. */
  inverted?: boolean

  /** Array of props for Statistic. */
  items?: SemanticShorthandCollection<StatisticProps>

  /** A statistic group can vary in size. */
  size?: StatisticSizeProp

  /** A statistic group can have its items divided evenly. */
  widths?: SemanticWIDTHS
}

/**
 * A group of statistics.
 */
const StatisticGroup = React.forwardRef<HTMLDivElement, StatisticGroupProps>(function (props, ref) {
  const { children, className, color, content, horizontal, inverted, items, size, widths } = props

  const classes = cx(
    'ui',
    color,
    size,
    getKeyOnly(horizontal, 'horizontal'),
    getKeyOnly(inverted, 'inverted'),
    getWidthProp(widths),
    'statistics',
    className,
  )
  const rest = getUnhandledProps(StatisticGroup, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }
  if (!childrenUtils.isNil(content)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {content}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {map(items, (item: SemanticShorthandItem<StatisticProps>) => Statistic.create(item))}
    </ElementType>
  )
}) as ForwardRefComponent<StatisticGroupProps, HTMLDivElement>

StatisticGroup.displayName = 'StatisticGroup'
StatisticGroup.handledProps = [
  'as',
  'children',
  'className',
  'color',
  'content',
  'horizontal',
  'inverted',
  'items',
  'size',
  'widths',
]

export default StatisticGroup
