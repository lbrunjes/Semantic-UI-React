import { createEllipsisItem, type PageFactory } from './itemFactories'

export const createInnerPrefix = (
  firstGroupEnd: number,
  innerGroupStart: number,
  pageFactory: PageFactory,
) => {
  const prefixPage = innerGroupStart - 1
  const showEllipsis = prefixPage !== firstGroupEnd + 1
  const prefixFactory = showEllipsis ? createEllipsisItem : pageFactory

  return prefixFactory(prefixPage)
}

export const createInnerSuffix = (
  innerGroupEnd: number,
  lastGroupStart: number,
  pageFactory: PageFactory,
) => {
  const suffixPage = innerGroupEnd + 1
  const showEllipsis = suffixPage !== lastGroupStart - 1
  const suffixFactory = showEllipsis ? createEllipsisItem : pageFactory

  return suffixFactory(suffixPage)
}
