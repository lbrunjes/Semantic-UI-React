import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getTextAlignProp } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CardHeaderProps extends StrictCardHeaderProps {
  [key: string]: any
}

export interface StrictCardHeaderProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A card header can adjust its text alignment. */
  textAlign?: 'center' | 'left' | 'right'
}

/**
 * A card can contain a header.
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function (props, ref) {
  const { children, className, content, textAlign } = props
  const classes = cx(getTextAlignProp(textAlign), 'header', className)
  const rest = getUnhandledProps(CardHeader, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<CardHeaderProps, HTMLDivElement>

CardHeader.displayName = 'CardHeader'
CardHeader.handledProps = ['as', 'children', 'className', 'content', 'textAlign']

export default CardHeader
