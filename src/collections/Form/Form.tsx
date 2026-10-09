import PropTypes from 'prop-types'
import * as React from 'react'

import { cx, getComponentType, getUnhandledProps, SUI, getKeyOnly, getWidthProp } from '../../lib'
import FormButton from './FormButton'
import FormCheckbox from './FormCheckbox'
import FormDropdown from './FormDropdown'
import FormField from './FormField'
import FormGroup from './FormGroup'
import FormInput from './FormInput'
import FormRadio from './FormRadio'
import FormSelect from './FormSelect'
import FormTextArea from './FormTextArea'
import { without } from '../../lib/utils'
import type { ForwardRefComponent } from '../../generic'

export interface FormProps extends StrictFormProps {
  [key: string]: any
}

export interface StrictFormProps {
  /** An element type to render as (string or function). */
  as?: any

  /** The HTML form action */
  action?: string

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Automatically show any error Message children. */
  error?: boolean

  /** A form can have its color inverted for contrast. */
  inverted?: boolean

  /** Automatically show a loading indicator. */
  loading?: boolean

  /** The HTML form submit handler. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>, data: FormProps) => void

  /** A comment can contain a form to reply to a comment. This may have arbitrary content. */
  reply?: boolean

  /** A form can vary in size. */
  size?: string

  /** Automatically show any success Message children. */
  success?: boolean

  /** A form can prevent itself from stacking on mobile. */
  unstackable?: boolean

  /** Automatically show any warning Message children. */
  warning?: boolean

  /** Forms can automatically divide fields to be equal width. */
  widths?: 'equal'
}

/**
 * A Form displays a set of related user input fields in a structured way.
 * @see Button
 * @see Checkbox
 * @see Dropdown
 * @see Input
 * @see Message
 * @see Radio
 * @see Select
 */
const Form = React.forwardRef<HTMLFormElement, FormProps>(function (props, ref) {
  const {
    action,
    children,
    className,
    error,
    inverted,
    loading,
    reply,
    size,
    success,
    unstackable,
    warning,
    widths,
  } = props

  const handleSubmit = (e, ...args) => {
    // Heads up! Third party libs can pass own data as first argument, we need to check that it has preventDefault()
    // method.
    if (typeof action !== 'string') e?.preventDefault?.()
    props?.onSubmit?.(e, props, ...args)
  }

  const classes = cx(
    'ui',
    size,
    getKeyOnly(error, 'error'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(loading, 'loading'),
    getKeyOnly(reply, 'reply'),
    getKeyOnly(success, 'success'),
    getKeyOnly(unstackable, 'unstackable'),
    getKeyOnly(warning, 'warning'),
    getWidthProp(widths, null, true),
    'form',
    className,
  )
  const rest = getUnhandledProps(Form, props)
  const ElementType = getComponentType(props, { defaultAs: 'form' })

  return (
    <ElementType {...rest} action={action} className={classes} onSubmit={handleSubmit} ref={ref}>
      {children}
    </ElementType>
  )
}) as ForwardRefComponent<FormProps, HTMLFormElement> & {
  Field: typeof FormField
  Button: typeof FormButton
  Checkbox: typeof FormCheckbox
  Dropdown: typeof FormDropdown
  Group: typeof FormGroup
  Input: typeof FormInput
  Radio: typeof FormRadio
  Select: typeof FormSelect
  TextArea: typeof FormTextArea
}

Form.displayName = 'Form'

Form.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** The HTML form action */
  action: PropTypes.string,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Automatically show any error Message children. */
  error: PropTypes.bool,

  /** A form can have its color inverted for contrast. */
  inverted: PropTypes.bool,

  /** Automatically show a loading indicator. */
  loading: PropTypes.bool,

  /** The HTML form submit handler. */
  onSubmit: PropTypes.func,

  /** A comment can contain a form to reply to a comment. This may have arbitrary content. */
  reply: PropTypes.bool,

  /** A form can vary in size. */
  size: PropTypes.oneOf(without(SUI.SIZES, 'medium')),

  /** Automatically show any success Message children. */
  success: PropTypes.bool,

  /** A form can prevent itself from stacking on mobile. */
  unstackable: PropTypes.bool,

  /** Automatically show any warning Message children. */
  warning: PropTypes.bool,

  /** Forms can automatically divide fields to be equal width. */
  widths: PropTypes.oneOf(['equal']),
}

Form.Field = FormField
Form.Button = FormButton
Form.Checkbox = FormCheckbox
Form.Dropdown = FormDropdown
Form.Group = FormGroup
Form.Input = FormInput
Form.Radio = FormRadio
Form.Select = FormSelect
Form.TextArea = FormTextArea

export default Form
