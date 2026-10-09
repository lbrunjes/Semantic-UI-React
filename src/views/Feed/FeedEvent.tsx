import PropTypes from 'prop-types'
import * as React from 'react'

import {
  createShorthand,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import FeedContent from './FeedContent'
import FeedLabel from './FeedLabel'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { FeedContentProps } from './FeedContent'
import type { FeedDateProps } from './FeedDate'
import type { FeedLabelProps } from './FeedLabel'
import type { FeedMetaProps } from './FeedMeta'
import type { FeedSummaryProps } from './FeedSummary'
import type { FeedExtraProps } from './FeedExtra'

export interface FeedEventProps extends StrictFeedEventProps {
  [key: string]: any
}

export interface StrictFeedEventProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for FeedContent. */
  content?: SemanticShorthandItem<FeedContentProps>

  /** Shorthand for FeedDate. */
  date?: SemanticShorthandItem<FeedDateProps>

  /** Shorthand for FeedExtra with images. */
  extraImages?: SemanticShorthandItem<FeedExtraProps>

  /** Shorthand for FeedExtra with content. */
  extraText?: SemanticShorthandItem<FeedExtraProps>

  /** An event can contain icon label. */
  icon?: SemanticShorthandItem<FeedLabelProps>

  /** An event can contain image label. */
  image?: SemanticShorthandItem<FeedLabelProps>

  /** Shorthand for FeedMeta. */
  meta?: SemanticShorthandItem<FeedMetaProps>

  /** Shorthand for FeedSummary. */
  summary?: SemanticShorthandItem<FeedSummaryProps>
}

/**
 * A feed contains an event.
 */
const FeedEvent = React.forwardRef<HTMLDivElement, FeedEventProps>(function (props, ref) {
  const { content, children, className, date, extraImages, extraText, image, icon, meta, summary } =
    props

  const classes = cx('event', className)
  const rest = getUnhandledProps(FeedEvent, props)
  const ElementType = getComponentType(props)

  const hasContentProp = content || date || extraImages || extraText || meta || summary
  const contentProps = { content, date, extraImages, extraText, meta, summary }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {createShorthand(FeedLabel, (val) => ({ icon: val }), icon, { autoGenerateKey: false })}
      {createShorthand(FeedLabel, (val) => ({ image: val }), image, { autoGenerateKey: false })}
      {hasContentProp && <FeedContent {...contentProps} />}
      {children}
    </ElementType>
  )
}) as ForwardRefComponent<FeedEventProps, HTMLDivElement>

FeedEvent.displayName = 'FeedEvent'
FeedEvent.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for FeedContent. */
  content: customPropTypes.itemShorthand,

  /** Shorthand for FeedDate. */
  date: customPropTypes.itemShorthand,

  /** Shorthand for FeedExtra with images. */
  extraImages: customPropTypes.itemShorthand,

  /** Shorthand for FeedExtra with content. */
  extraText: customPropTypes.itemShorthand,

  /** An event can contain icon label. */
  icon: customPropTypes.itemShorthand,

  /** An event can contain image label. */
  image: customPropTypes.itemShorthand,

  /** Shorthand for FeedMeta. */
  meta: customPropTypes.itemShorthand,

  /** Shorthand for FeedSummary. */
  summary: customPropTypes.itemShorthand,
}

export default FeedEvent
