import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  numberToWordMap,
  SUI,
  getKeyOnly,
  getKeyOrValueAndKey,
  getValueAndKey,
  getWidthProp,
} from '../../lib'
import Step from './Step'
import { keys, map, pickBy, values, without } from '../../lib/utils'
import type {
  ForwardRefComponent,
  SemanticShorthandCollection,
  SemanticShorthandContent,
} from '../../generic'
import type { StepProps } from './Step'

export interface StepGroupProps extends StrictStepGroupProps {
  [key: string]: any
}

export interface StrictStepGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Steps can be attached to other elements. */
  attached?: boolean | 'bottom' | 'top'

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A fluid step takes up the width of its container. */
  fluid?: boolean

  /** Shorthand array of props for Step. */
  items?: SemanticShorthandCollection<StepProps>

  /** A step can show a ordered sequence of steps. */
  ordered?: boolean

  /** Steps can have different sizes. */
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive'

  /** A step can stack vertically only on smaller screens. */
  stackable?: 'tablet'

  /** A step can prevent itself from stacking on mobile. */
  unstackable?: boolean

  /** A step can be displayed stacked vertically. */
  vertical?: boolean

  /** Steps can be divided evenly inside their parent. */
  widths?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | 'one'
    | 'two'
    | 'three'
    | 'four'
    | 'five'
    | 'six'
    | 'seven'
    | 'eight'
}

const numberMap = pickBy(numberToWordMap, (val, key) => key <= 8)

/**
 * A set of steps.
 */
const StepGroup = React.forwardRef<HTMLDivElement, StepGroupProps>(function (props, ref) {
  const {
    attached,
    children,
    className,
    content,
    fluid,
    items,
    ordered,
    size,
    stackable,
    unstackable,
    vertical,
    widths,
  } = props
  const classes = cx(
    'ui',
    size,
    getKeyOnly(fluid, 'fluid'),
    getKeyOnly(ordered, 'ordered'),
    getKeyOnly(unstackable, 'unstackable'),
    getKeyOnly(vertical, 'vertical'),
    getKeyOrValueAndKey(attached, 'attached'),
    getValueAndKey(stackable, 'stackable'),
    getWidthProp(widths),
    'steps',
    className,
  )
  const rest = getUnhandledProps(StepGroup, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }
  if (!childrenUtils.isNil(content)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {content}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {map(items, (item) => Step.create(item))}
    </ElementType>
  )
}) as ForwardRefComponent<StepGroupProps, HTMLDivElement>

StepGroup.displayName = 'StepGroup'
StepGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Steps can be attached to other elements. */
  attached: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['top', 'bottom'])]),

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** A fluid step takes up the width of its container. */
  fluid: PropTypes.bool,

  /** Shorthand array of props for Step. */
  items: customPropTypes.collectionShorthand,

  /** A step can show a ordered sequence of steps. */
  ordered: PropTypes.bool,

  /** Steps can have different sizes. */
  size: PropTypes.oneOf(without(SUI.SIZES, 'medium')),

  /** A step can stack vertically only on smaller screens. */
  stackable: PropTypes.oneOf(['tablet']),

  /** A step can prevent itself from stacking on mobile. */
  unstackable: PropTypes.bool,

  /** A step can be displayed stacked vertically. */
  vertical: PropTypes.bool,

  /** Steps can be divided evenly inside their parent. */
  widths: PropTypes.oneOf([
    ...keys(numberMap),
    ...keys(numberMap).map(Number),
    ...values(numberMap),
  ]),
}

export default StepGroup
