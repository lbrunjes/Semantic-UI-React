import PropTypes from 'prop-types'
import * as React from 'react'

import { getComponentType, getUnhandledProps } from '../../lib'
import Button from '../../elements/Button'
import FormField from './FormField'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { StrictButtonProps } from '../../elements/Button'
import type { LabelProps } from '../../elements/Label'
import type { StrictFormFieldProps } from './FormField'

export interface FormButtonProps extends StrictFormButtonProps {
  [key: string]: any
}

export interface StrictFormButtonProps
  extends Omit<StrictFormFieldProps, 'label'>, Omit<StrictButtonProps, 'type'> {
  /** An element type to render as (string or function). */
  as?: any

  /** A FormField control prop. */
  control?: any

  /** Shorthand for a Label. */
  label?: SemanticShorthandItem<LabelProps>
}

/**
 * Sugar for <Form.Field control={Button} />.
 * @see Button
 * @see Form
 */
const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>((props, ref) => {
  const { control = Button } = props

  const rest = getUnhandledProps(FormButton, props)
  const ElementType = getComponentType(props, { defaultAs: FormField })

  return <ElementType {...rest} control={control} ref={ref} />
}) as ForwardRefComponent<FormButtonProps, HTMLButtonElement>

FormButton.displayName = 'FormButton'
FormButton.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A FormField control prop. */
  control: FormField.propTypes.control,
}

export default FormButton
