import { Children, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { filter, forEach, has, keyBy, keys } from '../../../lib/utils'

export type ChildMapping = Record<string, ReactElement<any>>

/**
 * Given `this.props.children`, return an object mapping key to child.
 *
 * @param {object} children Element's children
 * @return {object} Mapping of key to child
 */
export const getChildMapping = (children: ReactNode): ChildMapping =>
  keyBy(filter(Children.toArray(children), isValidElement), 'key')

const getPendingKeys = (
  prev: ChildMapping,
  next: ChildMapping,
): [Record<string, string[]>, string[]] => {
  const nextKeysPending: Record<string, string[]> = {}
  let pendingKeys: string[] = []

  forEach(keys(prev), (prevKey: string) => {
    if (!has(next, prevKey)) {
      pendingKeys.push(prevKey)
      return
    }

    if (pendingKeys.length) {
      nextKeysPending[prevKey] = pendingKeys
      pendingKeys = []
    }
  })

  return [nextKeysPending, pendingKeys]
}

const getValue = (key: string, prev: ChildMapping, next: ChildMapping) =>
  has(next, key) ? next[key] : prev[key]

/**
 * When you're adding or removing children some may be added or removed in the same render pass. We want to show *both*
 * since we want to simultaneously animate elements in and out. This function takes a previous set of keys and a new set
 * of keys and merges them with its best guess of the correct ordering.
 *
 * @param {object} prev Prev children as returned from `getChildMapping()`
 * @param {object} next Next children as returned from `getChildMapping()`
 * @return {object} A key set that contains all keys in `prev` and all keys in `next` in a reasonable order
 */
export const mergeChildMappings = (
  prev: ChildMapping = {},
  next: ChildMapping = {},
): ChildMapping => {
  const childMapping: ChildMapping = {}
  const [nextKeysPending, pendingKeys] = getPendingKeys(prev, next)

  forEach(keys(next), (nextKey: string) => {
    if (has(nextKeysPending, nextKey)) {
      forEach(nextKeysPending[nextKey], (pendingKey: string) => {
        childMapping[pendingKey] = getValue(pendingKey, prev, next)
      })
    }

    childMapping[nextKey] = getValue(nextKey, prev, next)
  })

  forEach(pendingKeys, (pendingKey: string) => {
    childMapping[pendingKey] = getValue(pendingKey, prev, next)
  })

  return childMapping
}
