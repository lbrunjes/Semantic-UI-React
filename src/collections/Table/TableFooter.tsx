import PropTypes from 'prop-types'
import * as React from 'react'

import { getUnhandledProps } from '../../lib'
import TableHeader from './TableHeader'
import type { ForwardRefComponent } from '../../generic'
import type { StrictTableHeaderProps } from './TableHeader'

export interface TableFooterProps extends StrictTableFooterProps {
  [key: string]: any
}

export interface StrictTableFooterProps extends StrictTableHeaderProps {
  /** An element type to render as (string or function). */
  as?: any
}

/**
 * A table can have a footer.
 */
const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function (props, ref) {
    const { as = 'tfoot' } = props
    const rest = getUnhandledProps(TableFooter, props)

    return <TableHeader {...rest} as={as} ref={ref} />
  },
) as ForwardRefComponent<TableFooterProps, HTMLTableSectionElement>

TableFooter.displayName = 'TableFooter'
TableFooter.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,
}

export default TableFooter
