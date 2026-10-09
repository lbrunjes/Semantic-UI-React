import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getTextAlignProp,
} from '../../lib'
import { without } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface CardMetaProps extends StrictCardMetaProps {
  [key: string]: any
}

export interface StrictCardMetaProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A card meta can adjust its text alignment. */
  textAlign?: 'center' | 'left' | 'right'
}

/**
 * A card can contain content metadata.
 */
const CardMeta = React.forwardRef<HTMLDivElement, CardMetaProps>(function (props, ref) {
  const { children, className, content, textAlign } = props
  const classes = cx(getTextAlignProp(textAlign), 'meta', className)
  const rest = getUnhandledProps(CardMeta, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<CardMetaProps, HTMLDivElement>

CardMeta.displayName = 'CardMeta'
CardMeta.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** A card meta can adjust its text alignment. */
  textAlign: PropTypes.oneOf(without(SUI.TEXT_ALIGNMENTS, 'justified')),
}

export default CardMeta
