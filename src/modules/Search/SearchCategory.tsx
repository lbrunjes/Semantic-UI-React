import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import SearchCategoryLayout from './SearchCategoryLayout'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'
import type { SearchCategoryLayoutProps } from './SearchCategoryLayout'
import type SearchResult from './SearchResult'

export interface SearchCategoryProps extends StrictSearchCategoryProps {
  [key: string]: any
}

export interface StrictSearchCategoryProps {
  /** An element type to render as (string or function). */
  as?: any

  /** The item currently selected by keyboard shortcut. */
  active?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Display name. */
  name?: string

  /**
   * Renders the SearchCategory layout.
   *
   * @param {object} props - The SearchCategoryLayout props object.
   * @returns {*} - Renderable SearchCategory layout.
   */
  layoutRenderer?: (
    props: Pick<SearchCategoryLayoutProps, 'categoryContent' | 'resultsContent'>,
  ) => React.ReactElement<any>

  /**
   * Renders the category contents.
   *
   * @param {object} props - The SearchCategory props object.
   * @returns {*} - Renderable category contents.
   */
  renderer?: (props: SearchCategoryProps) => React.ReactElement<any>

  /** Array of Search.Result props. */
  results?: (typeof SearchResult)[]
}

const SearchCategory = React.forwardRef<HTMLDivElement, SearchCategoryProps>(function (props, ref) {
  const {
    active,
    children,
    className,
    content,
    layoutRenderer = SearchCategoryLayout,
    renderer = ({ name }: SearchCategoryProps) => name,
  } = props

  const classes = cx(getKeyOnly(active, 'active'), 'category', className)
  const rest = getUnhandledProps(SearchCategory, props)
  const ElementType = getComponentType(props)

  const categoryContent = renderer(props)
  const resultsContent = childrenUtils.isNil(children) ? content : children

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {layoutRenderer({ categoryContent, resultsContent })}
    </ElementType>
  )
}) as ForwardRefComponent<SearchCategoryProps, HTMLDivElement>

SearchCategory.displayName = 'SearchCategory'
SearchCategory.handledProps = [
  'active',
  'as',
  'children',
  'className',
  'content',
  'layoutRenderer',
  'name',
  'renderer',
  'results',
]

export default SearchCategory
