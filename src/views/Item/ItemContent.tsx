import * as React from 'react'

import {
  childrenUtils,
  cx,
  getComponentType,
  getUnhandledProps,
  getVerticalAlignProp,
} from '../../lib'
import ItemHeader from './ItemHeader'
import ItemDescription from './ItemDescription'
import ItemExtra from './ItemExtra'
import ItemMeta from './ItemMeta'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
  SemanticVERTICALALIGNMENTS,
} from '../../generic'
import type { ItemDescriptionProps } from './ItemDescription'
import type { ItemExtraProps } from './ItemExtra'
import type { ItemHeaderProps } from './ItemHeader'
import type { ItemMetaProps } from './ItemMeta'

export interface ItemContentProps extends StrictItemContentProps {
  [key: string]: any
}

export interface StrictItemContentProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for ItemDescription component. */
  description?: SemanticShorthandItem<ItemDescriptionProps>

  /** Shorthand for ItemExtra component. */
  extra?: SemanticShorthandItem<ItemExtraProps>

  /** Shorthand for ItemHeader component. */
  header?: SemanticShorthandItem<ItemHeaderProps>

  /** Shorthand for ItemMeta component. */
  meta?: SemanticShorthandItem<ItemMetaProps>

  /** Content can specify its vertical alignment. */
  verticalAlign?: SemanticVERTICALALIGNMENTS
}

/**
 * An item can contain content.
 */
const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(function (props, ref) {
  const { children, className, content, description, extra, header, meta, verticalAlign } = props

  const classes = cx(getVerticalAlignProp(verticalAlign), 'content', className)
  const rest = getUnhandledProps(ItemContent, props)
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
      {ItemHeader.create(header, { autoGenerateKey: false })}
      {ItemMeta.create(meta, { autoGenerateKey: false })}
      {ItemDescription.create(description, { autoGenerateKey: false })}
      {ItemExtra.create(extra, { autoGenerateKey: false })}
      {content}
    </ElementType>
  )
}) as ForwardRefComponent<ItemContentProps, HTMLDivElement>

ItemContent.displayName = 'ItemContent'
ItemContent.handledProps = [
  'as',
  'children',
  'className',
  'content',
  'description',
  'extra',
  'header',
  'meta',
  'verticalAlign',
]

export default ItemContent
