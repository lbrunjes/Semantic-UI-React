import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface DimmerDimmableProps extends StrictDimmerDimmableProps {
  [key: string]: any
}

export interface StrictDimmerDimmableProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A dimmable element can blur its contents. */
  blurring?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Controls whether or not the dim is displayed. */
  dimmed?: boolean
}

/**
 * A dimmable sub-component for Dimmer.
 */
const DimmerDimmable = React.forwardRef<HTMLDivElement, DimmerDimmableProps>(function (props, ref) {
  const { blurring, className, children, content, dimmed } = props

  const classes = cx(
    getKeyOnly(blurring, 'blurring'),
    getKeyOnly(dimmed, 'dimmed'),
    'dimmable',
    className,
  )
  const rest = getUnhandledProps(DimmerDimmable, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<DimmerDimmableProps, HTMLDivElement>

DimmerDimmable.displayName = 'DimmerDimmable'
DimmerDimmable.handledProps = ['as', 'blurring', 'children', 'className', 'content', 'dimmed']

export default DimmerDimmable
