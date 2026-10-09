import PropTypes from 'prop-types'
import * as React from 'react'

import {
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getKeyOnly,
  getWidthProp,
} from '../../lib'
import type { ForwardRefComponent, SemanticWIDTHS } from '../../generic'

export interface FormGroupProps extends StrictFormGroupProps {
  [key: string]: any
}

export interface StrictFormGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** A Form Group can be disabled. */
  disabled?: boolean

  /** A Form Group can have error. */
  error?: boolean

  /** Fields can show related choices. */
  grouped?: boolean

  /** Multiple fields may be inline in a row. */
  inline?: boolean

  /** A form group can prevent itself from stacking on mobile. */
  unstackable?: boolean

  /** Fields Groups can specify their width in grid columns or automatically divide fields to be equal width. */
  widths?: SemanticWIDTHS | 'equal'
}

/**
 * A set of fields can appear grouped together.
 * @see Form
 */
const FormGroup = React.forwardRef<HTMLInputElement, FormGroupProps>((props, ref) => {
  const { children, className, disabled, error, grouped, inline, unstackable, widths } = props

  const classes = cx(
    getKeyOnly(error, 'error'),
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(grouped, 'grouped'),
    getKeyOnly(inline, 'inline'),
    getKeyOnly(unstackable, 'unstackable'),
    getWidthProp(widths, null, true),
    'fields',
    className,
  )
  const rest = getUnhandledProps(FormGroup, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {children}
    </ElementType>
  )
}) as ForwardRefComponent<FormGroupProps, HTMLInputElement>

FormGroup.displayName = 'FormGroup'
FormGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** A Form Group can be disabled. */
  disabled: PropTypes.bool,

  /** A Form Group can have error. */
  error: PropTypes.bool,

  /** Fields can show related choices. */
  grouped: customPropTypes.every([customPropTypes.disallow(['inline']), PropTypes.bool]),

  /** Multiple fields may be inline in a row. */
  inline: customPropTypes.every([customPropTypes.disallow(['grouped']), PropTypes.bool]),

  /** A form group can prevent itself from stacking on mobile. */
  unstackable: PropTypes.bool,

  /** Fields Groups can specify their width in grid columns or automatically divide fields to be equal width. */
  widths: PropTypes.oneOf([...SUI.WIDTHS, 'equal']),
}

export default FormGroup
