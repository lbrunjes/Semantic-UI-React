import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createHTMLImage,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
} from '../../lib'
import { map } from '../../lib/utils'
import type {
  HtmlImageProps,
  SemanticShorthandContent,
  SemanticShorthandCollection,
  ForwardRefComponent,
} from '../../generic'

export interface FeedExtraProps extends StrictFeedExtraProps {
  [key: string]: any
}

export interface StrictFeedExtraProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** An event can contain additional information like a set of images. */
  images?: boolean | SemanticShorthandCollection<HtmlImageProps>[]

  /** An event can contain additional text information. */
  text?: boolean
}

/**
 * A feed can contain an extra content.
 */
const FeedExtra = React.forwardRef<HTMLDivElement, FeedExtraProps>(function (props, ref) {
  const { children, className, content, images, text } = props

  const classes = cx(
    getKeyOnly(images, 'images'),
    getKeyOnly(content || text, 'text'),
    'extra',
    className,
  )
  const rest = getUnhandledProps(FeedExtra, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  // TODO need a "collection factory" to handle creating multiple image elements and their keys
  const imageElements = map(images, (image, index) => {
    const key = [index, image].join('-')
    return createHTMLImage(image, { key })
  })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {content}
      {imageElements}
    </ElementType>
  )
}) as ForwardRefComponent<FeedExtraProps, HTMLDivElement>

FeedExtra.displayName = 'FeedExtra'
FeedExtra.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** An event can contain additional information like a set of images. */
  images: customPropTypes.every([
    customPropTypes.disallow(['text']),
    PropTypes.oneOfType([PropTypes.bool, customPropTypes.collectionShorthand]),
  ]),

  /** An event can contain additional text information. */
  text: PropTypes.bool,
}

export default FeedExtra
