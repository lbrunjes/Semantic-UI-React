import * as React from 'react'

import {
  childrenUtils,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  getKeyOrValueAndKey,
} from '../../lib'
import type { ForwardRefComponent, SemanticFLOATS, SemanticShorthandContent } from '../../generic'

export interface RailProps extends StrictRailProps {
  [key: string]: any
}

export interface StrictRailProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A rail can appear attached to the main viewport. */
  attached?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** A rail can appear closer to the main viewport. */
  close?: boolean | 'very'

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A rail can create a division between itself and a container. */
  dividing?: boolean

  /** A rail can attach itself to the inside of a container. */
  internal?: boolean

  /** A rail can be presented on the left or right side of a container. */
  position: SemanticFLOATS

  /** A rail can have different sizes. */
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive'
}

/**
 * A rail is used to show accompanying content outside the boundaries of the main view of a site.
 */
const Rail = React.forwardRef<HTMLDivElement, RailProps>(function (props, ref) {
  const { attached, children, className, close, content, dividing, internal, position, size } =
    props

  const classes = cx(
    'ui',
    position,
    size,
    getKeyOnly(attached, 'attached'),
    getKeyOnly(dividing, 'dividing'),
    getKeyOnly(internal, 'internal'),
    getKeyOrValueAndKey(close, 'close'),
    'rail',
    className,
  )
  const rest = getUnhandledProps(Rail, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<RailProps, HTMLDivElement>

Rail.displayName = 'Rail'
Rail.handledProps = [
  'as',
  'attached',
  'children',
  'className',
  'close',
  'content',
  'dividing',
  'internal',
  'position',
  'size',
]

export default Rail
