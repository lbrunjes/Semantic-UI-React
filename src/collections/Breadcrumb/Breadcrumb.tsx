import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getUnhandledProps,
  getComponentType,
  SUI,
} from '../../lib'
import BreadcrumbDivider from './BreadcrumbDivider'
import BreadcrumbSection from './BreadcrumbSection'
import { each, without } from '../../lib/utils'
import type {
  ForwardRefComponent,
  SemanticShorthandCollection,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { IconProps } from '../../elements/Icon'
import type { BreadcrumbSectionProps } from './BreadcrumbSection'

export interface BreadcrumbProps extends StrictBreadcrumbProps {
  [key: string]: any
}

export interface StrictBreadcrumbProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content of the Breadcrumb.Divider. */
  divider?: SemanticShorthandContent

  /** For use with the sections prop. Render as an `Icon` component with `divider` class instead of a `div` in
   *  Breadcrumb.Divider.
   */
  icon?: SemanticShorthandItem<IconProps>

  /** Shorthand array of props for Breadcrumb.Section. */
  sections?: SemanticShorthandCollection<BreadcrumbSectionProps>

  /** Size of Breadcrumb */
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive'
}

/**
 * A breadcrumb is used to show hierarchy between content.
 */
const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(function (props, ref) {
  const { children, className, divider, icon, sections, size } = props

  const classes = cx('ui', size, 'breadcrumb', className)
  const rest = getUnhandledProps(Breadcrumb, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  const childElements = []

  each(sections, (section, index) => {
    // section
    const breadcrumbElement = BreadcrumbSection.create(section)
    childElements.push(breadcrumbElement)

    // divider
    if (index !== sections.length - 1) {
      const key =
        breadcrumbElement.key == null ? JSON.stringify(section) : `${breadcrumbElement.key}_divider`
      childElements.push(BreadcrumbDivider.create({ content: divider, icon, key }))
    }
  })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childElements}
    </ElementType>
  )
}) as ForwardRefComponent<BreadcrumbProps, HTMLDivElement> & {
  Divider: typeof BreadcrumbDivider
  Section: typeof BreadcrumbSection
}

Breadcrumb.displayName = 'Breadcrumb'
Breadcrumb.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content of the Breadcrumb.Divider. */
  divider: customPropTypes.every([
    customPropTypes.disallow(['icon']),
    customPropTypes.contentShorthand,
  ]),

  /** For use with the sections prop. Render as an `Icon` component with `divider` class instead of a `div` in
   *  Breadcrumb.Divider. */
  icon: customPropTypes.every([
    customPropTypes.disallow(['divider']),
    customPropTypes.itemShorthand,
  ]),

  /** Shorthand array of props for Breadcrumb.Section. */
  sections: customPropTypes.collectionShorthand,

  /** Size of Breadcrumb. */
  size: PropTypes.oneOf(without(SUI.SIZES, 'medium')),
}

Breadcrumb.Divider = BreadcrumbDivider
Breadcrumb.Section = BreadcrumbSection

export default Breadcrumb
