/** Options of `createPaginationItems()` as passed by users, numbers can be passed as strings. */
export interface RawPaginationOptions {
  activePage: number | string
  boundaryRange: number | string
  hideEllipsis?: boolean
  siblingRange: number | string
  totalPages: number | string
}

/** Options of `createPaginationItems()` after `typifyOptions()`. */
export interface PaginationOptions {
  activePage: number
  boundaryRange: number
  hideEllipsis: boolean
  siblingRange: number
  totalPages: number
}

/**
 * Checks the possibility of using simple range generation, if number of generated pages is equal
 * or greater than total pages to show.
 *
 * @param {object} options
 * @param {number} options.boundaryRange Number of always visible pages at the beginning and end.
 * @param {number} options.siblingRange Number of always visible pages before and after the current one.
 * @param {number} options.totalPages Total number of pages.
 * @return {boolean}
 */
export const isSimplePagination = ({
  boundaryRange,
  hideEllipsis,
  siblingRange,
  totalPages,
}: PaginationOptions) => {
  const boundaryRangeSize = 2 * boundaryRange
  const ellipsisSize = hideEllipsis ? 0 : 2
  const siblingRangeSize = 2 * siblingRange

  return 1 + ellipsisSize + siblingRangeSize + boundaryRangeSize >= totalPages
}

export const typifyOptions = ({
  activePage,
  boundaryRange,
  hideEllipsis,
  siblingRange,
  totalPages,
}: RawPaginationOptions): PaginationOptions => ({
  activePage: +activePage,
  boundaryRange: +boundaryRange,
  hideEllipsis: !!hideEllipsis,
  siblingRange: +siblingRange,
  totalPages: +totalPages,
})
