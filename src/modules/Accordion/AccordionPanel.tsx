import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { createShorthandFactory, customPropTypes } from '../../lib'
import AccordionTitle from './AccordionTitle'
import AccordionContent from './AccordionContent'
import type { SemanticShorthandItem } from '../../generic'
import type { AccordionContentProps } from './AccordionContent'
import type { AccordionTitleProps } from './AccordionTitle'

export interface AccordionPanelProps extends StrictAccordionPanelProps {
  [key: string]: any
}

export interface StrictAccordionPanelProps {
  /** Whether or not the title is in the open state. */
  active?: boolean

  /** A shorthand for Accordion.Content. */
  content?: SemanticShorthandItem<AccordionContentProps>

  /** A panel index. */
  index?: number | string

  /**
   * Called when a panel title is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {AccordionTitleProps} data - All item props.
   */
  onTitleClick?: (event: React.MouseEvent<HTMLDivElement>, data: AccordionTitleProps) => void

  /** A shorthand for Accordion.Title. */
  title?: SemanticShorthandItem<AccordionTitleProps>
}

/**
 * A panel sub-component for Accordion component.
 */
const AccordionPanel = class AccordionPanel extends Component<AccordionPanelProps> {
  handleTitleOverrides = (predefinedProps) => ({
    onClick: (e, titleProps) => {
      predefinedProps?.onClick?.(e, titleProps)
      this.props?.onTitleClick?.(e, titleProps)
    },
  })

  render() {
    const { active, content, index, title } = this.props

    return (
      <>
        {AccordionTitle.create(title, {
          autoGenerateKey: false,
          defaultProps: { active, index },
          overrideProps: this.handleTitleOverrides,
        })}
        {AccordionContent.create(content, {
          autoGenerateKey: false,
          defaultProps: { active },
        })}
      </>
    )
  }
}

AccordionPanel.propTypes = {
  /** Whether or not the title is in the open state. */
  active: PropTypes.bool,

  /** A shorthand for Accordion.Content. */
  content: customPropTypes.itemShorthand,

  /** A panel index. */
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**
   * Called when a panel title is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All item props.
   */
  onTitleClick: PropTypes.func,

  /** A shorthand for Accordion.Title. */
  title: customPropTypes.itemShorthand,
}

AccordionPanel.create = createShorthandFactory(AccordionPanel, null)

export default AccordionPanel as React.ComponentClass<AccordionPanelProps>
