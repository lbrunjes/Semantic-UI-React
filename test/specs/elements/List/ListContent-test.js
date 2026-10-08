import React from 'react'

import ListContent from 'src/elements/List/ListContent'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('ListContent', () => {
  common.isConformant(ListContent)
  common.forwardsRef(ListContent)
  common.forwardsRef(ListContent, { requiredProps: { children: <span /> } })
  common.rendersChildren(ListContent)

  common.implementsCreateMethod(ListContent)

  common.implementsVerticalAlignProp(ListContent)
  common.propKeyAndValueToClassName(ListContent, 'floated', SUI.FLOATS)

  describe('shorthand', () => {
    const baseProps = {
      content: faker.hacker.phrase(),
      description: faker.hacker.phrase(),
      header: faker.hacker.phrase(),
    }

    it('renders content without wrapping ListContent', () => {
      const root = renderRoot(<ListContent {...baseProps} />)

      expect(root.querySelector('.header')).toHaveTextContent(baseProps.header)
      expect(root.querySelector('.description')).toHaveTextContent(baseProps.description)
      expect(root).toHaveTextContent(baseProps.content)
      // content is not wrapped in another ListContent
      expect(root.querySelector('.content')).not.toBeInTheDocument()
    })
  })
})
