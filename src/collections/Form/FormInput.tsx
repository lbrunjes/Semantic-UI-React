import * as React from 'react'

import { getComponentType, getUnhandledProps } from '../../lib'
import Input from '../../elements/Input'
import FormField from './FormField'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { LabelProps } from '../../elements/Label'
import type { StrictInputProps } from '../../elements/Input'
import type { StrictFormFieldProps } from './FormField'

export interface FormInputProps extends StrictFormInputProps {
  [key: string]: any
}

export interface StrictFormInputProps
  extends Omit<StrictFormFieldProps, 'label'>, StrictInputProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A FormField control prop. */
  control?: any

  /** Individual fields may display an error state along with a message. */
  error?: any

  /** Shorthand for a Label. */
  label?: SemanticShorthandItem<LabelProps>
}

/**
 * Sugar for <Form.Field control={Input} />.
 * @see Form
 * @see Input
 */
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(function (props, ref) {
  const { control = Input } = props

  const rest = getUnhandledProps(FormInput, props)
  const ElementType = getComponentType(props, { defaultAs: FormField })

  return <ElementType {...rest} control={control} ref={ref} />
}) as ForwardRefComponent<FormInputProps, HTMLInputElement>

FormInput.displayName = 'FormInput'
FormInput.handledProps = ['as', 'control']

export default FormInput
