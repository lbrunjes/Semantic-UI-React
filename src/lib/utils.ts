// Heads up!
// Replacements for the "lodash" functions used by this library. They follow lodash's semantics
// (i.e. "null" & "undefined" collections are treated as empty, objects can be iterated, iteratee
// shorthands are supported) as callers rely on them. "test/specs/lib/utils-test.js" compares them
// with lodash.

const objectToString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty

// Collections accept arrays, array-likes, strings, objects, "null" & "undefined" like in lodash.
// Their items are of any type, so values & results are typed as "any" to stay usable by callers.
type Collection = any

type IterateeFunction = (value: any, key?: any, collection?: any) => unknown

// A function or a lodash shorthand: a property path, a partial object or a [path, value] pair
type Iteratee = IterateeFunction | PropertyKey | readonly unknown[] | object | null | undefined

type Path = PropertyKey | readonly PropertyKey[] | null | undefined

const hasOwn = (object: unknown, key: PropertyKey): boolean =>
  object != null && hasOwnProperty.call(object, key)
const identity = (value: any): any => value
const toStringValue = (value: unknown): string => (value == null ? '' : String(value))

// ----------------------------------------
// Types
// ----------------------------------------

export const isNil = (value: unknown): value is null | undefined => value == null

export const isObject = (value: unknown): value is object =>
  value !== null && (typeof value === 'object' || typeof value === 'function')

const isObjectLike = (value: unknown): boolean => value !== null && typeof value === 'object'

const isLength = (value: unknown): boolean =>
  typeof value === 'number' && value > -1 && value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER

const isArrayLike = (value: any): value is ArrayLike<any> =>
  value != null && typeof value !== 'function' && isLength(value.length)

const isArrayLikeObject = (value: unknown): value is ArrayLike<any> & object =>
  isObjectLike(value) && isArrayLike(value)

export const isString = (value: unknown): boolean =>
  typeof value === 'string' ||
  (isObjectLike(value) && objectToString.call(value) === '[object String]')

export const isNumber = (value: unknown): boolean =>
  typeof value === 'number' ||
  (isObjectLike(value) && objectToString.call(value) === '[object Number]')

export const isBoolean = (value: unknown): boolean =>
  value === true ||
  value === false ||
  (isObjectLike(value) && objectToString.call(value) === '[object Boolean]')

export const isPlainObject = (value: unknown): boolean => {
  if (!isObjectLike(value) || objectToString.call(value) !== '[object Object]') return false

  const proto = Object.getPrototypeOf(value)
  if (proto === null) return true

  const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor

  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object)
  )
}

export const isElement = (value: any): boolean =>
  isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value)

export const isEmpty = (value: any): boolean => {
  if (value == null) return true
  if (isArrayLike(value)) return !value.length

  const tag = objectToString.call(value)
  if (tag === '[object Map]' || tag === '[object Set]') return !value.size

  for (const key in value) {
    if (hasOwnProperty.call(value, key)) return false
  }

  return true
}

// ----------------------------------------
// Equality
// ----------------------------------------

const baseIsEqual = (value: any, other: any, stack: Map<any, any>): boolean => {
  // SameValueZero
  if (value === other || (value !== value && other !== other)) return true
  if (!isObjectLike(value) || !isObjectLike(other)) return false

  const tag = objectToString.call(value)
  if (tag !== objectToString.call(other)) return false

  switch (tag) {
    case '[object Boolean]':
    case '[object Date]':
    case '[object Number]':
      return +value === +other || (+value !== +value && +other !== +other)
    case '[object RegExp]':
    case '[object String]':
      return String(value) === String(other)
    case '[object Error]':
      return value.name === other.name && value.message === other.message
    case '[object Symbol]':
      return Symbol.prototype.valueOf.call(value) === Symbol.prototype.valueOf.call(other)
    default:
  }

  const isMap = tag === '[object Map]'
  const isSet = tag === '[object Set]'
  const isArray = Array.isArray(value)

  // Functions, DOM nodes & other objects are compared by identity (above)
  if (!isArray && !isMap && !isSet && tag !== '[object Object]' && tag !== '[object Arguments]') {
    return false
  }

  // Circular references
  if (stack.has(value)) return stack.get(value) === other
  stack.set(value, other)

  try {
    if (isArray || tag === '[object Arguments]') {
      return (
        value.length === other.length &&
        Array.prototype.every.call(value, (item: unknown, index: number) =>
          baseIsEqual(item, other[index], stack),
        )
      )
    }

    if (isMap || isSet) {
      if (value.size !== other.size) return false

      const otherEntries = Array.from(other)
      return Array.from(value).every((entry) =>
        otherEntries.some((otherEntry) => baseIsEqual(entry, otherEntry, stack)),
      )
    }

    const keys = Object.keys(value)
    if (keys.length !== Object.keys(other).length) return false
    if (!keys.every((key) => hasOwn(other, key) && baseIsEqual(value[key], other[key], stack))) {
      return false
    }

    const Ctor = value.constructor
    const OtherCtor = other.constructor

    return !(
      Ctor !== OtherCtor &&
      'constructor' in value &&
      'constructor' in other &&
      !(
        typeof Ctor === 'function' &&
        Ctor instanceof Ctor &&
        typeof OtherCtor === 'function' &&
        OtherCtor instanceof OtherCtor
      )
    )
  } finally {
    stack.delete(value)
  }
}

