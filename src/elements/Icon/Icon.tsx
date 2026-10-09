import PropTypes from 'prop-types'
import * as React from 'react'

import {
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  useEventCallback,
  getKeyOnly,
  getKeyOrValueAndKey,
  getValueAndKey,
} from '../../lib'
import IconGroup from './IconGroup'
import { without } from '../../lib/utils'
import type { ForwardRefComponent, SemanticCOLORS, SemanticICONS } from '../../generic'

export type IconSizeProp = 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive'

export type IconCorner = 'bottom right' | 'top right' | 'top left' | 'bottom left'

export interface IconProps extends StrictIconProps {
  [key: string]: any
}

export interface StrictIconProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Formatted to appear bordered */
  bordered?: boolean

  /** Icon can formatted to appear circular. */
  circular?: boolean

  /** Additional classes. */
  className?: string

  /** Color of the icon. */
  color?: SemanticCOLORS

  /** Icons can display a smaller corner icon. */
  corner?: boolean | IconCorner

  /** Show that the icon is inactive. */
  disabled?: boolean

  /** Fitted, without space to left or right of Icon. */
  fitted?: boolean

  /** Icon can be flipped. */
  flipped?: 'horizontally' | 'vertically'

  /** Formatted to have its colors inverted for contrast. */
  inverted?: boolean

  /** Icon can be formatted as a link. */
  link?: boolean

  /** Icon can be used as a simple loader. */
  loading?: boolean

  /** Name of the icon. */
  name?: SemanticICONS

  /** Icon can rotated. */
  rotated?: 'clockwise' | 'counterclockwise'

  /** Size of the icon. */
  size?: IconSizeProp

  /** Icon can have an aria hidden. */
  'aria-hidden'?: string

  /** Icon can have an aria label. */
  'aria-label'?: string
}

function getAriaProps(props) {
  const ariaOptions = {}
  const { 'aria-label': ariaLabel, 'aria-hidden': ariaHidden } = props

  if (ariaLabel == null) {
    ariaOptions['aria-hidden'] = 'true'
  } else {
    ariaOptions['aria-label'] = ariaLabel
  }

  if (ariaHidden != null) {
    ariaOptions['aria-hidden'] = ariaHidden
  }

  return ariaOptions
}

/**
 * An icon is a glyph used to represent something else.
 * @see Image
 */
const Icon = React.forwardRef<HTMLElement, IconProps>(function (props, ref) {
  const {
    bordered,
    circular,
    className,
    color,
    corner,
    disabled,
    fitted,
    flipped,
    inverted,
    link,
    loading,
    name,
    rotated,
    size,
  } = props

  const classes = cx(
    color,
    name,
    size,
    getKeyOnly(bordered, 'bordered'),
    getKeyOnly(circular, 'circular'),
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(fitted, 'fitted'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(link, 'link'),
    getKeyOnly(loading, 'loading'),
    getKeyOrValueAndKey(corner, 'corner'),
    getValueAndKey(flipped, 'flipped'),
    getValueAndKey(rotated, 'rotated'),
    'icon',
    className,
  )

  const rest = getUnhandledProps(Icon, props)
  const ElementType = getComponentType(props, { defaultAs: 'i' })
  const ariaProps = getAriaProps(props)

  const handleClick = useEventCallback((e) => {
    if (disabled) {
      e.preventDefault()
      return
    }

    // eslint-disable-next-line react/prop-types -- a DOM event handler, it is not declared in propTypes to be passed with other HTML props
    props?.onClick?.(e, props)
  })

  return (
    <ElementType {...rest} {...ariaProps} className={classes} onClick={handleClick} ref={ref} />
  )
}) as ForwardRefComponent<IconProps, HTMLElement> & {
  Group: typeof IconGroup
}

Icon.displayName = 'Icon'
Icon.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Formatted to appear bordered. */
  bordered: PropTypes.bool,

  /** Icon can formatted to appear circular. */
  circular: PropTypes.bool,

  /** Additional classes. */
  className: PropTypes.string,

  /** Color of the icon. */
  color: PropTypes.oneOf(SUI.COLORS),

  /** Icons can display a smaller corner icon. */
  corner: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['top left', 'top right', 'bottom left', 'bottom right']),
  ]),

  /** Show that the icon is inactive. */
  disabled: PropTypes.bool,

  /** Fitted, without space to left or right of Icon. */
  fitted: PropTypes.bool,

  /** Icon can be flipped. */
  flipped: PropTypes.oneOf(['horizontally', 'vertically']),

  /** Formatted to have its colors inverted for contrast. */
  inverted: PropTypes.bool,

  /** Icon can be formatted as a link. */
  link: PropTypes.bool,

  /** Icon can be used as a simple loader. */
  loading: PropTypes.bool,

  /** Name of the icon. */
  name: customPropTypes.suggest(SUI.ALL_ICONS_IN_ALL_CONTEXTS),

  /** Icon can rotated. */
  rotated: PropTypes.oneOf(['clockwise', 'counterclockwise']),

  /** Size of the icon. */
  size: PropTypes.oneOf(without(SUI.SIZES, 'medium')),

  /** Icon can have an aria label. */
  'aria-hidden': PropTypes.string,

  /** Icon can have an aria label. */
  'aria-label': PropTypes.string,
}

// Heads up!
// .create() factories should be defined on exported component to be visible as static properties
const MemoIcon = React.memo(Icon) as typeof Icon

MemoIcon.Group = IconGroup
MemoIcon.create = createShorthandFactory(MemoIcon, (value) => ({ name: value }))

export default MemoIcon
