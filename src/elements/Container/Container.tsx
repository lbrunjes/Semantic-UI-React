import * as React from 'react'

import {
  childrenUtils,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  getTextAlignProp,
} from '../../lib'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticTEXTALIGNMENTS,
} from '../../generic'

export interface ContainerProps extends StrictContainerProps {
  [key: string]: any
}

export interface StrictContainerProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Container has no maximum width. */
  fluid?: boolean

  /** Reduce maximum width to more naturally accommodate text. */
  text?: boolean

  /** Describes how the text inside this component should be aligned. */
  textAlign?: SemanticTEXTALIGNMENTS
}

/**
 * A container limits content to a maximum width.
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(function (props, ref) {
  const { children, className, content, fluid, text, textAlign } = props
  const classes = cx(
    'ui',
    getKeyOnly(text, 'text'),
    getKeyOnly(fluid, 'fluid'),
    getTextAlignProp(textAlign),
    'container',
    className,
  )
  const rest = getUnhandledProps(Container, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ContainerProps, HTMLDivElement>

Container.displayName = 'Container'
Container.handledProps = ['as', 'children', 'className', 'content', 'fluid', 'text', 'textAlign']

export default Container
