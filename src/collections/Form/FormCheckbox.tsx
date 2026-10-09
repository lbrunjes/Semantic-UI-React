import PropTypes from 'prop-types'
import * as React from 'react'

import { getComponentType, getUnhandledProps } from '../../lib'
import Checkbox from '../../modules/Checkbox'
import FormField from './FormField'
import type { StrictCheckboxProps } from '../../modules/Checkbox'
import type { ForwardRefComponent } from '../../generic'
import type { StrictFormFieldProps } from './FormField'

export interface FormCheckboxProps extends StrictFormCheckboxProps {
  [key: string]: any
}

export interface StrictFormCheckboxProps extends StrictFormFieldProps, StrictCheckboxProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A FormField control prop. */
  control?: any

  /** HTML input type, either checkbox or radio. */
  type?: 'checkbox' | 'radio'
}

/**
 * Sugar for <Form.Field control={Checkbox} />.
 * @see Checkbox
 * @see Form
 */
const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>((props, ref) => {
  const { control = Checkbox } = props

  const rest = getUnhandledProps(FormCheckbox, props)
  const ElementType = getComponentType(props, { defaultAs: FormField })

  return <ElementType {...rest} control={control} ref={ref} />
}) as ForwardRefComponent<FormCheckboxProps, HTMLInputElement>

FormCheckbox.displayName = 'FormCheckbox'
FormCheckbox.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A FormField control prop. */
  control: FormField.propTypes.control,
}

export default FormCheckbox
