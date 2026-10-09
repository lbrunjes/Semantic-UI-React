import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import ItemContent from './ItemContent'
import ItemDescription from './ItemDescription'
import ItemExtra from './ItemExtra'
import ItemGroup from './ItemGroup'
import ItemHeader from './ItemHeader'
import ItemImage from './ItemImage'
import ItemMeta from './ItemMeta'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { ItemDescriptionProps } from './ItemDescription'
import type { ItemExtraProps } from './ItemExtra'
import type { ItemHeaderProps } from './ItemHeader'
import type { ItemImageProps } from './ItemImage'
import type { ItemMetaProps } from './ItemMeta'

export interface ItemProps extends StrictItemProps {
  [key: string]: any
}

export interface StrictItemProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for ItemContent component. */
  content?: SemanticShorthandContent

  /** Shorthand for ItemDescription component. */
  description?: SemanticShorthandItem<ItemDescriptionProps>

  /** Shorthand for ItemExtra component. */
  extra?: SemanticShorthandItem<ItemExtraProps>

  /** Shorthand for ItemHeader component. */
  header?: SemanticShorthandItem<ItemHeaderProps>

  /** Shorthand for ItemImage component. */
  image?: SemanticShorthandItem<ItemImageProps>

  /** Shorthand for ItemMeta component. */
  meta?: SemanticShorthandItem<ItemMetaProps>
}

/**
 * An item view presents large collections of site content for display.
 */
const Item = React.forwardRef<HTMLDivElement, ItemProps>(function (props, ref) {
  const { children, className, content, description, extra, header, image, meta } = props

  const classes = cx('item', className)
  const rest = getUnhandledProps(Item, props)
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
      {ItemImage.create(image, { autoGenerateKey: false })}

      <ItemContent
        content={content}
        description={description}
        extra={extra}
        header={header}
        meta={meta}
      />
    </ElementType>
  )
}) as ForwardRefComponent<ItemProps, HTMLDivElement> & {
  Content: typeof ItemContent
  Description: typeof ItemDescription
  Extra: typeof ItemExtra
  Group: typeof ItemGroup
  Header: typeof ItemHeader
  Image: typeof ItemImage
  Meta: typeof ItemMeta
}

Item.Content = ItemContent
Item.Description = ItemDescription
Item.Extra = ItemExtra
Item.Group = ItemGroup
Item.Header = ItemHeader
Item.Image = ItemImage
Item.Meta = ItemMeta

Item.displayName = 'Item'
Item.handledProps = [
  'as',
  'children',
  'className',
  'content',
  'description',
  'extra',
  'header',
  'image',
  'meta',
]

export default Item
