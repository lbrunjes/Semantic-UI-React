import PropTypes from 'prop-types'
import React, { createElement } from 'react'

import {
  childrenUtils,
  createHTMLLabel,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getKeyOnly,
  getWidthProp,
} from '../../lib'
import Label from '../../elements/Label'
import Checkbox from '../../modules/Checkbox'
import Radio from '../../addons/Radio'
import { get } from '../../lib/utils'
import type {
  ForwardRefComponent,
  HtmlLabelProps,
  SemanticShorthandContent,
  SemanticShorthandItem,
  SemanticWIDTHS,
} from '../../generic'
import type { LabelProps } from '../../elements/Label'

export interface FormFieldProps extends StrictFormFieldProps {
  [key: string]: any
}

export interface StrictFormFieldProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /**
   * A form control component (i.e. Dropdown) or HTML tagName (i.e. 'input').
   * Extra FormField props are passed to the control component.
   * Mutually exclusive with children.
   */
  control?: any

  /** Individual fields may be disabled. */
  disabled?: boolean

  /** Individual fields may display an error state along with a message. */
  error?: boolean | SemanticShorthandItem<LabelProps>

  /** The id of the control */
  id?: number | string

  /** A field can have its label next to instead of above it. */
  inline?: boolean

  /** Mutually exclusive with children. */
  label?: SemanticShorthandItem<HtmlLabelProps>

  /** A field can show that input is mandatory.  Requires a label. */
  required?: any

  /** Passed to the control component (i.e. <input type='password' />) */
  type?: string

  /** A field can specify its width in grid columns */
  width?: SemanticWIDTHS
}

/**
 * A field is a form element containing a label and an input.
 * @see Form
 * @see Button
 * @see Checkbox
 * @see Dropdown
 * @see Input
 * @see Radio
 * @see Select
 */
const FormField = React.forwardRef<HTMLElement, FormFieldProps>(function (props, ref) {
  const {
    children,
    className,
    content,
    control,
    disabled,
    error,
    inline,
    label,
    required,
    type,
    width,
    id,
  } = props

  const classes = cx(
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(error, 'error'),
    getKeyOnly(inline, 'inline'),
    getKeyOnly(required, 'required'),
    getWidthProp(width, 'wide'),
    'field',
    className,
  )
  const rest = getUnhandledProps(FormField, props)
  const ElementType = getComponentType(props)

  const errorPointing = get(error, 'pointing', 'above')
  const errorLabel = Label.create(error, {
    autoGenerateKey: false,
    defaultProps: {
      prompt: true,
      pointing: errorPointing,
      id: id ? `${id}-error-message` : undefined,
      role: 'alert',
      'aria-atomic': true,
    },
  })

  const errorLabelBefore = (errorPointing === 'below' || errorPointing === 'right') && errorLabel
  const errorLabelAfter = (errorPointing === 'above' || errorPointing === 'left') && errorLabel

  // ----------------------------------------
  // No Control
  // ----------------------------------------

  if (control == null) {
    if (label == null) {
      return (
        <ElementType {...rest} className={classes} id={id} ref={ref}>
          {childrenUtils.isNil(children) ? content : children}
        </ElementType>
      )
    }

    return (
      <ElementType {...rest} className={classes} id={id} ref={ref}>
        {errorLabelBefore}
        {createHTMLLabel(label, { autoGenerateKey: false })}
        {errorLabelAfter}
      </ElementType>
    )
  }

  // ----------------------------------------
  // Checkbox/Radio Control
  // ----------------------------------------

  const ariaDescribedBy = id && error ? `${id}-error-message` : null
  const ariaAttrs = {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': error ? true : undefined,
  }
  const controlProps = { ...rest, content, children, disabled, required, type, id, ref }

  // wrap HTML checkboxes/radios in the label
  if (control === 'input' && (type === 'checkbox' || type === 'radio')) {
    return (
      <ElementType className={classes}>
        <label>
          {errorLabelBefore}
          {createElement(control, { ...ariaAttrs, ...controlProps })} {label}
          {errorLabelAfter}
        </label>
      </ElementType>
    )
  }

  // pass label prop to controls that support it
  if (control === Checkbox || control === Radio) {
    return (
      <ElementType className={classes}>
        {errorLabelBefore}
        {createElement(control, { ...ariaAttrs, ...controlProps, label })}
        {errorLabelAfter}
      </ElementType>
    )
  }

  // ----------------------------------------
  // Other Control
  // ----------------------------------------

  return (
    <ElementType className={classes}>
      {createHTMLLabel(label, {
        defaultProps: { htmlFor: id },
        autoGenerateKey: false,
      })}
      {errorLabelBefore}
      {createElement(control, { ...ariaAttrs, ...controlProps })}
      {errorLabelAfter}
    </ElementType>
  )
}) as ForwardRefComponent<FormFieldProps, HTMLElement>

FormField.displayName = 'FormField'
FormField.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /**
   * A form control component (i.e. Dropdown) or HTML tagName (i.e. 'input').
   * Extra FormField props are passed to the control component.
   * Mutually exclusive with children.
   */
  control: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.oneOf(['button', 'input', 'select', 'textarea']),
  ]),

  /** Individual fields may be disabled. */
  disabled: PropTypes.bool,

  /** Individual fields may display an error state along with a message. */
  error: PropTypes.oneOfType([PropTypes.bool, customPropTypes.itemShorthand]),

  /** The id of the control */
  id: PropTypes.string,

  /** A field can have its label next to instead of above it. */
  inline: PropTypes.bool,

  // Heads Up!
  // Do not disallow children with `label` shorthand
  // The `control` might accept a `label` prop and `children`
  /** Mutually exclusive with children. */
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),

  /** A field can show that input is mandatory. */
  required: PropTypes.bool,

  /** Passed to the control component (i.e. <input type='password' />) */
  type: customPropTypes.every([
    customPropTypes.demand(['control']),
    // don't strictly validate HTML types
    // a control might be passed that uses a `type` prop with unknown values
    // let the control validate if for us
  ]),

  /** A field can specify its width in grid columns */
  width: PropTypes.oneOf(SUI.WIDTHS),
}

export default FormField
