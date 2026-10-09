import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
  useAutoControlledValue,
  useEventCallback,
} from '../../lib'
import AccordionPanel from './AccordionPanel'
import { includes, map, without } from '../../lib/utils'
import type {
  ForwardRefComponent,
  SemanticShorthandCollection,
  SemanticShorthandItem,
} from '../../generic'
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
function isIndexActive(
  exclusive: boolean,
  activeIndex: number | number[],
  itemIndex: number | string | undefined,
) {
  return exclusive ? activeIndex === itemIndex : includes(activeIndex, itemIndex)
}

/**
 * @param {Boolean} exclusive
 * @param {Number} activeIndex
 * @param {Number} itemIndex
 */
function computeNewIndex(
  exclusive: boolean,
  activeIndex: number | number[],
  itemIndex: number | string | undefined,
) {
  if (exclusive) {
    return itemIndex === activeIndex ? -1 : itemIndex
  }

  // check to see if index is in array, and remove it, if not then add it
  if (includes(activeIndex, itemIndex)) {
    return without(activeIndex, itemIndex)
  }

  // `activeIndex` is an array when `exclusive` is false
  return [...(activeIndex as number[]), itemIndex]
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

    const handleTitleClick = useEventCallback(
      (e: React.MouseEvent<HTMLDivElement>, titleProps: AccordionTitleProps) => {
        const { index } = titleProps

        setActiveIndex(computeNewIndex(exclusive, activeIndex, index))
        props?.onTitleClick?.(e, titleProps)
      },
    )

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
          ? map(panels, (panel: SemanticShorthandItem<AccordionPanelProps>, index: number) =>
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
AccordionAccordion.handledProps = [
  'activeIndex',
  'as',
  'children',
  'className',
  'defaultActiveIndex',
  'exclusive',
  'onTitleClick',
  'panels',
]

AccordionAccordion.create = createShorthandFactory(AccordionAccordion, (content) => ({ content }))

export default AccordionAccordion
