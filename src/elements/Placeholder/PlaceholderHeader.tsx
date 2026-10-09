import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface PlaceholderHeaderProps extends StrictPlaceholderHeaderProps {
  [key: string]: any
}

export interface StrictPlaceholderHeaderProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A placeholder can contain an image. */
  image?: boolean
}

/**
 * A placeholder can contain a header.
 */
const PlaceholderHeader = React.forwardRef<HTMLDivElement, PlaceholderHeaderProps>(
  function (props, ref) {
    const { children, className, content, image } = props
    const classes = cx(getKeyOnly(image, 'image'), 'header', className)
    const rest = getUnhandledProps(PlaceholderHeader, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<PlaceholderHeaderProps, HTMLDivElement>

PlaceholderHeader.displayName = 'PlaceholderHeader'
PlaceholderHeader.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** A placeholder can contain an image. */
  image: PropTypes.bool,
}

export default PlaceholderHeader
