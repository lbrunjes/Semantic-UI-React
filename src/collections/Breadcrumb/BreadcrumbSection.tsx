import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getUnhandledProps,
  getComponentType,
  getKeyOnly,
  useEventCallback,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface BreadcrumbSectionProps extends StrictBreadcrumbSectionProps {
  [key: string]: any
}

export interface StrictBreadcrumbSectionProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Style as the currently active section. */
  active?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Render as an `a` tag instead of a `div` and adds the href attribute. */
  href?: string

  /** Render as an `a` tag instead of a `div`. */
  link?: boolean

  /**
   * Called on click. When passed, the component will render as an `a`
   * tag by default instead of a `div`.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: BreadcrumbSectionProps) => void
}

/**
 * A section sub-component for Breadcrumb component.
 */
const BreadcrumbSection = React.forwardRef<HTMLDivElement, BreadcrumbSectionProps>(
  function (props, ref) {
    const { active, children, className, content, href, link, onClick } = props

    const classes = cx(getKeyOnly(active, 'active'), 'section', className)
    const rest = getUnhandledProps(BreadcrumbSection, props)
    const ElementType = getComponentType(props, {
      getDefault: () => {
        if (link || onClick) return 'a'
      },
    })

    const handleClick = useEventCallback((e: React.MouseEvent<HTMLAnchorElement>) =>
      props?.onClick?.(e, props),
    )

    return (
      <ElementType {...rest} className={classes} href={href} onClick={handleClick} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<BreadcrumbSectionProps, HTMLDivElement>

BreadcrumbSection.displayName = 'BreadcrumbSection'
BreadcrumbSection.handledProps = [
  'active',
  'as',
  'children',
  'className',
  'content',
  'href',
  'link',
  'onClick',
]

BreadcrumbSection.create = createShorthandFactory(BreadcrumbSection, (content) => ({
  content,
  link: true,
}))

export default BreadcrumbSection
