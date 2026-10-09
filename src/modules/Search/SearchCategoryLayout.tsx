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

SearchCategoryLayout.handledProps = ['categoryContent', 'resultsContent']

export default SearchCategoryLayout
