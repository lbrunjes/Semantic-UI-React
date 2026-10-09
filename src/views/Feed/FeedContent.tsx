import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthand,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import FeedDate from './FeedDate'
import FeedExtra from './FeedExtra'
import FeedMeta from './FeedMeta'
import FeedSummary from './FeedSummary'
import type {
  ForwardRefComponent,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'
import type { FeedDateProps } from './FeedDate'
import type { FeedExtraProps } from './FeedExtra'
import type { FeedMetaProps } from './FeedMeta'
import type { FeedSummaryProps } from './FeedSummary'

export interface FeedContentProps extends StrictFeedContentProps {
  [key: string]: any
}

export interface StrictFeedContentProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** An event can contain a date. */
  date?: SemanticShorthandItem<FeedDateProps>

  /** Shorthand for FeedExtra with images. */
  extraImages?: SemanticShorthandItem<FeedExtraProps>

  /** Shorthand for FeedExtra with text. */
  extraText?: SemanticShorthandItem<FeedExtraProps>

  /** Shorthand for FeedMeta. */
  meta?: SemanticShorthandItem<FeedMetaProps>

  /** Shorthand for FeedSummary. */
  summary?: SemanticShorthandItem<FeedSummaryProps>
}

const FeedContent = React.forwardRef<HTMLDivElement, FeedContentProps>(function (props, ref) {
  const { children, className, content, extraImages, extraText, date, meta, summary } = props

  const classes = cx('content', className)
  const rest = getUnhandledProps(FeedContent, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {createShorthand(FeedDate, (val) => ({ content: val }), date, { autoGenerateKey: false })}
      {createShorthand(FeedSummary, (val) => ({ content: val }), summary, {
        autoGenerateKey: false,
      })}
      {content}
      {createShorthand(FeedExtra, (val) => ({ text: true, content: val }), extraText, {
        autoGenerateKey: false,
      })}
      {createShorthand(FeedExtra, (val) => ({ images: val }), extraImages, {
        autoGenerateKey: false,
      })}
      {createShorthand(FeedMeta, (val) => ({ content: val }), meta, { autoGenerateKey: false })}
    </ElementType>
  )
}) as ForwardRefComponent<FeedContentProps, HTMLDivElement>

FeedContent.displayName = 'FeedContent'
FeedContent.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** An event can contain a date. */
  date: customPropTypes.itemShorthand,

  /** Shorthand for FeedExtra with images. */
  extraImages: FeedExtra.propTypes.images,

  /** Shorthand for FeedExtra with text. */
  extraText: customPropTypes.itemShorthand,

  /** Shorthand for FeedMeta. */
  meta: customPropTypes.itemShorthand,

  /** Shorthand for FeedSummary. */
  summary: customPropTypes.itemShorthand,
}

export default FeedContent
