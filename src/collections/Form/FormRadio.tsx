import PropTypes from 'prop-types'
import * as React from 'react'

import { getComponentType, getUnhandledProps } from '../../lib'
import Radio from '../../addons/Radio'
import FormField from './FormField'
import type { StrictRadioProps } from '../../addons/Radio'
import type { ForwardRefComponent } from '../../generic'
import type { StrictFormFieldProps } from './FormField'

export interface FormRadioProps extends StrictFormRadioProps {
  [key: string]: any
}

export interface StrictFormRadioProps extends StrictFormFieldProps, StrictRadioProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A FormField control prop. */
  control?: any

  /** HTML input type, either checkbox or radio. */
  type?: 'checkbox' | 'radio'
}

/**
 * Sugar for <Form.Field control={Radio} />.
 * @see Form
 * @see Radio
 */
const FormRadio = React.forwardRef<HTMLInputElement, FormRadioProps>(function (props, ref) {
  const { control = Radio } = props

  const rest = getUnhandledProps(FormRadio, props)
  const ElementType = getComponentType(props, { defaultAs: FormField })

  return <ElementType {...rest} control={control} ref={ref} />
}) as ForwardRefComponent<FormRadioProps, HTMLInputElement>

FormRadio.displayName = 'FormRadio'
FormRadio.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A FormField control prop. */
  control: FormField.propTypes.control,
}

export default FormRadio
