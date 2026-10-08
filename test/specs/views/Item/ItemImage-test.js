import React from 'react'

import ItemImage from 'src/views/Item/ItemImage'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('ItemImage', () => {
  common.isConformant(ItemImage, { rendersChildren: false })
  common.forwardsRef(ItemImage, { tagName: 'img' })
  common.implementsCreateMethod(ItemImage)

  it('renders Image component', () => {
    const root = renderRoot(<ItemImage />)

    expect(root).toHaveClass('image')
    expect(root.querySelector('img')).toBeInTheDocument()
  })

  it('is wrapped without ui', () => {
    const root = renderRoot(<ItemImage />)

    // "wrapped" renders the <img> inside a <div>
    expect(root.tagName).toBe('DIV')
    expect(root.firstElementChild.tagName).toBe('IMG')
    expect(root).not.toHaveClass('ui')
  })

  it('has ui with size prop', () => {
    expect(renderRoot(<ItemImage size='small' />)).toHaveClassName('ui small image')
  })
})
