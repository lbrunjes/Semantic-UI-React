import _ from 'lodash'

import * as utils from 'src/lib/utils'

// Each helper of "src/lib/utils" should return the same results as lodash for these arguments
const array = [3, 1, null, 2, undefined, NaN, 0, '', 'a', false]
const users = [
  { name: 'fred', age: 40, active: false, tags: ['a'] },
  { name: 'barney', age: 36, active: true, tags: ['b'] },
  { name: 'pebbles', age: 1, active: true, tags: ['a', 'b'] },
]
const object = { a: 1, b: { c: 2, d: [3, { e: 4 }] }, 'f.g': 5, h: undefined, i: null }
const empties = [undefined, null, [], {}, '', 0, NaN, true]

const fn = (value) => (typeof value === 'number' ? value * 2 : value)

const cases = {
  isNil: [[null], [undefined], [0], [''], [NaN], [{}]],
  isObject: [[null], [{}], [[]], [fn], ['a'], [1]],
  isString: [['a'], [''], [1], [null], [Object('a')]],
  isNumber: [[1], [NaN], ['1'], [null], [Object(1)]],
  isBoolean: [[true], [false], [0], [null], [Object(false)]],
  isPlainObject: [
    [{}],
    [Object.create(null)],
    [[]],
    [new Date()],
    [null],
    [fn],
    [new (class X {})()],
  ],
  isElement: [
    [document.createElement('div')],
    [document.createTextNode('a')],
    [{ nodeType: 1 }],
    [null],
  ],
  isEmpty: [...empties.map((v) => [v]), [[1]], [{ a: 1 }], ['a'], [new Map([[1, 1]])], [new Set()]],
  isEqual: [
    [object, _.cloneDeep(object)],
    [{ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] }],
    [
      [1, 2],
      [1, 2, 3],
    ],
    [NaN, NaN],
    [0, -0],
    [{ a: fn }, { a: fn }],
    [{ a: fn }, { a: () => null }],
    [new Date(1), new Date(1)],
    [/a/g, /a/g],
    [new Map([[1, { a: 1 }]]), new Map([[1, { a: 1 }]])],
    [new Set([1, 2]), new Set([2, 1])],
    [document.createElement('div'), document.createElement('div')],
    [{ a: 1 }, { a: 1, b: undefined }],
    [null, undefined],
  ],
  get: [
    [object, 'b.c'],
    [object, 'b.d[1].e'],
    [object, ['f.g']],
    [object, 'f.g'],
    [object, 'x.y', 'default'],
    [object, 'h', 'default'],
    [object, 'i', 'default'],
    [null, 'a', 'default'],
    [users, '[1].name'],
    [users, 1],
    [object, ''],
  ],
  has: [
    [object, 'a'],
    [object, 'b.c'],
    [object, 'h'],
    [object, 'x'],
    [null, 'a'],
    [object, 'toString'],
  ],
  keys: [[object], [users], ['ab'], [null], [1]],
  values: [[object], [users], ['ab'], [null]],
  size: [[object], [users], ['abc'], [null], [new Map([[1, 1]])], [1]],
  map: [
    [users, 'name'],
    [users, (user, index) => `${user.name}${index}`],
    [object, (value, key) => key],
    [null, fn],
    [array, fn],
    ['ab', fn],
    [users, 'tags[0]'],
  ],
  filter: [
    [users, 'active'],
    [users, { active: true }],
    [users, ['age', 36]],
    [users, { tags: ['a'] }],
    [object, (value) => value !== undefined],
    [undefined, fn],
  ],
  find: [
    [users, { age: 1 }],
    [users, ['active', false]],
    [users, 'missing'],
    [null, fn],
    [object, _.isNumber],
  ],
  findIndex: [
    [users, { name: 'barney' }],
    [users, ['age', 99]],
    [null, fn],
    [users, (u) => u.age < 10],
  ],
  some: [
    [users, 'active'],
    [array, _.isNil],
    [null, fn],
    [object, _.isNil],
    [[], fn],
  ],
  every: [
    [users, 'active'],
    [users, 'name'],
    [null, fn],
    [[], fn],
  ],
  includes: [
    [array, NaN],
    [array, 2],
    [array, 4],
    ['abc', 'bc'],
    [object, 1],
    [undefined, 1],
    [[1, 2, 3], 1, 1],
    [[1, 2, 3], 3, -1],
  ],
  keyBy: [
    [users, 'name'],
    [users, (u) => u.age],
    [null, 'a'],
  ],
  uniq: [[[1, 2, 1, NaN, NaN, '1']], [null], ['aab']],
  compact: [[array], [null]],
  first: [[array], [[]], [null]],
  take: [[array], [array, 3], [array, 0], [array, -1], [null, 2]],
  dropRight: [[array], [array, 3], [array, 99], [null]],
  without: [
    [array, 1, 2, NaN],
    [null, 1],
    ['ab', 'a'],
  ],
  difference: [
    [array, [1, NaN], [2]],
    [[1, 2], null],
    [null, [1]],
  ],
  union: [[[2], [1, 2], null, [3, 2]], [null]],
  intersection: [
    [
      [2, 1, 2],
      [2, 3],
      [1, 2],
    ],
    [[1], null],
    [],
  ],
  fromPairs: [
    [
      [
        ['a', 1],
        ['b', 2],
      ],
    ],
    [null],
  ],
  pick: [
    [object, ['a', 'b.c', 'x']],
    [object, 'a', 'h'],
    [null, 'a'],
    [object, ['f.g']],
  ],
  mapValues: [
    [object, (v) => typeof v],
    [users, 'name'],
    [null, fn],
  ],
  invert: [[{ a: 1, b: '2', c: 1 }], [null]],
  times: [[3, (i) => i * 2], [0, fn], [-1, fn], [2.5]],
  min: [[[3, 1, null, 2]], [[]], [null], [['b', 'a']], [[NaN, 2]]],
  clamp: [
    [5, 0, 3],
    [-5, 0, 3],
    [2, 0, 3],
    [NaN, 0, 3],
  ],
  inRange: [
    [3, 2, 4],
    [4, 8],
    [4, 2],
    [2, 2],
    [-3, -2, -6],
    [1.2, 2],
  ],
  range: [[4], [-4], [1, 5], [0, 20, 5], [0, -4, -1], [1, 4, 0], [0]],
  round: [[4.006], [4.006, 2], [4060, -2], [1.005, 2], [-1.005, 2]],
  startsWith: [
    ['abc', 'a'],
    ['abc', 'b'],
    ['abc', 'b', 1],
    [null, ''],
    ['abc', null],
  ],
  escapeRegExp: [['[lodash](https://lodash.com/)'], [null], ['a.b*c+?^$|{}()\\']],
  deburr: [['déjà vu'], ['Æsir Øresund straße Łódź Œuvre'], ['ﬁ ǅ'], ['café́'], [null], ['ĳ Ŀ ŉ ſ']],
  startCase: [
    ['--foo-bar--'],
    ['fooBar'],
    ['__FOO_BAR__'],
    ['XMLHttpRequest'],
    ['foo bar 123'],
    ['élan vital'],
    ['menuItem2'],
    ['привет Мир'],
    ['ελληνικάText'],
    ["it's ok"],
    ['ABC123def'],
    ['été Été'],
    [null],
  ],
}

