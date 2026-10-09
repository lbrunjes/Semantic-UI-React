import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface StepTitleProps extends StrictStepTitleProps {
  [key: string]: any
}

export interface StrictStepTitleProps {
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
 * A step can contain a title.
 */
const StepTitle = React.forwardRef<HTMLDivElement, StepTitleProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('title', className)
  const rest = getUnhandledProps(StepTitle, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<StepTitleProps, HTMLDivElement>

StepTitle.displayName = 'StepTitle'
StepTitle.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

StepTitle.create = createShorthandFactory(StepTitle, (content) => ({ content }))

export default StepTitle
