import PropTypes from 'prop-types'
import * as React from 'react'

import { childrenUtils, customPropTypes, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ModalDescriptionProps extends StrictModalDescriptionProps {
  [key: string]: any
}

export interface StrictModalDescriptionProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

/**
 * A modal can contain a description with one or more paragraphs.
 */
const ModalDescription = React.forwardRef<HTMLDivElement, ModalDescriptionProps>(
  function (props, ref) {
    const { children, className, content } = props
    const classes = cx('description', className)
    const rest = getUnhandledProps(ModalDescription, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<ModalDescriptionProps, HTMLDivElement>

ModalDescription.displayName = 'ModalDescription'
ModalDescription.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

export default ModalDescription
