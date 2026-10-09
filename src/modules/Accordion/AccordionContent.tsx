import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface AccordionContentProps extends StrictAccordionContentProps {
  [key: string]: any
}

export interface StrictAccordionContentProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Whether or not the content is visible. */
  active?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

/**
 * A content sub-component for Accordion component.
 */
const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function (props, ref) {
    const { active, children, className, content } = props

    const classes = cx('content', getKeyOnly(active, 'active'), className)
    const rest = getUnhandledProps(AccordionContent, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<AccordionContentProps, HTMLDivElement>

AccordionContent.displayName = 'AccordionContent'
AccordionContent.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Whether or not the content is visible. */
  active: PropTypes.bool,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

AccordionContent.create = createShorthandFactory(AccordionContent, (content) => ({ content }))

export default AccordionContent
