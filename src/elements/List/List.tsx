import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getKeyOnly,
  getKeyOrValueAndKey,
  getValueAndKey,
  getVerticalAlignProp,
} from '../../lib'
import ListContent from './ListContent'
import ListDescription from './ListDescription'
import ListHeader from './ListHeader'
import ListIcon from './ListIcon'
import ListItem from './ListItem'
import ListList from './ListList'
import { map } from '../../lib/utils'
import type {
  ForwardRefComponent,
  SemanticFLOATS,
  SemanticShorthandCollection,
  SemanticShorthandContent,
  SemanticSIZES,
  SemanticVERTICALALIGNMENTS,
} from '../../generic'
import type { ListItemProps } from './ListItem'

export interface ListProps extends StrictListProps {
  [key: string]: any
}

export interface StrictListProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A list can animate to set the current item apart from the list. */
  animated?: boolean

  /** A list can mark items with a bullet. */
  bulleted?: boolean

  /** A list can divide its items into cells. */
  celled?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A list can show divisions between content. */
  divided?: boolean

  /** An list can be floated left or right. */
  floated?: SemanticFLOATS

  /** A list can be formatted to have items appear horizontally. */
  horizontal?: boolean

  /** A list can be inverted to appear on a dark background. */
  inverted?: boolean

  /** Shorthand array of props for ListItem. */
  items?: SemanticShorthandCollection<ListItemProps>

  /** A list can be specially formatted for navigation links. */
  link?: boolean

  /**
   * onClick handler for ListItem. Mutually exclusive with children.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All item props.
   */
  onItemClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => void

  /** A list can be ordered numerically. */
  ordered?: boolean

  /** A list can relax its padding to provide more negative space. */
  relaxed?: boolean | 'very'

  /** A selection list formats list items as possible choices. */
  selection?: boolean

  /** A list can vary in size. */
  size?: SemanticSIZES

  /** An element inside a list can be vertically aligned. */
  verticalAlign?: SemanticVERTICALALIGNMENTS
}

/**
 * A list groups related content.
 */
const List = React.forwardRef<HTMLDivElement, ListProps>(function (props, ref) {
  const {
    animated,
    bulleted,
    celled,
    children,
    className,
    content,
    divided,
    floated,
    horizontal,
    inverted,
    items,
    link,
    ordered,
    relaxed,
    selection,
    size,
    verticalAlign,
  } = props

  const classes = cx(
    'ui',
    size,
    getKeyOnly(animated, 'animated'),
    getKeyOnly(bulleted, 'bulleted'),
    getKeyOnly(celled, 'celled'),
    getKeyOnly(divided, 'divided'),
    getKeyOnly(horizontal, 'horizontal'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(link, 'link'),
    getKeyOnly(ordered, 'ordered'),
    getKeyOnly(selection, 'selection'),
    getKeyOrValueAndKey(relaxed, 'relaxed'),
    getValueAndKey(floated, 'floated'),
    getVerticalAlignProp(verticalAlign),
    'list',
    className,
  )
  const rest = getUnhandledProps(List, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType role='list' {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  if (!childrenUtils.isNil(content)) {
    return (
      <ElementType role='list' {...rest} className={classes} ref={ref}>
        {content}
      </ElementType>
    )
  }

  return (
    <ElementType role='list' {...rest} className={classes} ref={ref}>
      {map(items, (item) =>
        ListItem.create(item, {
          overrideProps: (predefinedProps) => ({
            onClick: (e, itemProps) => {
              predefinedProps?.onClick?.(e, itemProps)
              props?.onItemClick?.(e, itemProps)
            },
          }),
        }),
      )}
    </ElementType>
  )
}) as ForwardRefComponent<ListProps, HTMLDivElement> & {
  Content: typeof ListContent
  Description: typeof ListDescription
  Header: typeof ListHeader
  Icon: typeof ListIcon
  Item: typeof ListItem
  List: typeof ListList
}

List.displayName = 'List'
List.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A list can animate to set the current item apart from the list. */
  animated: PropTypes.bool,

  /** A list can mark items with a bullet. */
  bulleted: PropTypes.bool,

  /** A list can divide its items into cells. */
  celled: PropTypes.bool,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** A list can show divisions between content. */
  divided: PropTypes.bool,

  /** An list can be floated left or right. */
  floated: PropTypes.oneOf(SUI.FLOATS),

  /** A list can be formatted to have items appear horizontally. */
  horizontal: PropTypes.bool,

  /** A list can be inverted to appear on a dark background. */
  inverted: PropTypes.bool,

  /** Shorthand array of props for ListItem. */
  items: customPropTypes.collectionShorthand,

  /** A list can be specially formatted for navigation links. */
  link: PropTypes.bool,

  /**
   * onClick handler for ListItem. Mutually exclusive with children.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All item props.
   */
  onItemClick: customPropTypes.every([customPropTypes.disallow(['children']), PropTypes.func]),

  /** A list can be ordered numerically. */
  ordered: PropTypes.bool,

  /** A list can relax its padding to provide more negative space. */
  relaxed: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['very'])]),

  /** A selection list formats list items as possible choices. */
  selection: PropTypes.bool,

  /** A list can vary in size. */
  size: PropTypes.oneOf(SUI.SIZES),

  /** An element inside a list can be vertically aligned. */
  verticalAlign: PropTypes.oneOf(SUI.VERTICAL_ALIGNMENTS),
}

List.Content = ListContent
List.Description = ListDescription
List.Header = ListHeader
List.Icon = ListIcon
List.Item = ListItem
List.List = ListList

export default List
