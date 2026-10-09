import * as React from 'react'

import { createShorthandFactory, getUnhandledProps } from '../../lib'
import Image from '../../elements/Image'
import type { ImageProps, StrictImageProps } from '../../elements/Image'
import type { ForwardRefComponent, SemanticSIZES } from '../../generic'

export interface ItemImageProps extends ImageProps {
  [key: string]: any

  /** An image may appear at different sizes. */
  size?: SemanticSIZES
}

export interface StrictItemImageProps extends StrictImageProps {
  /** An image may appear at different sizes. */
  size?: SemanticSIZES
}

/**
 * An item can contain an image.
 */
const ItemImage = React.forwardRef<HTMLImageElement, ItemImageProps>(function (props, ref) {
  const { size } = props
  const rest = getUnhandledProps(ItemImage, props)

  return <Image {...rest} size={size} ui={!!size} wrapped ref={ref} />
}) as ForwardRefComponent<ItemImageProps, HTMLImageElement>

ItemImage.displayName = 'ItemImage'
ItemImage.propTypes = {
  /** An image may appear at different sizes. */
  size: Image.propTypes.size,
}

ItemImage.create = createShorthandFactory(ItemImage, (src) => ({ src }))

export default ItemImage
