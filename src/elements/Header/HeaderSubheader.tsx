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

export interface HeaderSubheaderProps extends StrictHeaderSubheaderProps {
  [key: string]: any
}

export interface StrictHeaderSubheaderProps {
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
 * Headers may contain subheaders.
 */
const HeaderSubheader = React.forwardRef<HTMLDivElement, HeaderSubheaderProps>(
  function (props, ref) {
    const { children, className, content } = props

    const classes = cx('sub header', className)
    const rest = getUnhandledProps(HeaderSubheader, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<HeaderSubheaderProps, HTMLDivElement>

HeaderSubheader.displayName = 'HeaderSubheader'
HeaderSubheader.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

HeaderSubheader.create = createShorthandFactory(HeaderSubheader, (content) => ({ content }))

export default HeaderSubheader
