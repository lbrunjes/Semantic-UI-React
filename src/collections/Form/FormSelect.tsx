import * as React from 'react'

import { getComponentType, getUnhandledProps } from '../../lib'
import Select from '../../addons/Select'
import FormField from './FormField'
import type { StrictSelectProps } from '../../addons/Select'
import type { DropdownItemProps } from '../../modules/Dropdown/DropdownItem'
import type { StrictFormFieldProps } from './FormField'
import type { ForwardRefComponent } from '../../generic'

export interface FormSelectProps extends StrictFormSelectProps {
  [key: string]: any
}

export interface StrictFormSelectProps extends StrictFormFieldProps, StrictSelectProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A FormField control prop. */
  control?: any

  /** Individual fields may display an error state along with a message. */
  error?: any

  /** Array of Dropdown.Item props e.g. `{ text: '', value: '' }` */
  options: DropdownItemProps[]
}

/**
 * Sugar for <Form.Field control={Select} />.
 * @see Form
 * @see Select
 */
const FormSelect = React.forwardRef<HTMLDivElement, FormSelectProps>(function (props, ref) {
  const { control = Select, options } = props

  const rest = getUnhandledProps(FormSelect, props)
  const ElementType = getComponentType(props, { defaultAs: FormField })

  return <ElementType {...rest} control={control} options={options} ref={ref} />
}) as ForwardRefComponent<FormSelectProps, HTMLDivElement>

FormSelect.displayName = 'FormSelect'
FormSelect.handledProps = ['as', 'control', 'options']

export default FormSelect
