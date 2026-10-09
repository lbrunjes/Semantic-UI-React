import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface HeaderContentProps extends StrictHeaderContentProps {
  [key: string]: any
}

export interface StrictHeaderContentProps {
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
 * Header content wraps the main content when there is an adjacent Icon or Image.
 */
const HeaderContent = React.forwardRef<HTMLDivElement, HeaderContentProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('content', className)
  const rest = getUnhandledProps(HeaderContent, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<HeaderContentProps, HTMLDivElement>

HeaderContent.displayName = 'HeaderContent'
HeaderContent.handledProps = ['as', 'children', 'className', 'content']

export default HeaderContent
