import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  useAutoControlledValue,
  useEventCallback,
} from '../../lib'
import AccordionPanel from './AccordionPanel'
import { includes, map, without } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandCollection } from '../../generic'
import type { AccordionPanelProps } from './AccordionPanel'
import type { AccordionTitleProps } from './AccordionTitle'

export interface AccordionAccordionProps extends StrictAccordionAccordionProps {
  [key: string]: any
}

export interface StrictAccordionAccordionProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Index of the currently active panel. */
  activeIndex?: number | number[]

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Initial activeIndex value. */
  defaultActiveIndex?: number | number[]

  /** Only allow one panel open at a time. */
  exclusive?: boolean

  /**
   * Called when a panel title is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {AccordionTitleProps} data - All item props.
   */
  onTitleClick?: (event: React.MouseEvent<HTMLDivElement>, data: AccordionTitleProps) => void

  /** Shorthand array of props for Accordion. */
  panels?: SemanticShorthandCollection<AccordionPanelProps>
}

/**
 * @param {Boolean} exclusive
 * @param {Number} activeIndex
 * @param {Number} itemIndex
 */
function isIndexActive(exclusive, activeIndex, itemIndex) {
  return exclusive ? activeIndex === itemIndex : includes(activeIndex, itemIndex)
}

/**
 * @param {Boolean} exclusive
 * @param {Number} activeIndex
 * @param {Number} itemIndex
 */
function computeNewIndex(exclusive, activeIndex, itemIndex) {
  if (exclusive) {
    return itemIndex === activeIndex ? -1 : itemIndex
  }

  // check to see if index is in array, and remove it, if not then add it
  if (includes(activeIndex, itemIndex)) {
    return without(activeIndex, itemIndex)
  }

  return [...activeIndex, itemIndex]
}

/**
 * An Accordion can contain sub-accordions.
 */
const AccordionAccordion = React.forwardRef<HTMLDivElement, AccordionAccordionProps>(
  function (props, ref) {
    const { className, children, exclusive = true, panels } = props
    const [activeIndex, setActiveIndex] = useAutoControlledValue({
      state: props.activeIndex,
      defaultState: props.defaultActiveIndex,
      initialState: () => (exclusive ? -1 : []),
    })

    const classes = cx('accordion', className)
    const rest = getUnhandledProps(AccordionAccordion, props)
    const ElementType = getComponentType(props)

    const handleTitleClick = useEventCallback((e, titleProps) => {
      const { index } = titleProps

      setActiveIndex(computeNewIndex(exclusive, activeIndex, index))
      props?.onTitleClick?.(e, titleProps)
    })

    if (process.env.NODE_ENV !== 'production') {
      // Following eslint error is ignored because process.env.NODE_ENV does not change during runtime,
      // so it is not actually a problem because the useEffect will be called either always or never
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        /* eslint-disable no-console */
        if (exclusive && typeof activeIndex !== 'number') {
          console.error('`activeIndex` must be a number if `exclusive` is true')
        } else if (!exclusive && !Array.isArray(activeIndex)) {
          console.error('`activeIndex` must be an array if `exclusive` is false')
        }
        /* eslint-enable no-console */
      }, [exclusive, activeIndex])
    }

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children)
          ? map(panels, (panel, index) =>
              AccordionPanel.create(panel, {
                defaultProps: {
                  active: isIndexActive(exclusive, activeIndex, index),
                  index,
                  onTitleClick: handleTitleClick,
                },
              }),
            )
          : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<AccordionAccordionProps, HTMLDivElement>

AccordionAccordion.displayName = 'AccordionAccordion'
AccordionAccordion.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Index of the currently active panel. */
  activeIndex: customPropTypes.every([
    customPropTypes.disallow(['children']),
    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
  ]),

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Initial activeIndex value. */
  defaultActiveIndex: customPropTypes.every([
    customPropTypes.disallow(['children']),
    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
  ]),

  /** Only allow one panel open at a time. */
  exclusive: PropTypes.bool,

  /**
   * Called when a panel title is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All item props.
   */
  onTitleClick: customPropTypes.every([customPropTypes.disallow(['children']), PropTypes.func]),

  /** Shorthand array of props for Accordion. */
  panels: customPropTypes.every([
    customPropTypes.disallow(['children']),
    PropTypes.arrayOf(
      PropTypes.shape({
        content: customPropTypes.itemShorthand,
        title: customPropTypes.itemShorthand,
      }),
    ),
  ]),
}

AccordionAccordion.create = createShorthandFactory(AccordionAccordion, (content) => ({ content }))

export default AccordionAccordion
