import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface MenuMenuProps extends StrictMenuMenuProps {
  [key: string]: any
}

export interface StrictMenuMenuProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A sub menu can take left or right position. */
  position?: 'left' | 'right'
}

/**
 * A menu can contain a sub menu.
 */
const MenuMenu = React.forwardRef<HTMLDivElement, MenuMenuProps>(function (props, ref) {
  const { children, className, content, position } = props

  const classes = cx(position, 'menu', className)
  const rest = getUnhandledProps(MenuMenu, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<MenuMenuProps, HTMLDivElement>

MenuMenu.displayName = 'MenuMenu'
MenuMenu.handledProps = ['as', 'children', 'className', 'content', 'position']

export default MenuMenu
