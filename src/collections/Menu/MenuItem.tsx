import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  getKeyOrValueAndKey,
  useEventCallback,
} from '../../lib'
import Icon from '../../elements/Icon'
import { startCase } from '../../lib/utils'
import type {
  ForwardRefComponent,
  SemanticCOLORS,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { IconProps } from '../../elements/Icon'

export interface MenuItemProps extends StrictMenuItemProps {
  [key: string]: any
}

export interface StrictMenuItemProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A menu item can be active. */
  active?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Additional colors can be specified. */
  color?: SemanticCOLORS

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A menu item can be disabled. */
  disabled?: boolean

  /** A menu item or menu can remove element padding, vertically or horizontally. */
  fitted?: boolean | 'horizontally' | 'vertically'

  /** A menu item may include a header or may itself be a header. */
  header?: boolean

  /** MenuItem can be only icon. */
  icon?: boolean | SemanticShorthandItem<IconProps>

  /** MenuItem index inside Menu. */
  index?: number

  /** A menu item can be link. */
  link?: boolean

  /** Internal name of the MenuItem. */
  name?: string

  /**
   * Called on click. When passed, the component will render as an `a`
   * tag by default instead of a `div`.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => void

  /** A menu item can take left or right position. */
  position?: 'left' | 'right'
}

/**
 * A menu can contain an item.
 */
const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(function (props, ref) {
  const {
    active,
    children,
    className,
    color,
    content,
    disabled,
    fitted,
    header,
    icon,
    link,
    name,
    onClick,
    position,
  } = props

  const classes = cx(
    color,
    position,
    getKeyOnly(active, 'active'),
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(icon === true || (icon && !(name || content)), 'icon'),
    getKeyOnly(header, 'header'),
    getKeyOnly(link, 'link'),
    getKeyOrValueAndKey(fitted, 'fitted'),
    'item',
    className,
  )
  const ElementType = getComponentType(props, {
    getDefault: () => {
      if (onClick) return 'a'
    },
  })
  const rest = getUnhandledProps(MenuItem, props)

  const handleClick = useEventCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!disabled) {
      props?.onClick?.(e, props)
    }
  })

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} onClick={handleClick} ref={ref}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} onClick={handleClick} ref={ref}>
      {Icon.create(icon, { autoGenerateKey: false })}
      {childrenUtils.isNil(content) ? startCase(name) : content}
    </ElementType>
  )
}) as ForwardRefComponent<MenuItemProps, HTMLDivElement>

MenuItem.displayName = 'MenuItem'
MenuItem.handledProps = [
  'active',
  'as',
  'children',
  'className',
  'color',
  'content',
  'disabled',
  'fitted',
  'header',
  'icon',
  'index',
  'link',
  'name',
  'onClick',
  'position',
]

MenuItem.create = createShorthandFactory(MenuItem, (val) => ({ content: val, name: val }))

export default MenuItem
