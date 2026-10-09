import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  getKeyOrValueAndKey,
  getValueAndKey,
  useMergedRefs,
} from '../../lib'
import Icon from '../Icon/Icon'
import Label from '../Label/Label'
import ButtonContent from './ButtonContent'
import ButtonGroup from './ButtonGroup'
import ButtonOr from './ButtonOr'
import type {
  ForwardRefComponent,
  SemanticCOLORS,
  SemanticFLOATS,
  SemanticShorthandContent,
  SemanticShorthandItem,
  SemanticSIZES,
} from '../../generic'
import type { IconProps } from '../Icon'
import type { LabelProps } from '../Label'

export interface ButtonProps extends StrictButtonProps {
  [key: string]: any
}

export interface StrictButtonProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A button can show it is currently the active user selection. */
  active?: boolean

  /** A button can animate to show hidden content. */
  animated?: boolean | 'fade' | 'vertical'

  /** A button can be attached to other content. */
  attached?: boolean | 'left' | 'right' | 'top' | 'bottom'

  /** A basic button is less pronounced. */
  basic?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** A button can be circular. */
  circular?: boolean

  /** Additional classes. */
  className?: string

  /** A button can have different colors. */
  color?:
    | SemanticCOLORS
    | 'facebook'
    | 'google plus'
    | 'vk'
    | 'twitter'
    | 'linkedin'
    | 'instagram'
    | 'youtube'

  /** A button can reduce its padding to fit into tighter spaces. */
  compact?: boolean

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A button can show it is currently unable to be interacted with. */
  disabled?: boolean

  /** A button can be aligned to the left or right of its container. */
  floated?: SemanticFLOATS

  /** A button can take the width of its container. */
  fluid?: boolean

  /** Add an Icon by name, props object, or pass an <Icon />. */
  icon?: boolean | SemanticShorthandItem<IconProps>

  /** A button can be formatted to appear on dark backgrounds. */
  inverted?: boolean

  /** Add a Label by text, props object, or pass a <Label />. */
  label?: SemanticShorthandItem<LabelProps>

  /** A labeled button can format a Label or Icon to appear on the left or right. */
  labelPosition?: 'right' | 'left'

  /** A button can show a loading indicator. */
  loading?: boolean

  /** A button can hint towards a negative consequence. */
  negative?: boolean

  /**
   * Called after user's click.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void

  /** A button can hint towards a positive consequence. */
  positive?: boolean

  /** A button can be formatted to show different levels of emphasis. */
  primary?: boolean

  /** The role of the HTML element. */
  role?: string

  /** A button can be formatted to show different levels of emphasis. */
  secondary?: boolean

  /** A button can have different sizes. */
  size?: SemanticSIZES

  /** A button can receive focus. */
  tabIndex?: number | string

  /** A button can be formatted to toggle on and off. */
  toggle?: boolean

  /** The type of the HTML element. */
  type?: 'submit' | 'reset' | 'button'
}

/**
 * @param {React.ElementType} ElementType
 * @param {String} role
 */
function computeButtonAriaRole(ElementType: React.ElementType, role: string | undefined) {
  if (role != null) {
    return role
  }

  if (ElementType !== 'button') {
    return 'button'
  }
}

/**
 * @param {React.ElementType} ElementType
 * @param {Boolean} disabled
 * @param {Number} tabIndex
 */
function computeTabIndex(
  ElementType: React.ElementType,
  disabled: boolean | undefined,
  tabIndex: number | string | undefined,
) {
  if (tabIndex != null) {
    return tabIndex
  }
  if (disabled) {
    return -1
  }
  if (ElementType === 'div') {
    return 0
  }
}

function hasIconClass(props: ButtonProps) {
  const { children, content, icon, labelPosition } = props

  if (icon === true) {
    return true
  }

  if (icon) {
    return labelPosition || (childrenUtils.isNil(children) && content == null)
  }
}

