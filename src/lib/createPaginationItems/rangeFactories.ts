import { createInnerPrefix, createInnerSuffix } from './suffixFactories'
import type { PageFactory, PaginationItemDescriptor } from './itemFactories'
import type { PaginationOptions } from './paginationUtils'
import { map, range } from '../utils'

export const createSimpleRange = (
  start: number,
  end: number,
  pageFactory: PageFactory,
): PaginationItemDescriptor[] => map(range(start, end + 1), pageFactory)

export const createComplexRange = (
  options: PaginationOptions,
  pageFactory: PageFactory,
): PaginationItemDescriptor[] => {
  const { activePage, boundaryRange, hideEllipsis, siblingRange, totalPages } = options

  const ellipsisSize = hideEllipsis ? 0 : 1
  const firstGroupEnd = boundaryRange
  const firstGroup = createSimpleRange(1, firstGroupEnd, pageFactory)

  const lastGroupStart = totalPages + 1 - boundaryRange
  const lastGroup = createSimpleRange(lastGroupStart, totalPages, pageFactory)

  const innerGroupStart = Math.min(
    Math.max(activePage - siblingRange, firstGroupEnd + ellipsisSize + 1),
    lastGroupStart - ellipsisSize - 2 * siblingRange - 1,
  )
  const innerGroupEnd = innerGroupStart + 2 * siblingRange
  const innerGroup = createSimpleRange(innerGroupStart, innerGroupEnd, pageFactory)

  // `filter(Boolean)` removes the `false` values of hidden ellipsis items
  return [
    ...firstGroup,
    !hideEllipsis && createInnerPrefix(firstGroupEnd, innerGroupStart, pageFactory),
    ...innerGroup,
    !hideEllipsis && createInnerSuffix(innerGroupEnd, lastGroupStart, pageFactory),
    ...lastGroup,
  ].filter(Boolean) as PaginationItemDescriptor[]
}
