import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getKeyOnly,
  getTextAlignProp,
  getVerticalAlignProp,
} from '../../lib'
import TableCell from './TableCell'
import { map, without } from '../../lib/utils'
import type {
  ForwardRefComponent,
  SemanticShorthandCollection,
  SemanticVERTICALALIGNMENTS,
} from '../../generic'
import type { TableCellProps } from './TableCell'

export interface TableRowProps extends StrictTableRowProps {
  [key: string]: any
}

export interface StrictTableRowProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A row can be active or selected by a user. */
  active?: boolean

  /** An element type to render as (string or function). */
  cellAs?: any

  /** Shorthand array of props for TableCell. */
  cells?: SemanticShorthandCollection<TableCellProps>

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** A row can be disabled. */
  disabled?: boolean

  /** A row may call attention to an error or a negative value. */
  error?: boolean

  /** A row may let a user know whether a value is bad. */
  negative?: boolean

  /** A row may let a user know whether a value is good. */
  positive?: boolean

  /** A table row can adjust its text alignment. */
  textAlign?: 'center' | 'left' | 'right'

  /** A table row can adjust its vertical alignment. */
  verticalAlign?: SemanticVERTICALALIGNMENTS

  /** A row may warn a user. */
  warning?: boolean
}

/**
 * A table can have rows.
 */
const TableRow = React.forwardRef<HTMLTableCellElement, TableRowProps>(function (props, ref) {
  const {
    active,
    cellAs = 'td',
    cells,
    children,
    className,
    disabled,
    error,
    negative,
    positive,
    textAlign,
    verticalAlign,
    warning,
  } = props

  const classes = cx(
    getKeyOnly(active, 'active'),
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(error, 'error'),
    getKeyOnly(negative, 'negative'),
    getKeyOnly(positive, 'positive'),
    getKeyOnly(warning, 'warning'),
    getTextAlignProp(textAlign),
    getVerticalAlignProp(verticalAlign),
    className,
  )
  const rest = getUnhandledProps(TableRow, props)
  const ElementType = getComponentType(props, { defaultAs: 'tr' })

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {map(cells, (cell) => TableCell.create(cell, { defaultProps: { as: cellAs } }))}
    </ElementType>
  )
}) as ForwardRefComponent<TableRowProps, HTMLTableCellElement>

TableRow.displayName = 'TableRow'
TableRow.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A row can be active or selected by a user. */
  active: PropTypes.bool,

  /** An element type to render as (string or function). */
  cellAs: PropTypes.elementType,

  /** Shorthand array of props for TableCell. */
  cells: customPropTypes.collectionShorthand,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** A row can be disabled. */
  disabled: PropTypes.bool,

  /** A row may call attention to an error or a negative value. */
  error: PropTypes.bool,

  /** A row may let a user know whether a value is bad. */
  negative: PropTypes.bool,

  /** A row may let a user know whether a value is good. */
  positive: PropTypes.bool,

  /** A table row can adjust its text alignment. */
  textAlign: PropTypes.oneOf(without(SUI.TEXT_ALIGNMENTS, 'justified')),

  /** A table row can adjust its vertical alignment. */
  verticalAlign: PropTypes.oneOf(SUI.VERTICAL_ALIGNMENTS),

  /** A row may warn a user. */
  warning: PropTypes.bool,
}

TableRow.create = createShorthandFactory(TableRow, (cells) => ({ cells }))

export default TableRow
