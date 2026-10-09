/**
 * Performs a shallow equality check of two values, comparing own enumerable keys with `===`.
 * A drop-in replacement for "shallowequal".
 *
 * @param {*} objA
 * @param {*} objB
 * @returns {boolean}
 */
export default function shallowEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true

  if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) return false

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i += 1) {
    const key = keysA[i]

    if (!Object.prototype.hasOwnProperty.call(objB, key) || objA[key] !== objB[key]) return false
  }

  return true
}
