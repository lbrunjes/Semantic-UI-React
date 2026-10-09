import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'
import type { SegmentSizeProp } from './Segment'

export interface SegmentGroupProps extends StrictSegmentGroupProps {
  [key: string]: any
}

export interface StrictSegmentGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** A segment may take up only as much space as is necessary. */
  compact?: boolean

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Formats content to be aligned horizontally. */
  horizontal?: boolean

  /** Formatted to look like a pile of pages. */
  piled?: boolean

  /** A segment group may be formatted to raise above the page. */
  raised?: boolean

  /** A segment group can have different sizes. */
  size?: SegmentSizeProp

  /** Formatted to show it contains multiple pages. */
  stacked?: boolean
}

/**
 * A group of segments can be formatted to appear together.
 */
const SegmentGroup = React.forwardRef<HTMLDivElement, SegmentGroupProps>(function (props, ref) {
  const { children, className, compact, content, horizontal, piled, raised, size, stacked } = props

  const classes = cx(
    'ui',
    size,
    getKeyOnly(compact, 'compact'),
    getKeyOnly(horizontal, 'horizontal'),
    getKeyOnly(piled, 'piled'),
    getKeyOnly(raised, 'raised'),
    getKeyOnly(stacked, 'stacked'),
    'segments',
    className,
  )
  const rest = getUnhandledProps(SegmentGroup, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<SegmentGroupProps, HTMLDivElement>

SegmentGroup.displayName = 'SegmentGroup'
SegmentGroup.handledProps = [
  'as',
  'children',
  'className',
  'compact',
  'content',
  'horizontal',
  'piled',
  'raised',
  'size',
  'stacked',
]

export default SegmentGroup
