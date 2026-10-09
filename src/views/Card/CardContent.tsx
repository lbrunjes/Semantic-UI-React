import * as React from 'react'

import {
  childrenUtils,
  createShorthand,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  getTextAlignProp,
} from '../../lib'
import CardDescription from './CardDescription'
import CardHeader from './CardHeader'
import CardMeta from './CardMeta'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { CardDescriptionProps } from './CardDescription'
import type { CardHeaderProps } from './CardHeader'
import type { CardMetaProps } from './CardMeta'

export interface CardContentProps extends StrictCardContentProps {
  [key: string]: any
}

export interface StrictCardContentProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for CardDescription. */
  description?: SemanticShorthandItem<CardDescriptionProps>

  /** A card can contain extra content meant to be formatted separately from the main content. */
  extra?: boolean

  /** Shorthand for CardHeader. */
  header?: SemanticShorthandItem<CardHeaderProps>

  /** Shorthand for CardMeta. */
  meta?: SemanticShorthandItem<CardMetaProps>

  /** A card content can adjust its text alignment. */
  textAlign?: 'center' | 'left' | 'right'
}

/**
 * A card can contain blocks of content or extra content meant to be formatted separately from the main content.
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(function (props, ref) {
  const { children, className, content, description, extra, header, meta, textAlign } = props

  const classes = cx(getKeyOnly(extra, 'extra'), getTextAlignProp(textAlign), 'content', className)
  const rest = getUnhandledProps(CardContent, props)
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

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {createShorthand(CardHeader, (val) => ({ content: val }), header, { autoGenerateKey: false })}
      {createShorthand(CardMeta, (val) => ({ content: val }), meta, { autoGenerateKey: false })}
      {createShorthand(CardDescription, (val) => ({ content: val }), description, {
        autoGenerateKey: false,
      })}
    </ElementType>
  )
}) as ForwardRefComponent<CardContentProps, HTMLDivElement>

CardContent.displayName = 'CardContent'
CardContent.handledProps = [
  'as',
  'children',
  'className',
  'content',
  'description',
  'extra',
  'header',
  'meta',
  'textAlign',
]

export default CardContent
