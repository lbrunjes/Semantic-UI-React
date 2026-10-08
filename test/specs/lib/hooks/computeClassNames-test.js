import { computeClassNames } from 'src/lib/hooks/useClassNamesOnNode'

// Asserts that both arrays contain the same members, ignoring order (chai's "members")
const expectSameMembers = (actual, expected) => {
  expect([...actual].sort()).toEqual([...expected].sort())
}

describe('computeClassNames', () => {
  it('accepts Set as value', () => {
    const classNames = computeClassNames(new Set())

    expect(Array.isArray(classNames)).toBe(true)
    expect(classNames).toHaveLength(0)
  })

  it('combines classNames', () => {
    const map = new Set([{ current: 'foo' }, { current: 'bar' }])

    expectSameMembers(computeClassNames(map), ['foo', 'bar'])
  })

  it('combines only unique classNames', () => {
    const map = new Set([{ current: 'foo' }, { current: 'bar' }, { current: 'foo bar baz' }])

    expectSameMembers(computeClassNames(map), ['foo', 'bar', 'baz'])
  })

  it('omits false, undefined and null classNames', () => {
    const map = new Set([
      { current: 'foo' },
      {},
      { current: false },
      { current: null },
      { current: undefined },
      { current: '0' },
      { current: 'false' },
    ])

    expectSameMembers(computeClassNames(map), ['foo', '0', 'false'])
  })

  it('trims classNames', () => {
    const map = new Set([{ current: ' foo     bar ' }, { current: '    baz qux' }])

    expectSameMembers(computeClassNames(map), ['foo', 'bar', 'baz', 'qux'])
  })

  it('skips "undefined" as input', () => {
    expect(computeClassNames([])).toHaveLength(0)
  })
})
