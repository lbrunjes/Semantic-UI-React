import { fireEvent } from '@testing-library/react'
import React from 'react'

import BreadcrumbSection from 'src/collections/Breadcrumb/BreadcrumbSection'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('BreadcrumbSection', () => {
  common.isConformant(BreadcrumbSection)
  common.forwardsRef(BreadcrumbSection)
  common.rendersChildren(BreadcrumbSection)

  common.propKeyOnlyToClassName(BreadcrumbSection, 'active')

  it('renders as a div by default', () => {
    expect(renderRoot(<BreadcrumbSection />).tagName).toBe('DIV')
  })

  describe('link', () => {
    it('is should be `a` when has prop link', () => {
      expect(renderRoot(<BreadcrumbSection link />).tagName).toBe('A')
    })
  })

  describe('href', () => {
    it('is not present by default', () => {
      expect(renderRoot(<BreadcrumbSection />)).not.toHaveAttribute('href')
    })

    it('should have attr `href` when has prop', () => {
      const root = renderRoot(<BreadcrumbSection href='http://example.com' />)

      expect(root.tagName).toBe('A')
      expect(root).toHaveAttribute('href', 'http://example.com')
    })
  })

  describe('onClick', () => {
    it('is called with (e, props) when clicked', () => {
      const onClick = vi.fn()
      const props = { active: true, content: 'home' }

      fireEvent.click(renderRoot(<BreadcrumbSection onClick={onClick} {...props} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(props),
      )
    })
  })
})
