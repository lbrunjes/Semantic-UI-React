import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import PlaceholderHeader from './PlaceholderHeader'
import PlaceholderImage from './PlaceholderImage'
import PlaceholderLine from './PlaceholderLine'
import PlaceholderParagraph from './PlaceholderParagraph'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface PlaceholderProps extends StrictPlaceholderProps {
  [key: string]: any
}

export interface StrictPlaceholderProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A fluid placeholder takes up the width of its container. */
  fluid?: boolean

  /** A placeholder can have their colors inverted. */
  inverted?: boolean
}

/**
 * A placeholder is used to reserve space for content that soon will appear in a layout.
 */
const Placeholder = React.forwardRef<HTMLDivElement, PlaceholderProps>(function (props, ref) {
  const { children, className, content, fluid, inverted } = props
  const classes = cx(
    'ui',
    getKeyOnly(fluid, 'fluid'),
    getKeyOnly(inverted, 'inverted'),
    'placeholder',
    className,
  )
  const rest = getUnhandledProps(Placeholder, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<PlaceholderProps, HTMLDivElement> & {
  Header: typeof PlaceholderHeader
  Line: typeof PlaceholderLine
  Image: typeof PlaceholderImage
  Paragraph: typeof PlaceholderParagraph
}

Placeholder.displayName = 'Placeholder'
Placeholder.handledProps = ['as', 'children', 'className', 'content', 'fluid', 'inverted']

Placeholder.Header = PlaceholderHeader
Placeholder.Image = PlaceholderImage
Placeholder.Line = PlaceholderLine
Placeholder.Paragraph = PlaceholderParagraph

export default Placeholder
