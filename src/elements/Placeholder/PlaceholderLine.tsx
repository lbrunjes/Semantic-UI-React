import * as React from 'react'

import { cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent } from '../../generic'

export interface PlaceholderLineProps extends StrictPlaceholderLineProps {
  [key: string]: any
}

export interface StrictPlaceholderLineProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Additional classes. */
  className?: string

  /** A line can specify how long its contents should appear. */
  length?: 'full' | 'very long' | 'long' | 'medium' | 'short' | 'very short'
}

/**
 * A placeholder can contain have lines of text.
 */
const PlaceholderLine = React.forwardRef<HTMLDivElement, PlaceholderLineProps>(
  function (props, ref) {
    const { className, length } = props

    const classes = cx('line', length, className)
    const rest = getUnhandledProps(PlaceholderLine, props)
    const ElementType = getComponentType(props)

    return <ElementType {...rest} className={classes} ref={ref} />
  },
) as ForwardRefComponent<PlaceholderLineProps, HTMLDivElement>

PlaceholderLine.displayName = 'PlaceholderLine'
PlaceholderLine.handledProps = ['as', 'className', 'length']

export default PlaceholderLine