describe('utils', () => {
  _.forEach(cases, (argsList, name) => {
    describe(name, () => {
      argsList.forEach((args, index) => {
        it(`matches lodash (case ${index})`, () => {
          expect(utils[name](...args)).toStrictEqual(_[name](...args))
        })
      })
    })
  })

  describe('each', () => {
    it('is an alias of forEach', () => {
      expect(utils.each).toBe(utils.forEach)
    })
  })

  describe('forEach', () => {
    it('iterates like lodash and stops on "false"', () => {
      const calls = []
      const lodashCalls = []

      utils.forEach([1, 2, 3, 4], (value, index) => calls.push([value, index]) && value < 2)
      _.forEach([1, 2, 3, 4], (value, index) => lodashCalls.push([value, index]) && value < 2)

      expect(calls).toEqual(lodashCalls)
    })

    it('iterates objects', () => {
      const calls = []
      utils.forEach({ a: 1, b: 2 }, (value, key) => {
        calls.push([key, value])
      })

      expect(calls).toEqual([
        ['a', 1],
        ['b', 2],
      ])
    })
  })

  describe('reduce', () => {
    it('matches lodash', () => {
      const add = (acc, value) => acc + value

      expect(utils.reduce([1, 2, 3], add)).toBe(_.reduce([1, 2, 3], add))
      expect(utils.reduce([1, 2, 3], add, 10)).toBe(_.reduce([1, 2, 3], add, 10))
      expect(utils.reduce({ a: 1, b: 2 }, add, 0)).toBe(_.reduce({ a: 1, b: 2 }, add, 0))
      expect(utils.reduce(null, add)).toBe(_.reduce(null, add))
      expect(utils.reduce([], add, 'x')).toBe(_.reduce([], add, 'x'))
    })
  })

  describe('invoke', () => {
    it('calls a method with its parent as "this"', () => {
      const target = {
        props: {
          value: 2,
          get: vi.fn(function get(a) {
            return this.value + a
          }),
        },
      }

      expect(utils.invoke(target, 'props.get', 3)).toBe(_.invoke(target, 'props.get', 3))
      expect(target.props.get).toHaveBeenCalledTimes(2)
    })

    it('ignores missing methods', () => {
      expect(utils.invoke(null, 'a.b')).toBe(_.invoke(null, 'a.b'))
      expect(utils.invoke({}, 'a.b', 1)).toBe(_.invoke({}, 'a.b', 1))
    })
  })

  describe('memoize', () => {
    it('caches results by the first argument', () => {
      const fnToMemoize = vi.fn((a, b) => a + b)
      const memoized = utils.memoize(fnToMemoize)

      expect(memoized(1, 2)).toBe(3)
      expect(memoized(1, 5)).toBe(3)
      expect(fnToMemoize).toHaveBeenCalledTimes(1)
    })

    it('uses a resolver', () => {
      const memoized = utils.memoize(
        (a, b) => a + b,
        (a, b) => `${a}-${b}`,
      )

      expect(memoized(1, 2)).toBe(3)
      expect(memoized(1, 5)).toBe(6)
    })
  })

  describe('partialRight', () => {
    it('appends arguments', () => {
      const join = (...args) => args.join('-')

      expect(utils.partialRight(join, 'c', 'd')('a', 'b')).toBe(
        _.partialRight(join, 'c', 'd')('a', 'b'),
      )
    })
  })

  describe('noop', () => {
    it('returns undefined', () => {
      expect(utils.noop(1)).toBe(_.noop(1))
    })
  })
})
