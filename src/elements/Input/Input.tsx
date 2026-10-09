import * as React from 'react'

import {
  childrenUtils,
  createHTMLInput,
  createShorthandFactory,
  cx,
  getComponentType,
  getElementRef,
  getUnhandledProps,
  partitionHTMLProps,
  getKeyOnly,
  getValueAndKey,
  setRef,
} from '../../lib'
import Button from '../Button'
import Icon from '../Icon'
import Label from '../Label'
import { includes, map } from '../../lib/utils'
import type { ForwardRefComponent, HtmlInputrops, SemanticShorthandItem } from '../../generic'
import type { LabelProps } from '../Label'

export interface InputProps extends StrictInputProps {
  [key: string]: any
}

export interface StrictInputProps {
  /** An element type to render as (string or function). */
  as?: any

  /** An Input can be formatted to alert the user to an action they may perform. */
  action?: any | boolean

  /** An action can appear along side an Input on the left or right. */
  actionPosition?: 'left'

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** An Input field can show that it is disabled. */
  disabled?: boolean

  /** An Input field can show the data contains errors. */
  error?: boolean

  /** Take on the size of its container. */
  fluid?: boolean

  /** An Input field can show a user is currently interacting with it. */
  focus?: boolean

  /** Optional Icon to display inside the Input. */
  icon?: any | SemanticShorthandItem<InputProps>

  /** An Icon can appear inside an Input on the left. */
  iconPosition?: 'left'

  /** Shorthand for creating the HTML Input. */
  input?: SemanticShorthandItem<HtmlInputrops>

  /** Format to appear on dark backgrounds. */
  inverted?: boolean

  /** Optional Label to display along side the Input. */
  label?: SemanticShorthandItem<LabelProps>

  /** A Label can appear outside an Input on the left or right. */
  labelPosition?: 'left' | 'right' | 'left corner' | 'right corner'

  /** An Icon Input field can show that it is currently loading data. */
  loading?: boolean

  /**
   * Called on change.
   *
   * @param {ChangeEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and a proposed value.
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void

  /** An Input can vary in size. */
  size?: 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive'

  /** An Input can receive focus. */
  tabIndex?: number | string

  /** Transparent Input has no background. */
  transparent?: boolean

  /** The HTML input type. */
  type?: string
}

export interface InputOnChangeData extends InputProps {
  value: string
}

/**
 * An Input is a field used to elicit a response from a user.
 * @see Button
 * @see Form
 * @see Icon
 * @see Label
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(function (props, ref) {
  const {
    action,
    actionPosition,
    children,
    className,
    disabled,
    error,
    fluid,
    focus,
    icon,
    iconPosition,
    input,
    inverted,
    label,
    labelPosition,
    loading,
    size,
    tabIndex,
    transparent,
    type = 'text',
  } = props

  const computeIcon = () => {
    if (icon != null) {
      return icon
    }

    if (loading) {
      return 'spinner'
    }
  }

  const computeTabIndex = () => {
    if (tabIndex != null) {
      return tabIndex
    }

    if (disabled) {
      return -1
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value

    props?.onChange?.(e, { ...props, value: newValue })
  }

  const partitionProps = () => {
    const unhandledProps = getUnhandledProps(Input, props)
    const [htmlInputProps, rest] = partitionHTMLProps(unhandledProps)

    return [
      {
        ...htmlInputProps,
        disabled,
        type,
        tabIndex: computeTabIndex(),
        onChange: handleChange,
        ref,
      },
      rest,
    ]
  }

  const classes = cx(
    'ui',
    size,
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(error, 'error'),
    getKeyOnly(fluid, 'fluid'),
    getKeyOnly(focus, 'focus'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(loading, 'loading'),
    getKeyOnly(transparent, 'transparent'),
    getValueAndKey(actionPosition, 'action') || getKeyOnly(action, 'action'),
    getValueAndKey(iconPosition, 'icon') || getKeyOnly(icon || loading, 'icon'),
    getValueAndKey(labelPosition, 'labeled') || getKeyOnly(label, 'labeled'),
    'input',
    className,
  )
  const ElementType = getComponentType(props)
  const [htmlInputProps, rest] = partitionProps()

  // Render with children
  // ----------------------------------------
  if (!childrenUtils.isNil(children)) {
    // add htmlInputProps to the `<input />` child
    const childElements = map(React.Children.toArray(children), (child: any) => {
      if (child.type === 'input') {
        return React.cloneElement(child, {
          ...htmlInputProps,
          ...child.props,
          ref: (c: HTMLInputElement | null) => {
            setRef(getElementRef(child), c)
            setRef(ref, c)
          },
        })
      }

      return child
    })

    return (
      <ElementType {...rest} className={classes}>
        {childElements}
      </ElementType>
    )
  }

  // Render Shorthand
  // ----------------------------------------
  const actionElement = Button.create(action, { autoGenerateKey: false })
  const labelElement = Label.create(label, {
    defaultProps: {
      className: cx(
        'label',
        // add 'left|right corner'
        includes(labelPosition, 'corner') && labelPosition,
      ),
    },
    autoGenerateKey: false,
  })

  return (
    <ElementType {...rest} className={classes}>
      {actionPosition === 'left' && actionElement}
      {labelPosition !== 'right' && labelElement}
      {createHTMLInput(input || type, { defaultProps: htmlInputProps, autoGenerateKey: false })}
      {Icon.create(computeIcon(), { autoGenerateKey: false })}
      {actionPosition !== 'left' && actionElement}
      {labelPosition === 'right' && labelElement}
    </ElementType>
  )
}) as ForwardRefComponent<InputProps, HTMLInputElement>

Input.displayName = 'Input'
Input.handledProps = [
  'action',
  'actionPosition',
  'as',
  'children',
  'className',
  'disabled',
  'error',
  'fluid',
  'focus',
  'icon',
  'iconPosition',
  'input',
  'inverted',
  'label',
  'labelPosition',
  'loading',
  'onChange',
  'size',
  'tabIndex',
  'transparent',
  'type',
]

Input.create = createShorthandFactory(Input, (type) => ({ type }))

export default Input
