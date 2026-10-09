import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface StatisticLabelProps extends StrictStatisticLabelProps {
  [key: string]: any
}

export interface StrictStatisticLabelProps {
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
 * A statistic can contain a label to help provide context for the presented value.
 */
const StatisticLabel = React.forwardRef<HTMLDivElement, StatisticLabelProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('label', className)
  const rest = getUnhandledProps(StatisticLabel, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<StatisticLabelProps, HTMLDivElement>

StatisticLabel.displayName = 'StatisticLabel'
StatisticLabel.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

StatisticLabel.create = createShorthandFactory(StatisticLabel, (content) => ({ content }))

export default StatisticLabel
