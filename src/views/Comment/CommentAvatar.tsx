import PropTypes from 'prop-types'
import * as React from 'react'

import {
  createHTMLImage,
  cx,
  getComponentType,
  getUnhandledProps,
  htmlImageProps,
  partitionHTMLProps,
} from '../../lib'
import type { ForwardRefComponent } from '../../generic'

export interface CommentAvatarProps extends StrictCommentAvatarProps {
  [key: string]: any
}

export interface StrictCommentAvatarProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Additional classes. */
  className?: string

  /** Specifies the URL of the image. */
  src?: string
}

/**
 * A comment can contain an image or avatar.
 */
const CommentAvatar = React.forwardRef<HTMLDivElement, CommentAvatarProps>(function (props, ref) {
  const { className, src } = props

  const classes = cx('avatar', className)
  const rest = getUnhandledProps(CommentAvatar, props)
  const [imageProps, rootProps] = partitionHTMLProps(rest, { htmlProps: htmlImageProps })
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rootProps} className={classes} ref={ref}>
      {createHTMLImage(src, { autoGenerateKey: false, defaultProps: imageProps })}
    </ElementType>
  )
}) as ForwardRefComponent<CommentAvatarProps, HTMLDivElement>

CommentAvatar.displayName = 'CommentAvatar'
CommentAvatar.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Additional classes. */
  className: PropTypes.string,

  /** Specifies the URL of the image. */
  src: PropTypes.string,
}

export default CommentAvatar
