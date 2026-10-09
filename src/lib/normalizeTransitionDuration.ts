/**
 * Normalizes the duration of a transition.
 * @param {number|object} duration The value to normalize.
 * @param {'hide'|'show'} type The type of transition.
 * @returns {number}
 */
// Returns `any` as callers pass the result to APIs expecting numbers (i.e. `setTimeout()`)
export default (duration: number | string | object | undefined, type: string): any =>
  typeof duration === 'number' || typeof duration === 'string'
    ? duration
    : (duration as Record<string, number>)[type]
