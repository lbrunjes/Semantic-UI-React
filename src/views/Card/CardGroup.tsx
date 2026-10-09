import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getKeyOnly,
  getTextAlignProp,
  getWidthProp,
} from '../../lib'
import Card from './Card'
import { map, without } from '../../lib/utils'
import type {
  ForwardRefComponent,
  SemanticShorthandCollection,
  SemanticShorthandContent,
  SemanticWIDTHS,
} from '../../generic'
import type { CardProps } from './Card'

export interface CardGroupProps extends StrictCardGroupProps {
  [key: string]: any
}

export interface StrictCardGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A group of cards can center itself inside its container. */
  centered?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A group of cards can double its column width for mobile. */
  doubling?: boolean

  /** Shorthand array of props for Card. */
  items?: SemanticShorthandCollection<CardProps>

  /** A group of cards can set how many cards should exist in a row. */
  itemsPerRow?: SemanticWIDTHS

  /** A group of cards can automatically stack rows to a single columns on mobile devices. */
  stackable?: boolean

  /** A card group can adjust its text alignment. */
  textAlign?: 'center' | 'left' | 'right'
}

/**
 * A group of cards.
 */
const CardGroup = React.forwardRef<HTMLDivElement, CardGroupProps>(function (props, ref) {
  const {
    centered,
    children,
    className,
    content,
    doubling,
    items,
    itemsPerRow,
    stackable,
    textAlign,
  } = props

  const classes = cx(
    'ui',
    getKeyOnly(centered, 'centered'),
    getKeyOnly(doubling, 'doubling'),
    getKeyOnly(stackable, 'stackable'),
    getTextAlignProp(textAlign),
    getWidthProp(itemsPerRow),
    'cards',
    className,
  )
  const rest = getUnhandledProps(CardGroup, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }
  if (!childrenUtils.isNil(content)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {content}
      </ElementType>
    )
  }

  const itemsJSX = map(items, (item) => {
    const key = item.key ?? [item.header, item.description].join('-')
    return <Card key={key} {...item} />
  })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {itemsJSX}
    </ElementType>
  )
}) as ForwardRefComponent<CardGroupProps, HTMLDivElement>

CardGroup.displayName = 'CardGroup'
CardGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A group of cards can center itself inside its container. */
  centered: PropTypes.bool,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** A group of cards can double its column width for mobile. */
  doubling: PropTypes.bool,

  /** Shorthand array of props for Card. */
  items: customPropTypes.collectionShorthand,

  /** A group of cards can set how many cards should exist in a row. */
  itemsPerRow: PropTypes.oneOf(SUI.WIDTHS),

  /** A group of cards can automatically stack rows to a single columns on mobile devices. */
  stackable: PropTypes.bool,

  /** A card group can adjust its text alignment. */
  textAlign: PropTypes.oneOf(without(SUI.TEXT_ALIGNMENTS, 'justified')),
}

export default CardGroup
