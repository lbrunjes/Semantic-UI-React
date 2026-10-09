import * as React from 'react'

import { getComponentType, getUnhandledProps } from '../../lib'
import Dropdown from '../../modules/Dropdown'
import FormField from './FormField'
import type { StrictDropdownProps } from '../../modules/Dropdown'
import type { ForwardRefComponent } from '../../generic'
import type { StrictFormFieldProps } from './FormField'

export interface FormDropdownProps extends StrictFormDropdownProps {
  [key: string]: any
}

export interface StrictFormDropdownProps extends StrictFormFieldProps, StrictDropdownProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A FormField control prop. */
  control?: any

  /** Individual fields may display an error state along with a message. */
  error?: any
}

/**
 * Sugar for <Form.Field control={Dropdown} />.
 * @see Dropdown
 * @see Form
 */
const FormDropdown = React.forwardRef<HTMLDivElement, FormDropdownProps>(function (props, ref) {
  const { control = Dropdown } = props

  const rest = getUnhandledProps(FormDropdown, props)
  const ElementType = getComponentType(props, { defaultAs: FormField })

  return <ElementType {...rest} control={control} ref={ref} />
}) as ForwardRefComponent<FormDropdownProps, HTMLDivElement>

FormDropdown.displayName = 'FormDropdown'
FormDropdown.handledProps = ['as', 'control']

export default FormDropdown
