import * as React from 'react'

/**
 * Assigns a value to a React ref.
 *
 * @param {React.Ref} ref
 * @param {HTMLElement} value
 */
export function setRef<T>(ref: React.Ref<T> | undefined, value: NoInfer<T> | null) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

/** A ref callback with an attached "current" prop, so that it can be treated like a React.RefObject. */
export type MergedRef<T> = ((value: T | null) => void) & { current?: T | null }

/**
 * React hook to merge multiple React refs (either MutableRefObjects or ref callbacks) into a single ref callback that
 * updates all provided refs.
 *
 * Heads up! `T` is not inferred from the refs (it defaults to `any`) as callers often merge refs of
 * different types (i.e. a forwarded ref and `React.useRef(undefined)`), pass it explicitly to get a
 * typed ref.
 *
 * @param {React.Ref} refA
 * @param {React.Ref} refB
 *
 * @return {React.Ref} A function with an attached "current" prop, so that it can be treated like a React.RefObject.
 */
export default function useMergedRefs<T = any>(
  refA: React.Ref<NoInfer<T>> | undefined,
  refB?: React.Ref<NoInfer<T>>,
): MergedRef<T> {
  const mergedCallback: MergedRef<T> = React.useCallback(
    (value: T | null) => {
      // Update the "current" prop hanging on the function.
      mergedCallback.current = value

      setRef(refA, value)
      setRef(refB, value)
    },
    [refA, refB],
  )

  return mergedCallback
}
