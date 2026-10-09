import PropTypes from 'prop-types'
import * as React from 'react'

import { getComponentType, getUnhandledProps } from '../../lib'
import TextArea from '../../addons/TextArea'
import FormField from './FormField'
import type { StrictTextAreaProps } from '../../addons/TextArea'
import type { ForwardRefComponent } from '../../generic'
import type { StrictFormFieldProps } from './FormField'

export interface FormTextAreaProps extends StrictFormTextAreaProps {
  [key: string]: any
}

export interface StrictFormTextAreaProps extends StrictFormFieldProps, StrictTextAreaProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A FormField control prop. */
  control?: any
}

/**
 * Sugar for <Form.Field control={TextArea} />.
 * @see Form
 * @see TextArea
 */
const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  function (props, ref) {
    const { control = TextArea } = props

    const rest = getUnhandledProps(FormTextArea, props)
    const ElementType = getComponentType(props, { defaultAs: FormField })

    return <ElementType {...rest} control={control} ref={ref} />
  },
) as ForwardRefComponent<FormTextAreaProps, HTMLTextAreaElement>

FormTextArea.displayName = 'FormTextArea'
FormTextArea.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A FormField control prop. */
  control: FormField.propTypes.control,
}

export default FormTextArea
