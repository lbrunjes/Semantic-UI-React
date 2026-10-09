import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getUnhandledProps,
  getComponentType,
} from '../../lib'
import Icon from '../../elements/Icon'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { IconProps } from '../../elements/Icon'

export interface BreadcrumbDividerProps extends StrictBreadcrumbDividerProps {
  [key: string]: any
}

export interface StrictBreadcrumbDividerProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Render as an `Icon` component with `divider` class instead of a `div`. */
  icon?: SemanticShorthandItem<IconProps>
}

/**
 * A divider sub-component for Breadcrumb component.
 */
const BreadcrumbDivider = React.forwardRef<HTMLDivElement, BreadcrumbDividerProps>(
  function (props, ref) {
    const { children, className, content, icon } = props

    const classes = cx('divider', className)
    const rest = getUnhandledProps(BreadcrumbDivider, props)
    const ElementType = getComponentType(props)

    if (icon != null) {
      return Icon.create(icon, {
        defaultProps: { ...rest, className: classes },
        autoGenerateKey: false,
        ref,
      })
    }

    if (content != null) {
      return (
        <ElementType {...rest} className={classes} ref={ref}>
          {content}
        </ElementType>
      )
    }

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? '/' : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<BreadcrumbDividerProps, HTMLDivElement>

BreadcrumbDivider.displayName = 'BreadcrumbDivider'
BreadcrumbDivider.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Render as an `Icon` component with `divider` class instead of a `div`. */
  icon: customPropTypes.itemShorthand,
}

BreadcrumbDivider.create = createShorthandFactory(BreadcrumbDivider, (icon) => ({ icon }))

export default BreadcrumbDivider
