import * as React from 'react'

import { cx, getUnhandledProps, getValueAndKey } from '../../lib'
import TableCell from './TableCell'
import type { StrictTableCellProps } from './TableCell'
import type { ForwardRefComponent } from '../../generic'

export interface TableHeaderCellProps extends StrictTableHeaderCellProps {
  [key: string]: any
}

export interface StrictTableHeaderCellProps extends StrictTableCellProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Additional classes. */
  className?: string

  /** A header cell can be sorted in ascending or descending order. */
  sorted?: 'ascending' | 'descending'
}

/**
 * A table can have a header cell.
 */
const TableHeaderCell = React.forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function (props, ref) {
    const { as = 'th', className, sorted } = props

    const classes = cx(getValueAndKey(sorted, 'sorted'), className)
    const rest = getUnhandledProps(TableHeaderCell, props)

    return <TableCell {...rest} as={as} className={classes} ref={ref} />
  },
) as ForwardRefComponent<TableHeaderCellProps, HTMLTableCellElement>

TableHeaderCell.displayName = 'TableHeaderCell'
TableHeaderCell.handledProps = ['as', 'className', 'sorted']

export default TableHeaderCell
