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

export interface LabelDetailProps extends StrictLabelDetailProps {
  [key: string]: any
}

export interface StrictLabelDetailProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

const LabelDetail = React.forwardRef<HTMLDivElement, LabelDetailProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('detail', className)
  const rest = getUnhandledProps(LabelDetail, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<LabelDetailProps, HTMLDivElement>

LabelDetail.displayName = 'LabelDetail'
LabelDetail.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

LabelDetail.create = createShorthandFactory(LabelDetail, (val) => ({ content: val }))

export default LabelDetail
