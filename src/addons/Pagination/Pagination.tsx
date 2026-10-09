import * as React from 'react'

import { createPaginationItems, getUnhandledProps, useAutoControlledValue } from '../../lib'
import Menu from '../../collections/Menu'
import PaginationItem from './PaginationItem'
import { map } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { PaginationItemProps } from './PaginationItem'

export interface PaginationProps extends StrictPaginationProps {
  [key: string]: any
}

export interface StrictPaginationProps {
  /** A pagination item can have an aria label. */
  'aria-label'?: string

  /** Initial activePage value. */
  defaultActivePage?: number | string

  /** Index of the currently active page. */
  activePage?: number | string

  /** Number of always visible pages at the beginning and end. */
  boundaryRange?: number | string

  /** A pagination can be disabled. */
  disabled?: boolean

  /** A shorthand for PaginationItem. */
  ellipsisItem?: SemanticShorthandItem<PaginationItemProps>

  /** A shorthand for PaginationItem. */
  firstItem?: SemanticShorthandItem<PaginationItemProps>

  /** A shorthand for PaginationItem. */
  lastItem?: SemanticShorthandItem<PaginationItemProps>

  /** A shorthand for PaginationItem. */
  nextItem?: SemanticShorthandItem<PaginationItemProps>

  /** A shorthand for PaginationItem. */
  pageItem?: SemanticShorthandItem<PaginationItemProps>

  /** A shorthand for PaginationItem. */
  prevItem?: SemanticShorthandItem<PaginationItemProps>

  /**
   * Called on change of an active page.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onPageChange?: (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void

  /** Number of always visible pages before and after the current one. */
  siblingRange?: number | string

  /** Total number of pages. */
  totalPages: number | string
}

/**
 * A component to render a pagination.
 */
// Heads up! `PropsWithoutRef<>` drops the required props of the index-signature props interface, so the
// cast goes through `unknown`.
// eslint-disable-next-line react/display-name -- it is assigned below, the cast to the public type hides it from the rule
const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(function (props, ref) {
  const {
    'aria-label': ariaLabel = 'Pagination Navigation',
    boundaryRange = 1,
    disabled,
    ellipsisItem = '...',
    firstItem = {
      'aria-label': 'First item',
      content: '«',
    },
    lastItem = {
      'aria-label': 'Last item',
      content: '»',
    },
    nextItem = {
      'aria-label': 'Next item',
      content: '⟩',
    },
    pageItem = {},
    prevItem = {
      'aria-label': 'Previous item',
      content: '⟨',
    },
    siblingRange = 1,
    totalPages,
  } = props
  const [activePage, setActivePage] = useAutoControlledValue({
    state: props.activePage,
    defaultState: props.defaultActivePage,
    initialState: 1,
  })

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    { value: nextActivePage }: PaginationItemProps,
  ) => {
    const prevActivePage = activePage

    // Heads up! We need the cast to the "number" type there, as `activePage` can be a string
    if (+prevActivePage === +nextActivePage) {
      return
    }

    setActivePage(nextActivePage)
    props?.onPageChange?.(e, { ...props, activePage: nextActivePage })
  }

  const handleItemOverrides =
    (active: boolean, type: string, value: number) => (predefinedProps: PaginationItemProps) => ({
      active,
      type,
      key: `${type}-${value}`,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>, itemProps: PaginationItemProps) => {
        predefinedProps?.onClick?.(e, itemProps)

        if (itemProps.type !== 'ellipsisItem') {
          handleItemClick(e, itemProps)
        }
      },
    })

  const items = createPaginationItems({
    activePage,
    boundaryRange,
    hideEllipsis: ellipsisItem == null,
    siblingRange,
    totalPages,
  })
  const rest = getUnhandledProps(Pagination, props)

  const paginationItemTypes = {
    firstItem,
    lastItem,
    ellipsisItem,
    nextItem,
    pageItem,
    prevItem,
  }

  return (
    <Menu {...rest} aria-label={ariaLabel} pagination role='navigation' ref={ref}>
      {map(items, ({ active, type, value }: { active: boolean; type: string; value: number }) =>
        PaginationItem.create(paginationItemTypes[type as keyof typeof paginationItemTypes], {
          defaultProps: {
            content: value,
            disabled,
            value,
          },
          overrideProps: handleItemOverrides(active, type, value),
        }),
      )}
    </Menu>
  )
}) as unknown as ForwardRefComponent<PaginationProps, HTMLDivElement> & {
  Item: typeof PaginationItem
}

Pagination.displayName = 'Pagination'
Pagination.handledProps = [
  'activePage',
  'aria-label',
  'boundaryRange',
  'defaultActivePage',
  'disabled',
  'ellipsisItem',
  'firstItem',
  'lastItem',
  'nextItem',
  'onPageChange',
  'pageItem',
  'prevItem',
  'siblingRange',
  'totalPages',
]

Pagination.Item = PaginationItem

export default Pagination
