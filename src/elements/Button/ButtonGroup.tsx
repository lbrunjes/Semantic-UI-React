import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getKeyOnly,
  getKeyOrValueAndKey,
  getValueAndKey,
  getWidthProp,
} from '../../lib'
import Button from './Button'
import { map } from '../../lib/utils'
import type {
  SemanticCOLORS,
  SemanticFLOATS,
  SemanticShorthandContent,
  SemanticShorthandCollection,
  SemanticSIZES,
  SemanticWIDTHS,
  ForwardRefComponent,
} from '../../generic'
import type { ButtonProps } from './Button'

export interface ButtonGroupProps extends StrictButtonGroupProps {
  [key: string]: any
}

export interface StrictButtonGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Groups can be attached to other content. */
  attached?: boolean | 'left' | 'right' | 'top' | 'bottom'

  /** Groups can be less pronounced. */
  basic?: boolean

  /** Array of shorthand Button values. */
  buttons?: SemanticShorthandCollection<ButtonProps>

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Groups can have a shared color. */
  color?: SemanticCOLORS

  /** Groups can reduce their padding to fit into tighter spaces. */
  compact?: boolean

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Groups can be aligned to the left or right of its container. */
  floated?: SemanticFLOATS

  /** Groups can take the width of their container. */
  fluid?: boolean

  /** Groups can be formatted as icons. */
  icon?: boolean

  /** Groups can be formatted to appear on dark backgrounds. */
  inverted?: boolean

  /** Groups can be formatted as labeled icon buttons. */
  labeled?: boolean

  /** Groups can hint towards a negative consequence. */
  negative?: boolean

  /** Groups can hint towards a positive consequence. */
  positive?: boolean

  /** Groups can be formatted to show different levels of emphasis. */
  primary?: boolean

  /** Groups can be formatted to show different levels of emphasis. */
  secondary?: boolean

  /** Groups can have different sizes. */
  size?: SemanticSIZES

  /** Groups can be formatted to toggle on and off. */
  toggle?: boolean

  /** Groups can be formatted to appear vertically. */
  vertical?: boolean

  /** Groups can have their widths divided evenly. */
  widths?: SemanticWIDTHS
}

/**
 * Buttons can be grouped.
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(function (props, ref) {
  const {
    attached,
    basic,
    buttons,
    children,
    className,
    color,
    compact,
    content,
    floated,
    fluid,
    icon,
    inverted,
    labeled,
    negative,
    positive,
    primary,
    secondary,
    size,
    toggle,
    vertical,
    widths,
  } = props

  const classes = cx(
    'ui',
    color,
    size,
    getKeyOnly(basic, 'basic'),
    getKeyOnly(compact, 'compact'),
    getKeyOnly(fluid, 'fluid'),
    getKeyOnly(icon, 'icon'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(labeled, 'labeled'),
    getKeyOnly(negative, 'negative'),
    getKeyOnly(positive, 'positive'),
    getKeyOnly(primary, 'primary'),
    getKeyOnly(secondary, 'secondary'),
    getKeyOnly(toggle, 'toggle'),
    getKeyOnly(vertical, 'vertical'),
    getKeyOrValueAndKey(attached, 'attached'),
    getValueAndKey(floated, 'floated'),
    getWidthProp(widths),
    'buttons',
    className,
  )
  const rest = getUnhandledProps(ButtonGroup, props)
  const ElementType = getComponentType(props)

  if (buttons == null) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {map(buttons, (button) => Button.create(button))}
    </ElementType>
  )
}) as ForwardRefComponent<ButtonGroupProps, HTMLDivElement>

ButtonGroup.displayName = 'ButtonGroup'
ButtonGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Groups can be attached to other content. */
  attached: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  ]),

  /** Groups can be less pronounced. */
  basic: PropTypes.bool,

  /** Array of shorthand Button values. */
  buttons: customPropTypes.collectionShorthand,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Groups can have a shared color. */
  color: PropTypes.oneOf(SUI.COLORS),

  /** Groups can reduce their padding to fit into tighter spaces. */
  compact: PropTypes.bool,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Groups can be aligned to the left or right of its container. */
  floated: PropTypes.oneOf(SUI.FLOATS),

  /** Groups can take the width of their container. */
  fluid: PropTypes.bool,

  /** Groups can be formatted as icons. */
  icon: PropTypes.bool,

  /** Groups can be formatted to appear on dark backgrounds. */
  inverted: PropTypes.bool,

  /** Groups can be formatted as labeled icon buttons. */
  labeled: PropTypes.bool,

  /** Groups can hint towards a negative consequence. */
  negative: PropTypes.bool,

  /** Groups can hint towards a positive consequence. */
  positive: PropTypes.bool,

  /** Groups can be formatted to show different levels of emphasis. */
  primary: PropTypes.bool,

  /** Groups can be formatted to show different levels of emphasis. */
  secondary: PropTypes.bool,

  /** Groups can have different sizes. */
  size: PropTypes.oneOf(SUI.SIZES),

  /** Groups can be formatted to toggle on and off. */
  toggle: PropTypes.bool,

  /** Groups can be formatted to appear vertically. */
  vertical: PropTypes.bool,

  /** Groups can have their widths divided evenly. */
  widths: PropTypes.oneOf(SUI.WIDTHS),
}

export default ButtonGroup
