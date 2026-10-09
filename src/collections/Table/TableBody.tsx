import PropTypes from 'prop-types'
import * as React from 'react'

import { cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent } from '../../generic'

export interface TableBodyProps extends StrictTableBodyProps {
  [key: string]: any
}

export interface StrictTableBodyProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(function (props, ref) {
  const { children, className } = props

  const classes = cx(className)
  const rest = getUnhandledProps(TableBody, props)
  const ElementType = getComponentType(props, { defaultAs: 'tbody' })

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {children}
    </ElementType>
  )
}) as ForwardRefComponent<TableBodyProps, HTMLTableSectionElement>

TableBody.displayName = 'TableBody'
TableBody.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,
}

export default TableBody
