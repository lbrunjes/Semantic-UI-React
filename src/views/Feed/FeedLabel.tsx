import * as React from 'react'

import { childrenUtils, createHTMLImage, cx, getComponentType, getUnhandledProps } from '../../lib'
import Icon from '../../elements/Icon'
import type {
  ForwardRefComponent,
  HtmlImageProps,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { IconProps } from '../../elements/Icon'

export interface FeedLabelProps extends StrictFeedLabelProps {
  [key: string]: any
}

export interface StrictFeedLabelProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** An event can contain icon label. */
  icon?: SemanticShorthandItem<IconProps>

  /** An event can contain image label. */
  image?: SemanticShorthandItem<HtmlImageProps>
}

/**
 * An event can contain an image or icon label.
 */
const FeedLabel = React.forwardRef<HTMLDivElement, FeedLabelProps>(function (props, ref) {
  const { children, className, content, icon, image } = props

  const classes = cx('label', className)
  const rest = getUnhandledProps(FeedLabel, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {content}
      {Icon.create(icon, { autoGenerateKey: false })}
      {createHTMLImage(image)}
    </ElementType>
  )
}) as ForwardRefComponent<FeedLabelProps, HTMLDivElement>

FeedLabel.displayName = 'FeedLabel'
FeedLabel.handledProps = ['as', 'children', 'className', 'content', 'icon', 'image']

export default FeedLabel
