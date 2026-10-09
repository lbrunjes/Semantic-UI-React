import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  useEventCallback,
} from '../../lib'
import Icon from '../../elements/Icon'
import type { IconProps } from '../../elements/Icon'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'

export interface AccordionTitleProps extends StrictAccordionTitleProps {
  [key: string]: any
}

export interface StrictAccordionTitleProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Whether or not the title is in the open state. */
  active?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for Icon. */
  icon?: SemanticShorthandItem<IconProps>

  /** AccordionTitle index inside Accordion. */
  index?: number | string

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>, data: AccordionTitleProps) => void
}

/**
 * A title sub-component for Accordion component.
 */
const AccordionTitle = React.forwardRef<HTMLDivElement, AccordionTitleProps>(function (props, ref) {
  const { active, children, className, content, icon } = props

  const classes = cx(getKeyOnly(active, 'active'), 'title', className)
  const rest = getUnhandledProps(AccordionTitle, props)
  const ElementType = getComponentType(props)
  const iconValue = icon == null ? 'dropdown' : icon

  const handleClick = useEventCallback((e) => {
    props?.onClick?.(e, props)
  })

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} onClick={handleClick} ref={ref}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} onClick={handleClick} ref={ref}>
      {Icon.create(iconValue, { autoGenerateKey: false })}
      {content}
    </ElementType>
  )
}) as ForwardRefComponent<AccordionTitleProps, HTMLDivElement>

AccordionTitle.displayName = 'AccordionTitle'
AccordionTitle.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Whether or not the title is in the open state. */
  active: PropTypes.bool,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Shorthand for Icon. */
  icon: customPropTypes.itemShorthand,

  /** AccordionTitle index inside Accordion. */
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick: PropTypes.func,
}
AccordionTitle.create = createShorthandFactory(AccordionTitle, (content) => ({ content }))

export default AccordionTitle
