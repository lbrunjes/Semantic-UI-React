import PropTypes from 'prop-types'
import * as React from 'react'

export interface SearchCategoryLayoutProps extends StrictSearchCategoryLayoutProps {
  [key: string]: any
}

export interface StrictSearchCategoryLayoutProps {
  /** The rendered category content */
  categoryContent: React.ReactElement<any>

  /** The rendered results content */
  resultsContent: React.ReactElement<any>
}

const SearchCategoryLayout: React.FC<SearchCategoryLayoutProps> = function SearchCategoryLayout(
  props,
) {
  const { categoryContent, resultsContent } = props

  return (
    <>
      <div className='name'>{categoryContent}</div>
      <div className='results'>{resultsContent}</div>
    </>
  )
}

SearchCategoryLayout.propTypes = {
  /** The rendered category content */
  categoryContent: PropTypes.element.isRequired,

  /** The rendered results content */
  resultsContent: PropTypes.element.isRequired,
}

export default SearchCategoryLayout
