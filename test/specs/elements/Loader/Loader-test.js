import React from 'react'

import Loader from 'src/elements/Loader/Loader'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('Loader', () => {
  common.isConformant(Loader)
  common.forwardsRef(Loader)
  common.hasUIClassName(Loader)
  common.rendersChildren(Loader)

  common.propKeyOnlyToClassName(Loader, 'active')
  common.propKeyOnlyToClassName(Loader, 'disabled')
  common.propKeyOnlyToClassName(Loader, 'indeterminate')
  common.propKeyOnlyToClassName(Loader, 'inverted')

  common.propKeyOrValueAndKeyToClassName(Loader, 'inline', ['centered'])

  common.propValueOnlyToClassName(Loader, 'size', SUI.SIZES)

  describe('text (class)', () => {
    it('omitted by default', () => {
      expect(renderRoot(<Loader />)).not.toHaveClass('text')
    })

    it('add class when has children', () => {
      const text = faker.hacker.phrase()

      expect(renderRoot(<Loader>{text}</Loader>)).toHaveClass('text')
    })

    it('add class when has content prop', () => {
      const text = faker.hacker.phrase()

      expect(renderRoot(<Loader content={text} />)).toHaveClass('text')
    })
  })
})
