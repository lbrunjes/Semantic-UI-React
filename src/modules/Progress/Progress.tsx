import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createHTMLDivision,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  SUI,
  getKeyOnly,
  getValueAndKey,
} from '../../lib'
import { clamp, round, without } from '../../lib/utils'
import type {
  ForwardRefComponent,
  HtmlLabelProps,
  SemanticCOLORS,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'

export interface ProgressProps extends StrictProgressProps {
  [key: string]: any
}

export interface StrictProgressProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A progress bar can show activity. */
  active?: boolean

  /** A progress bar can attach to and show the progress of an element (i.e. Card or Segment). */
  attached?: 'top' | 'bottom'

  /** Whether success state should automatically trigger when progress completes. */
  autoSuccess?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** A progress bar can have different colors. */
  color?: SemanticCOLORS

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A progress bar be disabled. */
  disabled?: boolean

  /** A progress bar can show a error state. */
  error?: boolean

  /** An indicating progress bar visually indicates the current level of progress of a task. */
  indicating?: boolean

  /** A progress bar can have its colors inverted. */
  inverted?: boolean

  /** Can be set to either to display progress as percent or ratio. */
  label?: SemanticShorthandItem<HtmlLabelProps>

  /** Current percent complete. */
  percent?: number | string

  /** Decimal point precision for calculated progress. */
  precision?: number

  /** A progress bar can contain a text value indicating current progress. */
  progress?: boolean | 'percent' | 'ratio' | 'value'

  /** A progress bar can vary in size. */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'big'

  /** A progress bar can show a success state. */
  success?: boolean

  /** For use with value. Together, these will calculate the percent. Mutually excludes percent. */
  total?: number | string

  /** For use with total. Together, these will calculate the percent. Mutually excludes percent. */
  value?: number | string

  /** A progress bar can show a warning state. */
  warning?: boolean
}

/**
 * @param {Number|String} percent
 * @param {Number|String} total
 * @param {Number|String} value
 *
 * @return {Number|String}
 */
function calculatePercent(percent, total, value) {
  if (percent !== undefined) {
    return percent
  }

  if (total !== undefined && value !== undefined) {
    return (value / total) * 100
  }

  return 0
}

/**
 * @param {Number|String} percent
 * @param {Number|String} total
 * @param {Number|String} value
 * @param {Boolean|'percent'|'ratio'|'value'} progress
 * @param {Number} precision
 *
 * @return {Number}
 */
function getPercent(percent, total, value, progress, precision) {
  const clampedPercent = clamp(calculatePercent(percent, total, value), 0, 100)

  if (total !== undefined && value !== undefined && progress === 'value') {
    return (value / total) * 100
  }

  if (progress === 'value') {
    return value
  }

  if (precision === undefined) {
    return clampedPercent
  }

  return round(clampedPercent, precision)
}

/**
 * A progress bar shows the progression of a task.
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function (props, ref) {
  const {
    active,
    autoSuccess,
    attached,
    children,
    className,
    color,
    content,
    disabled,
    error,
    indicating,
    inverted,
    label,
    percent,
    precision,
    progress,
    total,
    size,
    success,
    value,
    warning,
  } = props

  const calculatedPercent = getPercent(percent, total, value, progress, precision) || 0
  const isAutoSuccess = autoSuccess && (percent >= 100 || value >= total)

  const computeValueText = () => {
    if (progress === 'value') {
      return value
    }

    if (progress === 'ratio') {
      return `${value}/${total}`
    }

    return `${calculatedPercent}%`
  }

  const renderLabel = () => {
    if (!childrenUtils.isNil(children)) {
      return <div className='label'>{children}</div>
    }

    if (!childrenUtils.isNil(content)) {
      return <div className='label'>{content}</div>
    }

    return createHTMLDivision(label, {
      autoGenerateKey: false,
      defaultProps: { className: 'label' },
    })
  }

  const renderProgress = () => {
    if (!progress && precision === undefined) {
      return
    }

    return <div className='progress'>{computeValueText()}</div>
  }

  const classes = cx(
    'ui',
    color,
    size,
    getKeyOnly(active || indicating, 'active'),
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(error, 'error'),
    getKeyOnly(indicating, 'indicating'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(success || isAutoSuccess, 'success'),
    getKeyOnly(warning, 'warning'),
    getValueAndKey(attached, 'attached'),
    'progress',
    className,
  )
  const rest = getUnhandledProps(Progress, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType
      {...rest}
      className={classes}
      data-percent={Math.floor(calculatedPercent)}
      ref={ref}
    >
      <div className='bar' style={{ width: `${calculatedPercent}%` }}>
        {renderProgress()}
      </div>
      {renderLabel()}
    </ElementType>
  )
}) as ForwardRefComponent<ProgressProps, HTMLDivElement>

Progress.displayName = 'Progress'
Progress.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** A progress bar can show activity. */
  active: PropTypes.bool,

  /** A progress bar can attach to and show the progress of an element (i.e. Card or Segment). */
  attached: PropTypes.oneOf(['top', 'bottom']),

  /** Whether success state should automatically trigger when progress completes. */
  autoSuccess: PropTypes.bool,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** A progress bar can have different colors. */
  color: PropTypes.oneOf(SUI.COLORS),

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** A progress bar be disabled. */
  disabled: PropTypes.bool,

  /** A progress bar can show a error state. */
  error: PropTypes.bool,

  /** An indicating progress bar visually indicates the current level of progress of a task. */
  indicating: PropTypes.bool,

  /** A progress bar can have its colors inverted. */
  inverted: PropTypes.bool,

  /** Can be set to either to display progress as percent or ratio. */
  label: customPropTypes.itemShorthand,

  /** Current percent complete. */
  percent: customPropTypes.every([
    customPropTypes.disallow(['total', 'value']),
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ]),

  /** Decimal point precision for calculated progress. */
  precision: PropTypes.number,

  /** A progress bar can contain a text value indicating current progress. */
  progress: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['percent', 'ratio', 'value'])]),

  /** A progress bar can vary in size. */
  size: PropTypes.oneOf(without(SUI.SIZES, 'mini', 'huge', 'massive')),

  /** A progress bar can show a success state. */
  success: PropTypes.bool,

  /** For use with value. Together, these will calculate the percent. Mutually excludes percent. */
  total: customPropTypes.every([
    customPropTypes.demand(['value']),
    customPropTypes.disallow(['percent']),
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ]),

  /** For use with total. Together, these will calculate the percent. Mutually excludes percent. */
  value: customPropTypes.every([
    customPropTypes.disallow(['percent']),
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ]),

  /** A progress bar can show a warning state. */
  warning: PropTypes.bool,
}

export default Progress
