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
import Icon from '../../elements/Icon'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { IconProps } from '../../elements/Icon'

export interface DropdownHeaderProps extends StrictDropdownHeaderProps {
  [key: string]: any
}

export interface StrictDropdownHeaderProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for Icon. */
  icon?: SemanticShorthandItem<IconProps>
}

/**
 * A dropdown menu can contain a header.
 */
const DropdownHeader = React.forwardRef<HTMLDivElement, DropdownHeaderProps>(function (props, ref) {
  const { children, className, content, icon } = props

  const classes = cx('header', className)
  const rest = getUnhandledProps(DropdownHeader, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {Icon.create(icon, { autoGenerateKey: false })}
      {content}
    </ElementType>
  )
}) as ForwardRefComponent<DropdownHeaderProps, HTMLDivElement>

DropdownHeader.displayName = 'DropdownHeader'
DropdownHeader.propTypes = {
  /** An element type to render as (string or function) */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Shorthand for Icon. */
  icon: customPropTypes.itemShorthand,
}

DropdownHeader.create = createShorthandFactory(DropdownHeader, (content) => ({ content }))

export default DropdownHeader
