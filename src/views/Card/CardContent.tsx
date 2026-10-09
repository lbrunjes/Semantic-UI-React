import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthand,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getKeyOnly,
  getTextAlignProp,
} from '../../lib'
import CardDescription from './CardDescription'
import CardHeader from './CardHeader'
import CardMeta from './CardMeta'
import { without } from '../../lib/utils'
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
CardContent.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Shorthand for CardDescription. */
  description: customPropTypes.itemShorthand,

  /** A card can contain extra content meant to be formatted separately from the main content. */
  extra: PropTypes.bool,

  /** Shorthand for CardHeader. */
  header: customPropTypes.itemShorthand,

  /** Shorthand for CardMeta. */
  meta: customPropTypes.itemShorthand,

  /** A card content can adjust its text alignment. */
  textAlign: PropTypes.oneOf(without(SUI.TEXT_ALIGNMENTS, 'justified')),
}

export default CardContent
