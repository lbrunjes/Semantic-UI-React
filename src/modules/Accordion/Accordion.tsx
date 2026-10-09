import PropTypes from 'prop-types'
import * as React from 'react'

import { cx, getUnhandledProps, getKeyOnly } from '../../lib'
import AccordionAccordion from './AccordionAccordion'
import AccordionContent from './AccordionContent'
import AccordionPanel from './AccordionPanel'
import AccordionTitle from './AccordionTitle'
import type { StrictAccordionAccordionProps } from './AccordionAccordion'
import type { ForwardRefComponent } from '../../generic'

export interface AccordionProps extends StrictAccordionProps {
  [key: string]: any
}

export interface StrictAccordionProps extends StrictAccordionAccordionProps {
  /** Additional classes. */
  className?: string

  /** Format to take up the width of its container. */
  fluid?: boolean

  /** Format for dark backgrounds. */
  inverted?: boolean

  /** Adds some basic styling to accordion panels. */
  styled?: boolean
}

/**
 * An accordion allows users to toggle the display of sections of content.
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function (props, ref) {
  const { className, fluid, inverted, styled } = props

  const classes = cx(
    'ui',
    getKeyOnly(fluid, 'fluid'),
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(styled, 'styled'),
    className,
  )
  const rest = getUnhandledProps(Accordion, props)

  // TODO: extract behavior into useAccordion() hook instead of "AccordionAccordion" component
  return <AccordionAccordion {...rest} className={classes} ref={ref} />
}) as ForwardRefComponent<AccordionProps, HTMLDivElement> & {
  Accordion: typeof AccordionAccordion
  Content: typeof AccordionContent
  Panel: typeof AccordionPanel
  Title: typeof AccordionTitle
}

Accordion.displayName = 'Accordion'
Accordion.propTypes = {
  /** Additional classes. */
  className: PropTypes.string,

  /** Format to take up the width of its container. */
  fluid: PropTypes.bool,

  /** Format for dark backgrounds. */
  inverted: PropTypes.bool,

  /** Adds some basic styling to accordion panels. */
  styled: PropTypes.bool,
}

Accordion.Accordion = AccordionAccordion
Accordion.Content = AccordionContent
Accordion.Panel = AccordionPanel
Accordion.Title = AccordionTitle

export default Accordion
