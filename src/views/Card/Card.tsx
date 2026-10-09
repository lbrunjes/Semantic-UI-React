import * as React from 'react'

import {
  childrenUtils,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  useEventCallback,
} from '../../lib'
import Image from '../../elements/Image'
import CardContent from './CardContent'
import CardDescription from './CardDescription'
import CardGroup from './CardGroup'
import CardHeader from './CardHeader'
import CardMeta from './CardMeta'
import type {
  ForwardRefComponent,
  SemanticCOLORS,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { ImageProps } from '../../elements/Image'
import type { CardDescriptionProps } from './CardDescription'
import type { CardHeaderProps } from './CardHeader'
import type { CardMetaProps } from './CardMeta'

export interface CardProps extends StrictCardProps {
  [key: string]: any
}

export interface StrictCardProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A Card can center itself inside its container. */
  centered?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** A Card can be formatted to display different colors. */
  color?: SemanticCOLORS

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for CardDescription. */
  description?: SemanticShorthandItem<CardDescriptionProps>

  /** Shorthand for primary content of CardContent. */
  extra?: SemanticShorthandContent

  /** A Card can be formatted to take up the width of its container. */
  fluid?: boolean

  /** Shorthand for CardHeader. */
  header?: SemanticShorthandItem<CardHeaderProps>

  /** Render as an `a` tag instead of a `div` and adds the href attribute. */
  href?: string

  /** A card can contain an Image component. */
  image?: SemanticShorthandItem<ImageProps>

  /** A card can be formatted to link to other content. */
  link?: boolean

  /** Shorthand for CardMeta. */
  meta?: SemanticShorthandItem<CardMetaProps>

  /**
   * Called on click. When passed, the component renders as an `a`
   * tag by default instead of a `div`.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: CardProps) => void

  /** A Card can be formatted to raise above the page. */
  raised?: boolean
}

/**
 * A card displays site content in a manner similar to a playing card.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(function (props, ref) {
  const {
    centered,
    children,
    className,
    color,
    content,
    description,
    extra,
    fluid,
    header,
    href,
    image,
    link,
    meta,
    onClick,
    raised,
  } = props

  const classes = cx(
    'ui',
    color,
    getKeyOnly(centered, 'centered'),
    getKeyOnly(fluid, 'fluid'),
    getKeyOnly(link, 'link'),
    getKeyOnly(raised, 'raised'),
    'card',
    className,
  )
  const rest = getUnhandledProps(Card, props)
  const ElementType = getComponentType(props, {
    getDefault: () => {
      if (onClick) {
        return 'a'
      }
    },
  })

  const handleClick = useEventCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    props?.onClick?.(e, props)
  })

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} href={href} onClick={handleClick} ref={ref}>
        {children}
      </ElementType>
    )
  }
  if (!childrenUtils.isNil(content)) {
    return (
      <ElementType {...rest} className={classes} href={href} onClick={handleClick} ref={ref}>
        {content}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} href={href} onClick={handleClick} ref={ref}>
      {Image.create(image, {
        autoGenerateKey: false,
        defaultProps: {
          ui: false,
          wrapped: true,
        },
      })}
      {(description || header || meta) && (
        <CardContent description={description} header={header} meta={meta} />
      )}
      {extra && <CardContent extra>{extra}</CardContent>}
    </ElementType>
  )
}) as ForwardRefComponent<CardProps, HTMLDivElement> & {
  Content: typeof CardContent
  Description: typeof CardDescription
  Group: typeof CardGroup
  Header: typeof CardHeader
  Meta: typeof CardMeta
}

Card.displayName = 'Card'
Card.handledProps = [
  'as',
  'centered',
  'children',
  'className',
  'color',
  'content',
  'description',
  'extra',
  'fluid',
  'header',
  'href',
  'image',
  'link',
  'meta',
  'onClick',
  'raised',
]

Card.Content = CardContent
Card.Description = CardDescription
Card.Group = CardGroup
Card.Header = CardHeader
Card.Meta = CardMeta

export default Card
