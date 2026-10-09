import PropTypes from 'prop-types'
import * as React from 'react'

import { createShorthandFactory, keyboardKey } from '../../lib'
import MenuItem from '../../collections/Menu/MenuItem'
import type { ForwardRefComponent } from '../../generic'

export interface PaginationItemProps extends StrictPaginationItemProps {
  [key: string]: any
}

export interface StrictPaginationItemProps {
  /** A pagination item can be active. */
  active?: boolean

  /** A pagination item can be disabled. */
  disabled?: boolean

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationItemProps) => void

  /**
   * Called on key down.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onKeyDown?: (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationItemProps) => void

  /** A pagination should have a type. */
  type?: 'ellipsisItem' | 'firstItem' | 'prevItem' | 'pageItem' | 'nextItem' | 'lastItem'
}

/**
 * An item of a pagination.
 */
const PaginationItem = React.forwardRef<HTMLDivElement, PaginationItemProps>(function (props, ref) {
  const { active, type } = props
  const disabled = props.disabled || type === 'ellipsisItem'

  const handleClick = (e) => {
    props?.onClick?.(e, props)
  }

  const handleKeyDown = (e) => {
    props?.onKeyDown?.(e, props)

    if (keyboardKey.getCode(e) === keyboardKey.Enter) {
      props?.onClick?.(e, props)
    }
  }

  return MenuItem.create(props, {
    defaultProps: {
      active,
      'aria-current': active,
      'aria-disabled': disabled,
      disabled,
      tabIndex: disabled ? -1 : 0,
    },
    overrideProps: () => ({
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      ref,
    }),
  })
}) as ForwardRefComponent<PaginationItemProps, HTMLDivElement>

PaginationItem.displayName = 'PaginationItem'
PaginationItem.propTypes = {
  /** A pagination item can be active. */
  active: PropTypes.bool,

  /** A pagination item can be disabled. */
  disabled: PropTypes.bool,

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick: PropTypes.func,

  /**
   * Called on key down.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onKeyDown: PropTypes.func,

  /** A pagination should have a type. */
  type: PropTypes.oneOf([
    'ellipsisItem',
    'firstItem',
    'prevItem',
    'pageItem',
    'nextItem',
    'lastItem',
  ]),
}

PaginationItem.create = createShorthandFactory(PaginationItem, (content) => ({ content }))

export default PaginationItem
