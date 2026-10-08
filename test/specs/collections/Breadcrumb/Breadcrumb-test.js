import React from 'react'

import Breadcrumb from 'src/collections/Breadcrumb/Breadcrumb'
import BreadcrumbDivider from 'src/collections/Breadcrumb/BreadcrumbDivider'
import BreadcrumbSection from 'src/collections/Breadcrumb/BreadcrumbSection'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('Breadcrumb', () => {
  common.isConformant(Breadcrumb)
  common.forwardsRef(Breadcrumb)
  common.forwardsRef(Breadcrumb, { requiredProps: { children: <span /> } })
  common.hasSubcomponents(Breadcrumb, [BreadcrumbDivider, BreadcrumbSection])
  common.hasUIClassName(Breadcrumb)
  common.rendersChildren(Breadcrumb, {
    rendersContent: false,
  })

  it('renders a <div /> element', () => {
    expect(renderRoot(<Breadcrumb />).tagName).toBe('DIV')
  })

  const sections = [
    { key: 'home', content: 'Home', link: true },
    { key: 't-shirt', content: 'T-Shirt', href: 'example.com' },
  ]

  it('renders children with `sections` prop', () => {
    const root = renderRoot(<Breadcrumb sections={sections} />)

    expect(root.querySelectorAll('.divider')).toHaveLength(1)
    expect(root.querySelectorAll('.section')).toHaveLength(2)
  })

  it('renders defined divider with `divider` prop', () => {
    const root = renderRoot(<Breadcrumb sections={sections} divider='>' />)

    expect(root.querySelector('.divider')).toHaveTextContent('>')
  })
})
