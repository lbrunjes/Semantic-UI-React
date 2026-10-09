import React, { isValidElement } from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  useEventCallback,
} from '../../lib'
import Image from '../Image'
import ListContent from './ListContent'
import ListDescription from './ListDescription'
import ListHeader from './ListHeader'
import ListIcon from './ListIcon'
import { isPlainObject } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { ImageProps } from '../Image'
import type { ListContentProps } from './ListContent'
import type { ListDescriptionProps } from './ListDescription'
import type { ListHeaderProps } from './ListHeader'
import type { ListIconProps } from './ListIcon'

export interface ListItemProps extends StrictListItemProps {
  [key: string]: any
}

export interface StrictListItemProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A list item can active. */
  active?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandItem<ListContentProps>

  /** Shorthand for ListDescription. */
  description?: SemanticShorthandItem<ListDescriptionProps>

  /** A list item can disabled. */
  disabled?: boolean

  /** Shorthand for ListHeader. */
  header?: SemanticShorthandItem<ListHeaderProps>

  /** Shorthand for ListIcon. */
  icon?: SemanticShorthandItem<ListIconProps>

  /** Shorthand for Image. */
  image?: SemanticShorthandItem<ImageProps>

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => void

  /** A value for an ordered list. */
  value?: string
}

/**
 * A list item can contain a set of items.
 */
const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(function (props, ref) {
  const {
    active,
    children,
    className,
    content,
    description,
    disabled,
    header,
    icon,
    image,
    value,
  } = props

  const ElementType = getComponentType(props)
  const classes = cx(
    getKeyOnly(active, 'active'),
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(ElementType !== 'li', 'item'),
    className,
  )
  const rest = getUnhandledProps(ListItem, props)

  const handleClick = useEventCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!disabled) {
      props?.onClick?.(e, props)
    }
  })
  const valueProp = ElementType === 'li' ? { value } : { 'data-value': value }

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType
        {...valueProp}
        role='listitem'
        {...rest}
        className={classes}
        onClick={handleClick}
        ref={ref}
      >
        {children}
      </ElementType>
    )
  }

  const iconElement = ListIcon.create(icon, { autoGenerateKey: false })
  const imageElement = Image.create(image, { autoGenerateKey: false })

  // See description of `content` prop for explanation about why this is necessary.
  if (!isValidElement(content) && isPlainObject(content)) {
    return (
      <ElementType
        {...valueProp}
        role='listitem'
        {...rest}
        className={classes}
        onClick={handleClick}
        ref={ref}
      >
        {iconElement || imageElement}
        {ListContent.create(content, {
          autoGenerateKey: false,
          defaultProps: { header, description },
        })}
      </ElementType>
    )
  }

  const headerElement = ListHeader.create(header, { autoGenerateKey: false })
  const descriptionElement = ListDescription.create(description, { autoGenerateKey: false })

  if (iconElement || imageElement) {
    return (
      <ElementType
        {...valueProp}
        role='listitem'
        {...rest}
        className={classes}
        onClick={handleClick}
        ref={ref}
      >
        {iconElement || imageElement}
        {(content || headerElement || descriptionElement) && (
          <ListContent>
            {headerElement}
            {descriptionElement}
            {content}
          </ListContent>
        )}
      </ElementType>
    )
  }

  return (
    <ElementType
      {...valueProp}
      role='listitem'
      {...rest}
      className={classes}
      onClick={handleClick}
      ref={ref}
    >
      {headerElement}
      {descriptionElement}
      {content}
    </ElementType>
  )
}) as ForwardRefComponent<ListItemProps, HTMLDivElement>

ListItem.displayName = 'ListItem'
ListItem.handledProps = [
  'active',
  'as',
  'children',
  'className',
  'content',
  'description',
  'disabled',
  'header',
  'icon',
  'image',
  'onClick',
  'value',
]
ListItem.create = createShorthandFactory(ListItem, (content) => ({ content }))

export default ListItem
