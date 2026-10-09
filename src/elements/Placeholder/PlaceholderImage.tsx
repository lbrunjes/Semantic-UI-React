import * as React from 'react'

import { cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import type { ForwardRefComponent } from '../../generic'

export interface PlaceholderImageProps extends StrictPlaceholderImageProps {
  [key: string]: any
}

export interface StrictPlaceholderImageProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Additional classes. */
  className?: string

  /** An image can modify size correctly with responsive styles. */
  square?: boolean

  /** An image can modify size correctly with responsive styles. */
  rectangular?: boolean
}

/**
 * A placeholder can contain an image.
 */
const PlaceholderImage = React.forwardRef<HTMLDivElement, PlaceholderImageProps>(
  function (props, ref) {
    const { className, square, rectangular } = props
    const classes = cx(
      getKeyOnly(square, 'square'),
      getKeyOnly(rectangular, 'rectangular'),
      'image',
      className,
    )
    const rest = getUnhandledProps(PlaceholderImage, props)
    const ElementType = getComponentType(props)

    return <ElementType {...rest} className={classes} ref={ref} />
  },
) as ForwardRefComponent<PlaceholderImageProps, HTMLDivElement>

PlaceholderImage.displayName = 'PlaceholderImage'
PlaceholderImage.handledProps = ['as', 'className', 'rectangular', 'square']

export default PlaceholderImage
