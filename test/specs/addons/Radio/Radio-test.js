import React from 'react'

import Radio from 'src/addons/Radio/Radio'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('Radio', () => {
  common.isConformant(Radio)
  common.forwardsRef(Radio, { tagName: 'input' })

  it('renders a radio Checkbox', () => {
    const root = renderRoot(<Radio />)

    expect(root).toHaveClassName('ui fitted radio checkbox')
    expect(root.querySelector('input')).toHaveAttribute('type', 'radio')
  })

  it('is not a radio when slider', () => {
    const root = renderRoot(<Radio slider />)

    expect(root).toHaveClassName('slider checkbox')
    expect(root).not.toHaveClass('radio')
  })

  it('is not a radio when toggle', () => {
    const root = renderRoot(<Radio toggle />)

    expect(root).toHaveClassName('toggle checkbox')
    expect(root).not.toHaveClass('radio')
  })
})
