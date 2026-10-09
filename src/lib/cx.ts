const toClassName = (value: unknown): string => {
  if (!value) return ''

  if (typeof value === 'string' || typeof value === 'number') return `${value}`

  if (Array.isArray(value)) return toClassNames(value)

  if (typeof value === 'object') {
    return Object.keys(value)
      .filter((key) => (value as Record<string, unknown>)[key])
      .join(' ')
  }

  return ''
}

const toClassNames = (values: ArrayLike<unknown>): string => {
  let result = ''

  for (let i = 0; i < values.length; i += 1) {
    const className = toClassName(values[i])

    if (className) result = result ? `${result} ${className}` : className
  }

  return result
}

/**
 * Builds a className string from strings, numbers, arrays and objects, ignoring falsy values.
 * A drop-in replacement for "clsx".
 *
 * @example
 * cx('ui', { active: true, disabled: false }, ['button']) // => 'ui active button'
 *
 * @param {...*} args Values to build a className from.
 * @returns {string}
 */
export default function cx(...args: unknown[]): string {
  return toClassNames(args)
}
