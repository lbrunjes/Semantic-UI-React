import * as React from 'react'

import { cx, getComponentType, getUnhandledProps, getKeyOnly, keyboardKey } from '../../lib'
import type { ForwardRefComponent } from '../../generic'

export interface RatingIconProps extends StrictRatingIconProps {
  [key: string]: any
}

export interface StrictRatingIconProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Indicates activity of an icon. */
  active?: boolean

  /** Additional classes. */
  className?: string

  /** An index of icon inside Rating. */
  index?: number

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed rating.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>, data: RatingIconProps) => void

  /**
   * Called on keyup.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed rating.
   */
  onKeyUp?: (event: React.MouseEvent<HTMLElement>, data: RatingIconProps) => void

  /**
   * Called on mouseenter.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed rating.
   */
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>, data: RatingIconProps) => void

  /** Indicates selection of an icon. */
  selected?: boolean
}

/**
 * An internal icon sub-component for Rating component
 */
const RatingIcon = React.forwardRef<HTMLElement, RatingIconProps>(function (props, ref) {
  const { active, className, selected } = props

  const classes = cx(
    getKeyOnly(active, 'active'),
    getKeyOnly(selected, 'selected'),
    'icon',
    className,
  )
  const rest = getUnhandledProps(RatingIcon, props)
  const ElementType = getComponentType(props, { defaultAs: 'i' })

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    props?.onClick?.(e, props)
  }

  // Heads up! The public `onKeyUp`/`onClick` typings declare a MouseEvent, but this handler
  // receives a KeyboardEvent.
  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    props?.onKeyUp?.(e as any, props)

    switch (keyboardKey.getCode(e)) {
      case keyboardKey.Enter:
      case keyboardKey.Spacebar:
        e.preventDefault()
        props?.onClick?.(e as any, props)
        break
      default:
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    props?.onMouseEnter?.(e, props)
  }

  return (
    <ElementType
      role='radio'
      {...rest}
      className={classes}
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      onMouseEnter={handleMouseEnter}
      ref={ref}
    />
  )
}) as ForwardRefComponent<RatingIconProps, HTMLElement>

RatingIcon.displayName = 'RatingIcon'
RatingIcon.handledProps = [
  'active',
  'as',
  'className',
  'index',
  'onClick',
  'onKeyUp',
  'onMouseEnter',
  'selected',
]

export default RatingIcon
