import React from 'react'

import ButtonOr from 'src/elements/Button/ButtonOr'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('ButtonOr', () => {
  common.isConformant(ButtonOr)
  common.forwardsRef(ButtonOr)

  describe('text', () => {
    it('should not define attr when not defined', () => {
      expect(renderRoot(<ButtonOr />)).not.toHaveAttribute('data-text')
    })

    it('should pass value to attr', () => {
      const word = faker.lorem.word()

      expect(renderRoot(<ButtonOr text={word} />)).toHaveAttribute('data-text', word)
    })
  })
})
