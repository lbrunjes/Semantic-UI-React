import PropTypes from 'prop-types'
import * as React from 'react'

import { customPropTypes, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
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
PlaceholderImage.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Additional classes. */
  className: PropTypes.string,

  /** An image can modify size correctly with responsive styles. */
  square: customPropTypes.every([customPropTypes.disallow(['rectangular']), PropTypes.bool]),

  /** An image can modify size correctly with responsive styles. */
  rectangular: customPropTypes.every([customPropTypes.disallow(['square']), PropTypes.bool]),
}

export default PlaceholderImage
