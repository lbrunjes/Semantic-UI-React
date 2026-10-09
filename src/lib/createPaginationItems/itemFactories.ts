export type PaginationItemType =
  'ellipsisItem' | 'firstItem' | 'prevItem' | 'pageItem' | 'nextItem' | 'lastItem'

/** An item of a pagination, see `createPaginationItems()`. */
export interface PaginationItemDescriptor {
  active: boolean
  type: PaginationItemType
  value: number
}

/** Creates a page item for a given page number. */
export type PageFactory = (pageNumber: number) => PaginationItemDescriptor

/**
 * @param {number} pageNumber
 * @return {Object}
 */
export const createEllipsisItem = (pageNumber: number): PaginationItemDescriptor => ({
  active: false,
  type: 'ellipsisItem',
  value: pageNumber,
})

/**
 * @return {Object}
 */
export const createFirstPage = (): PaginationItemDescriptor => ({
  active: false,
  type: 'firstItem',
  value: 1,
})

/**
 * @param {number} activePage
 * @return {Object}
 */
export const createPrevItem = (activePage: number): PaginationItemDescriptor => ({
  active: false,
  type: 'prevItem',
  value: Math.max(1, activePage - 1),
})

/**
 * @param {number} activePage
 * @return {function}
 */
export const createPageFactory =
  (activePage: number): PageFactory =>
  (pageNumber) => ({
    active: activePage === pageNumber,
    type: 'pageItem',
    value: pageNumber,
  })

/**
 * @param {number} activePage
 * @param {number} totalPages
 * @return {Object}
 */
export const createNextItem = (
  activePage: number,
  totalPages: number,
): PaginationItemDescriptor => ({
  active: false,
  type: 'nextItem',
  value: Math.min(activePage + 1, totalPages),
})

/**
 * @param {number} totalPages
 * @return {Object}
 */
export const createLastItem = (totalPages: number): PaginationItemDescriptor => ({
  active: false,
  type: 'lastItem',
  value: totalPages,
})