/**
 * A Button indicates a possible user action.
 * @see Form
 * @see Icon
 * @see Label
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function (props, ref) {
  const {
    active,
    animated,
    attached,
    basic,
    children,
    circular,
    className,
    color,
    compact,
    content,
    disabled,
    floated,
    fluid,
    icon,
    inverted,
    label,
    labelPosition,
    loading,
    negative,
    positive,
    primary,
    secondary,
    size,
    toggle,
    type,
  } = props
  const elementRef = useMergedRefs(ref, React.useRef(undefined))

  const baseClasses = cx(
    color,
    size,
    getKeyOnly(active, 'active'),
    getKeyOnly(basic, 'basic'),
    getKeyOnly(circular, 'circular'),
    getKeyOnly(compact, 'compact'),
    getKeyOnly(fluid, 'fluid'),
    getKeyOnly(hasIconClass(props), 'icon'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(loading, 'loading'),
    getKeyOnly(negative, 'negative'),
    getKeyOnly(positive, 'positive'),
    getKeyOnly(primary, 'primary'),
    getKeyOnly(secondary, 'secondary'),
    getKeyOnly(toggle, 'toggle'),
    getKeyOrValueAndKey(animated, 'animated'),
    getKeyOrValueAndKey(attached, 'attached'),
  )
  const labeledClasses = cx(getKeyOrValueAndKey(labelPosition || !!label, 'labeled'))
  const wrapperClasses = cx(getKeyOnly(disabled, 'disabled'), getValueAndKey(floated, 'floated'))

  const rest = getUnhandledProps(Button, props)
  const ElementType = getComponentType(props, {
    defaultAs: 'button',
    getDefault: () => {
      if (attached != null || label != null) {
        return 'div'
      }
    },
  })
  const tabIndex = computeTabIndex(ElementType, disabled, props.tabIndex)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }

    props?.onClick?.(e, props)
  }

  if (label != null) {
    const buttonClasses = cx('ui', baseClasses, 'button', className)
    const containerClasses = cx('ui', labeledClasses, 'button', className, wrapperClasses)
    const labelElement = Label.create(label, {
      defaultProps: {
        basic: true,
        pointing: labelPosition === 'left' ? 'right' : 'left',
      },
      autoGenerateKey: false,
    })

    return (
      <ElementType {...rest} className={containerClasses} onClick={handleClick}>
        {labelPosition === 'left' && labelElement}
        <button
          className={buttonClasses}
          aria-pressed={toggle ? !!active : undefined}
          disabled={disabled}
          // `tabIndex` can be a string, React accepts it at runtime
          tabIndex={tabIndex as number | undefined}
          type={type}
          ref={elementRef}
        >
          {Icon.create(icon, { autoGenerateKey: false })} {content}
        </button>
        {(labelPosition === 'right' || !labelPosition) && labelElement}
      </ElementType>
    )
  }

  const classes = cx('ui', baseClasses, wrapperClasses, labeledClasses, 'button', className)
  const hasChildren = !childrenUtils.isNil(children)
  const role = computeButtonAriaRole(ElementType, props.role)

  return (
    <ElementType
      {...rest}
      className={classes}
      aria-pressed={toggle ? !!active : undefined}
      disabled={(disabled && ElementType === 'button') || undefined}
      onClick={handleClick}
      role={role}
      tabIndex={tabIndex}
      type={type}
      ref={elementRef}
    >
      {hasChildren && children}
      {!hasChildren && Icon.create(icon, { autoGenerateKey: false })}
      {!hasChildren && content}
    </ElementType>
  )
}) as ForwardRefComponent<ButtonProps, HTMLButtonElement> & {
  Content: typeof ButtonContent
  Group: typeof ButtonGroup
  Or: typeof ButtonOr
}

Button.displayName = 'Button'
Button.handledProps = [
  'active',
  'animated',
  'as',
  'attached',
  'basic',
  'children',
  'circular',
  'className',
  'color',
  'compact',
  'content',
  'disabled',
  'floated',
  'fluid',
  'icon',
  'inverted',
  'label',
  'labelPosition',
  'loading',
  'negative',
  'onClick',
  'positive',
  'primary',
  'role',
  'secondary',
  'size',
  'tabIndex',
  'toggle',
  'type',
]

Button.Content = ButtonContent
Button.Group = ButtonGroup
Button.Or = ButtonOr

Button.create = createShorthandFactory(Button, (value) => ({ content: value }))

export default Button
