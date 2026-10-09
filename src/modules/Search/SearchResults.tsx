import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface SearchResultsProps extends StrictSearchResultsProps {
  [key: string]: any
}

export interface StrictSearchResultsProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

const SearchResults = React.forwardRef<HTMLDivElement, SearchResultsProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('results transition', className)
  const rest = getUnhandledProps(SearchResults, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<SearchResultsProps, HTMLDivElement>

SearchResults.displayName = 'SearchResults'
SearchResults.handledProps = ['as', 'children', 'className', 'content']

export default SearchResults
