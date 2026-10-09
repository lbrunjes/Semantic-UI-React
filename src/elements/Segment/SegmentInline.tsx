import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface SegmentInlineProps extends StrictSegmentInlineProps {
  [key: string]: any
}

export interface StrictSegmentInlineProps {
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
 * A placeholder segment can be inline.
 */
const SegmentInline = React.forwardRef<HTMLDivElement, SegmentInlineProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('inline', className)
  const rest = getUnhandledProps(SegmentInline, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<SegmentInlineProps, HTMLDivElement>

SegmentInline.displayName = 'SegmentInline'
SegmentInline.handledProps = ['as', 'children', 'className', 'content']

export default SegmentInline
