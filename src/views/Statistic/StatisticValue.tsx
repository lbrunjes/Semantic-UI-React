import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
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
StatisticValue.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Format the value with smaller font size to fit nicely beside number values. */
  text: PropTypes.bool,
}

StatisticValue.create = createShorthandFactory(StatisticValue, (content) => ({ content }))

export default StatisticValue
