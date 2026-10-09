import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface PlaceholderParagraphProps extends StrictPlaceholderParagraphProps {
  [key: string]: any
}

export interface StrictPlaceholderParagraphProps {
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
 * A placeholder can contain a paragraph.
 */
const PlaceholderParagraph = React.forwardRef<HTMLDivElement, PlaceholderParagraphProps>(
  function (props, ref) {
    const { children, className, content } = props

    const classes = cx('paragraph', className)
    const rest = getUnhandledProps(PlaceholderParagraph, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<PlaceholderParagraphProps, HTMLDivElement>

PlaceholderParagraph.displayName = 'PlaceholderParagraph'
PlaceholderParagraph.handledProps = ['as', 'children', 'className', 'content']

export default PlaceholderParagraph
