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

export interface CardDescriptionProps extends StrictCardDescriptionProps {
  [key: string]: any
}

export interface StrictCardDescriptionProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A card description can adjust its text alignment. */
  textAlign?: 'center' | 'left' | 'right'
}

/**
 * A card can contain a description with one or more paragraphs.
 */
const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  function (props, ref) {
    const { children, className, content, textAlign } = props
    const classes = cx(getTextAlignProp(textAlign), 'description', className)
    const rest = getUnhandledProps(CardDescription, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<CardDescriptionProps, HTMLDivElement>

CardDescription.displayName = 'CardDescription'
CardDescription.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** A card content can adjust its text alignment. */
  textAlign: PropTypes.oneOf(without(SUI.TEXT_ALIGNMENTS, 'justified')),
}

export default CardDescription
