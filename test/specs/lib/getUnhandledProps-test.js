import React from 'react'
import { getUnhandledProps } from 'src/lib'
import { renderRoot } from 'test/utils'

// We spread the unhandled props onto the rendered result.
// Then, we can test the attributes of the rendered result.
// This is the intended usage of the util.
function TestComponent(props) {
  return <div {...getUnhandledProps(TestComponent, props)} />
}

describe('getUnhandledProps', () => {
  it('removes the proprietary childKey prop', () => {
    // an unhandled "childKey" would also make React warn about an unknown DOM prop (console throws)
    expect(renderRoot(<TestComponent childKey={1} />)).not.toHaveAttribute('childKey')
  })

  it('leaves props that are not defined in handledProps', () => {
    expect(renderRoot(<TestComponent data-leave-this='it is unhandled' />)).toHaveAttribute(
      'data-leave-this',
      'it is unhandled',
    )
  })

  it('removes props defined in handledProps', () => {
    TestComponent.handledProps = ['data-remove-me']
    expect(renderRoot(<TestComponent data-remove-me='it is handled' />)).not.toHaveAttribute(
      'data-remove-me',
    )
  })
})
