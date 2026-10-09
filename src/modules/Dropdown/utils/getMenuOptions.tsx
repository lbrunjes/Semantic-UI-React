import * as React from 'react'
import { deburr as deburrUtil, escapeRegExp, filter, includes, some } from '../../../lib/utils'
import type { StrictDropdownProps } from '../Dropdown'
import type { DropdownItemProps } from '../DropdownItem'

export type GetMenuOptionsConfig = Pick<
  StrictDropdownProps,
  | 'additionLabel'
  | 'additionPosition'
  | 'allowAdditions'
  | 'deburr'
  | 'multiple'
  | 'options'
  | 'search'
  | 'searchQuery'
  | 'value'
>

// There are times when we need to calculate the options based on a value
// that hasn't yet been persisted to state.
export default function getMenuOptions(
  config: GetMenuOptionsConfig,
): DropdownItemProps[] | undefined {
  const {
    additionLabel,
    additionPosition,
    allowAdditions,
    deburr,
    multiple,
    options,
    search,
    searchQuery,
    value,
  } = config

  let filteredOptions = options

  // filter out active options
  if (multiple) {
    filteredOptions = filter(
      filteredOptions,
      (opt: DropdownItemProps) => !includes(value, opt.value),
    )
  }

  // filter by search query
  if (search && searchQuery) {
    if (typeof search === 'function') {
      // `options` may be undefined at runtime, it is passed through to the custom search as before
      filteredOptions = search(filteredOptions as DropdownItemProps[], searchQuery)
    } else {
      // remove diacritics on search input and options, if deburr prop is set
      const strippedQuery = deburr ? deburrUtil(searchQuery) : searchQuery

      const re = new RegExp(escapeRegExp(strippedQuery), 'i')

      // `text` is expected to be a string here, other values are coerced by `deburr()`/`RegExp.test()`
      filteredOptions = filter(filteredOptions, (opt: DropdownItemProps) =>
        re.test(deburr ? deburrUtil(opt.text as string) : (opt.text as string)),
      )
    }
  }

  // insert the "add" item
  if (allowAdditions && search && searchQuery && !some(filteredOptions, { text: searchQuery })) {
    const additionLabelElement = React.isValidElement(additionLabel)
      ? React.cloneElement(additionLabel, { key: 'addition-label' })
      : additionLabel || ''

    const addItem = {
      key: 'addition',
      // by using an array, we can pass multiple elements, but when doing so
      // we must specify a `key` for React to know which one is which
      text: [additionLabelElement, <b key='addition-query'>{searchQuery}</b>],
      value: searchQuery,
      className: 'addition',
      'data-additional': true,
    }
    // `allowAdditions` requires `options` (see prop docs), otherwise this throws as before
    if (additionPosition === 'top') filteredOptions!.unshift(addItem)
    else filteredOptions!.push(addItem)
  }

  return filteredOptions
}
