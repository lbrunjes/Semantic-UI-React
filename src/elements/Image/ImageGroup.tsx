import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { SemanticSIZES, SemanticShorthandContent, ForwardRefComponent } from '../../generic'

export interface ImageGroupProps extends StrictImageGroupProps {
  [key: string]: any
}

export interface StrictImageGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A group of images can be formatted to have the same size. */
  size?: SemanticSIZES
}

/**
 * A group of images.
 */
const ImageGroup = React.forwardRef<HTMLDivElement, ImageGroupProps>(function (props, ref) {
  const { children, className, content, size } = props

  const classes = cx('ui', size, className, 'images')
  const rest = getUnhandledProps(ImageGroup, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ImageGroupProps, HTMLDivElement>

ImageGroup.displayName = 'ImageGroup'
ImageGroup.handledProps = ['as', 'children', 'className', 'content', 'size']

export default ImageGroup