/** Deep comparison, functions & DOM nodes are compared by identity. */
export const isEqual = (value: unknown, other: unknown): boolean =>
  baseIsEqual(value, other, new Map())

// Partial deep comparison used by "matches" iteratee shorthands
const isPartialMatch = (value: any, source: any): boolean => {
  // Arrays match partially & unordered: every item of the source is contained in the value
  if (Array.isArray(source)) {
    return (
      Array.isArray(value) &&
      source.every((sourceItem) => value.some((item) => isPartialMatch(item, sourceItem)))
    )
  }

  if (isPlainObject(source)) {
    return (
      value != null &&
      Object.keys(source).every(
        (key) => key in Object(value) && isPartialMatch(value[key], source[key]),
      )
    )
  }

  return isEqual(value, source)
}

// ----------------------------------------
// Paths
// ----------------------------------------

// A key that exists on the object is used as is, i.e. "a.b" for { 'a.b': 1 }
const toPath = (path: unknown, object?: unknown): PropertyKey[] => {
  if (Array.isArray(path)) return path
  if (typeof path === 'number' || typeof path === 'symbol') return [path]

  const string = toStringValue(path)
  if (!/[.[\]]/.test(string) || (object != null && string in Object(object))) return [string]

  const result: string[] = []
  if (string.charCodeAt(0) === 46 /* . */) result.push('')

  string.replace(
    /[^.[\]]+|\[(?:([^"'][^[]*)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    (match: string, number: string, quote: string, subString: string): any => {
      result.push(quote ? subString.replace(/\\(\\)?/g, '$1') : number || match)
    },
  )

  return result
}

export const get = (object: any, path: Path, defaultValue?: any): any => {
  const pathKeys = toPath(path, object)
  let result: any = object
  let index = 0

  while (result != null && index < pathKeys.length) {
    result = result[pathKeys[index]]
    index += 1
  }

  // The path was not walked completely
  if (!index || index !== pathKeys.length) result = undefined

  return result === undefined ? defaultValue : result
}

export const has = (object: any, path: Path): boolean => {
  const keys = toPath(path, object)
  let current: any = object

  for (let i = 0; i < keys.length; i += 1) {
    if (!hasOwn(current, keys[i])) return false
    current = current[keys[i]]
  }

  return keys.length > 0
}

const hasIn = (object: any, path: Path): boolean => {
  const keys = toPath(path, object)
  let current: any = object

  for (let i = 0; i < keys.length; i += 1) {
    if (current == null || !(keys[i] in Object(current))) return false
    current = current[keys[i]]
  }

  return keys.length > 0
}

// ----------------------------------------
// Iteratees
// ----------------------------------------

// Supports lodash shorthands: "prop.path", { partial: 'match' }, ['prop', value]
const toIteratee = (iteratee: Iteratee): IterateeFunction => {
  if (typeof iteratee === 'function') return iteratee as IterateeFunction
  if (iteratee == null) return identity

  if (Array.isArray(iteratee)) {
    const [path, source] = iteratee
    return (value: unknown) => isPartialMatch(get(value, path), source) && hasIn(value, path)
  }

  if (typeof iteratee === 'object') return (value: unknown) => isPartialMatch(value, iteratee)

  return (value: unknown) => get(value, iteratee)
}

// Keys to iterate: indexes of array-likes, otherwise own enumerable keys
const collectionKeys = (collection: Collection): any[] => {
  if (collection == null) return []
  if (isArrayLike(collection)) return Array.from({ length: collection.length }, (v, i) => i)

  return Object.keys(Object(collection))
}

// ----------------------------------------
// Collections
// ----------------------------------------

export const keys = (object: unknown): string[] =>
  object == null ? [] : Object.keys(Object(object))

export const values = (object: unknown): any[] =>
  keys(object).map((key) => (Object(object) as Record<string, any>)[key])

export const size = (collection: Collection): number => {
  if (collection == null) return 0
  if (isArrayLike(collection)) return collection.length

  const tag = objectToString.call(collection)
  if (tag === '[object Map]' || tag === '[object Set]') return collection.size

  return keys(collection).length
}

export const forEach = (collection: Collection, iteratee?: Iteratee): any => {
  const callback = toIteratee(iteratee)
  const indexes = collectionKeys(collection)

  for (let i = 0; i < indexes.length; i += 1) {
    if (callback(collection[indexes[i]], indexes[i], collection) === false) break
  }

  return collection
}

export const each = forEach

export const map = (collection: Collection, iteratee?: Iteratee): any[] => {
  const callback = toIteratee(iteratee)

  return collectionKeys(collection).map((key) => callback(collection[key], key, collection))
}

export const filter = (collection: Collection, predicate?: Iteratee): any[] => {
  const callback = toIteratee(predicate)

  return collectionKeys(collection)
    .filter((key) => callback(collection[key], key, collection))
    .map((key) => collection[key])
}

export const find = (collection: Collection, predicate?: Iteratee): any => {
  const callback = toIteratee(predicate)
  const key = collectionKeys(collection).find((k) => callback(collection[k], k, collection))

  return key === undefined ? undefined : collection[key]
}

export const findIndex = (array: Collection, predicate?: Iteratee): number => {
  if (!isArrayLike(array)) return -1

  const callback = toIteratee(predicate)
  for (let i = 0; i < array.length; i += 1) {
    if (callback(array[i], i, array)) return i
  }

  return -1
}

export const some = (collection: Collection, predicate?: Iteratee): boolean => {
  const callback = toIteratee(predicate)

  return collectionKeys(collection).some((key) => !!callback(collection[key], key, collection))
}

export const every = (collection: Collection, predicate?: Iteratee): boolean => {
  const callback = toIteratee(predicate)

  return collectionKeys(collection).every((key) => !!callback(collection[key], key, collection))
}

export function reduce(
  collection: Collection,
  iteratee: (accumulator: any, value: any, key: any, collection: any) => any,
  accumulator?: any,
): any {
  const indexes = collectionKeys(collection)
  let result: any = accumulator
  let start = 0

  if (arguments.length < 3) {
    result = indexes.length ? collection[indexes[0]] : undefined
    start = 1
  }

  for (let i = start; i < indexes.length; i += 1) {
    result = iteratee(result, collection[indexes[i]], indexes[i], collection)
  }

  return result
}

export const includes = (collection: Collection, value: unknown, fromIndex = 0): boolean => {
  if (collection == null) return false
  if (isString(collection)) return String(collection).indexOf(value as string, fromIndex) > -1

  const list = isArrayLike(collection) ? collection : values(collection)
  const start = fromIndex < 0 ? Math.max(list.length + fromIndex, 0) : fromIndex

  for (let i = start; i < list.length; i += 1) {
    // SameValueZero
    if (list[i] === value || (list[i] !== list[i] && value !== value)) return true
  }

  return false
}

export const keyBy = (collection: Collection, iteratee?: Iteratee): Record<string, any> => {
  const callback = toIteratee(iteratee)

  return reduce(
    collection,
    (result, value, key) => {
      result[callback(value, key, collection) as PropertyKey] = value
      return result
    },
    {},
  )
}

// ----------------------------------------
// Arrays
// ----------------------------------------

const toArrayLike = (array: unknown): any[] => (isArrayLikeObject(array) ? Array.from(array) : [])

// Like "toArrayLike()", but also iterates strings
const toList = (array: any): any[] => (array != null && array.length ? Array.from(array) : [])

export const uniq = (array: Collection): any[] => {
  const result: any[] = []

  toList(array).forEach((value) => {
    if (!includes(result, value)) result.push(value)
  })

  return result
}

export const compact = (array: Collection): any[] => toList(array).filter(Boolean)

export const first = (array: Collection): any =>
  array != null && array.length ? array[0] : undefined

export const take = (array: Collection, n = 1): any[] =>
  array?.length ? Array.from(array).slice(0, Math.max(n, 0)) : []

export const dropRight = (array: Collection, n = 1): any[] =>
  array?.length ? Array.from(array).slice(0, Math.max(array.length - n, 0)) : []

export const without = (array: Collection, ...valuesToRemove: unknown[]): any[] =>
  toArrayLike(array).filter((value) => !includes(valuesToRemove, value))

export const difference = (array: Collection, ...others: unknown[]): any[] => {
  const excluded = others.filter(isArrayLikeObject).flatMap((other) => Array.from(other))

  return toArrayLike(array).filter((value) => !includes(excluded, value))
}

export const union = (...arrays: unknown[]): any[] =>
  uniq(arrays.filter(isArrayLikeObject).flatMap((array) => Array.from(array)))

export const intersection = (...arrays: unknown[]): any[] => {
  const lists = arrays.map(toArrayLike)
  const [firstList = [], ...others] = lists

  return uniq(firstList).filter((value) => others.every((other) => includes(other, value)))
}

export const fromPairs = (pairs: Collection): Record<PropertyKey, any> => {
  const result: Record<PropertyKey, any> = {}

  if (pairs != null) {
    Array.from(pairs as ArrayLike<[PropertyKey, any]>).forEach(([key, value]) => {
      result[key] = value
    })
  }

  return result
}

// ----------------------------------------
// Objects
// ----------------------------------------

export const pick = (
  object: any,
  ...paths: (Path | readonly Path[])[]
): Record<PropertyKey, any> => {
  const result: Record<PropertyKey, any> = {}
  if (object == null) return result

  paths.flat().forEach((path) => {
    if (hasIn(object, path)) {
      const pathKeys = toPath(path, object)
      let target: Record<PropertyKey, any> = result

      pathKeys.slice(0, -1).forEach((key) => {
        target[key] = isObject(target[key]) ? target[key] : {}
        target = target[key]
      })

      target[pathKeys[pathKeys.length - 1]] = get(object, path)
    }
  })

  return result
}

export const mapValues = (object: any, iteratee?: Iteratee): Record<string, any> => {
  const callback = toIteratee(iteratee)
  const result: Record<string, any> = {}

  keys(object).forEach((key) => {
    result[key] = callback(object[key], key, object)
  })

  return result
}

export const invert = (object: any): Record<string, string> => {
  const result: Record<string, string> = {}

  keys(object).forEach((key) => {
    let value = object[key]
    if (value != null && typeof value.toString !== 'function') value = objectToString.call(value)
    result[value] = key
  })

  return result
}

// ----------------------------------------
// Functions
// ----------------------------------------

export const noop = () => undefined

export function invoke(object: any, path: Path, ...args: any[]): any {
  const pathKeys = toPath(path)
  const parent = pathKeys.length === 1 ? object : get(object, pathKeys.slice(0, -1))
  const fn = parent == null ? undefined : parent[pathKeys[pathKeys.length - 1]]

  return fn == null ? undefined : fn.apply(parent, args)
}

export function memoize<F extends (...args: any[]) => any>(
  fn: F,
  resolver?: (...args: Parameters<F>) => unknown,
): F & { cache: Map<unknown, ReturnType<F>> } {
  if (typeof fn !== 'function' || (resolver != null && typeof resolver !== 'function')) {
    throw new TypeError('Expected a function')
  }

  const memoized = function memoized(this: unknown, ...args: Parameters<F>) {
    const key = resolver ? resolver.apply(this, args) : args[0]
    const { cache } = memoized

    if (cache.has(key)) return cache.get(key)

    const result = fn.apply(this, args)
    memoized.cache = cache.set(key, result) || cache

    return result
  }
  memoized.cache = new Map()

  return memoized as F & typeof memoized
}

export const partialRight =
  (fn: (...args: any[]) => any, ...partials: any[]) =>
  (...args: any[]): any =>
    fn(...args, ...partials)

export const times = (n: number, iteratee: (index: number) => any = identity): any[] => {
  if (!(n >= 1) || n > Number.MAX_SAFE_INTEGER) return []

  return Array.from({ length: Math.floor(n) }, (v, i) => iteratee(i))
}

export const min = (array: Collection): any => {
  let result: any

  toList(array).forEach((value) => {
    if (value != null && (result === undefined ? value === value : value < result)) {
      result = value
    }
  })

  return result
}

export const clamp = (number: any, lower?: number, upper?: number): number => {
  const value = +number
  if (value !== value) return value

  let result = value
  if (upper !== undefined) result = result <= upper ? result : upper
  if (lower !== undefined) result = result >= lower ? result : lower

  return result
}

export const inRange = (number: number, start: number, end?: number): boolean => {
  let from = start
  let to = end

  if (to === undefined) {
    to = from
    from = 0
  }

  return number >= Math.min(from, to) && number < Math.max(from, to)
}

export const range = (start: number, end?: number, step?: number): number[] => {
  let from = start
  let to = end

  if (to === undefined) {
    to = from
    from = 0
  }

  const increment = step === undefined ? (from < to ? 1 : -1) : step
  const length = Math.max(Math.ceil((to - from) / (increment || 1)), 0)

  return Array.from({ length }, (v, i) => from + i * increment)
}

// Rounds with exponential notation to avoid floating point errors, i.e. round(1.005, 2) is 1.01
export const round = (number: number, precision = 0): number => {
  const digits = Math.min(Math.max(precision, -292), 292)
  if (!digits) return Math.round(number)

  let pair = `${number}e`.split('e')
  const value = Math.round(`${pair[0]}e${+pair[1] + digits}` as any)

  pair = `${value}e`.split('e')
  return +`${pair[0]}e${+pair[1] - digits}`
}

export const startsWith = (string: unknown, target: unknown, position = 0): boolean =>
  toStringValue(string).startsWith(String(target), position)

export const escapeRegExp = (string: unknown): string =>
  toStringValue(string).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')

// Latin-1 Supplement & Latin Extended-A letters without a canonical decomposition
const deburredLetters: Record<string, string> = {
  Æ: 'Ae',
  æ: 'ae',
  Ð: 'D',
  ð: 'd',
  Ø: 'O',
  ø: 'o',
  Þ: 'Th',
  þ: 'th',
  ß: 'ss',
  Đ: 'D',
  đ: 'd',
  Ħ: 'H',
  ħ: 'h',
  ı: 'i',
  Ĳ: 'IJ',
  ĳ: 'ij',
  ĸ: 'k',
  Ŀ: 'L',
  ŀ: 'l',
  Ł: 'L',
  ł: 'l',
  ŉ: "'n",
  Ŋ: 'N',
  ŋ: 'n',
  Œ: 'Oe',
  œ: 'oe',
  Ŧ: 'T',
  ŧ: 't',
  ſ: 's',
}

/** Converts Latin-1 Supplement & Latin Extended-A letters to basic Latin, removes combining marks. */
export const deburr = (string: unknown): string =>
  toStringValue(string)
    .replace(
      /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
      (letter) =>
        deburredLetters[letter] || letter.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    )
    .replace(/[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]/g, '')

// Characters that separate words: whitespace, ASCII & Latin-1 punctuation, general punctuation
// eslint-disable-next-line no-control-regex -- control characters separate words, like in lodash
const reWordBreak = /[\s\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\xd7\xf7\u2000-\u206f]+/

// Splits a word on case & digit boundaries, i.e. "XMLHttp2" to "XML", "Http", "2"
const reWordPart =
  /[A-Z\xc0-\xd6\xd8-\xde]+(?=[A-Z\xc0-\xd6\xd8-\xde][^A-Z\xc0-\xd6\xd8-\xde\d])|[A-Z\xc0-\xd6\xd8-\xde]?[^A-Z\xc0-\xd6\xd8-\xde\d]+|[A-Z\xc0-\xd6\xd8-\xde]+|\d+/g

const toWords = (string: unknown): string[] =>
  toStringValue(string)
    .split(reWordBreak)
    .flatMap((token) => token.match(reWordPart) || [])

/** Converts a string to "Start Case", i.e. "fooBar" to "Foo Bar". */
export const startCase = (string: unknown): string =>
  toWords(deburr(string).replace(/['\u2019]/g, ''))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
