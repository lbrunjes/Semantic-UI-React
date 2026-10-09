import PropTypes from 'prop-types'
import * as React from 'react'

import { createShorthandFactory, cx, getUnhandledProps, SUI, getVerticalAlignProp } from '../../lib'
import Icon from '../Icon/Icon'
import type { ForwardRefComponent, SemanticVERTICALALIGNMENTS } from '../../generic'
import type { StrictIconProps } from '../Icon'

export interface ListIconProps extends StrictListIconProps {
  [key: string]: any
}

export interface StrictListIconProps extends StrictIconProps {
  /** Additional classes. */
  className?: string

  /** An element inside a list can be vertically aligned. */
  verticalAlign?: SemanticVERTICALALIGNMENTS
}

/**
 * A list item can contain an icon.
 */
const ListIcon = React.forwardRef<HTMLElement, ListIconProps>(function (props, ref) {
  const { className, verticalAlign } = props
  const classes = cx(getVerticalAlignProp(verticalAlign), className)
  const rest = getUnhandledProps(ListIcon, props)

  return <Icon {...rest} className={classes} ref={ref} />
}) as ForwardRefComponent<ListIconProps, HTMLElement>

ListIcon.displayName = 'ListIcon'
ListIcon.propTypes = {
  /** Additional classes. */
  className: PropTypes.string,

  /** An element inside a list can be vertically aligned. */
  verticalAlign: PropTypes.oneOf(SUI.VERTICAL_ALIGNMENTS),
}

ListIcon.create = createShorthandFactory(ListIcon, (name) => ({ name }))

export default ListIcon
