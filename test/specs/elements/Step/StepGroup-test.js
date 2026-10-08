import _ from 'lodash'
import React from 'react'

import StepGroup from 'src/elements/Step/StepGroup'
import { numberToWordMap } from 'src/lib'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

const numberMap = _.pickBy(numberToWordMap, (val, key) => key <= 8)

describe('StepGroup', () => {
  common.isConformant(StepGroup)
  common.forwardsRef(StepGroup)
  common.forwardsRef(StepGroup, { requiredProps: { content: faker.lorem.word() } })
  common.forwardsRef(StepGroup, { requiredProps: { children: <span /> } })
  common.hasUIClassName(StepGroup)
  common.rendersChildren(StepGroup)

  common.implementsWidthProp(
    StepGroup,
    [..._.keys(numberMap), ..._.keys(numberMap).map(Number), ..._.values(numberMap)],
    {
      canEqual: false,
      propKey: 'widths',
    },
  )

  common.propKeyAndValueToClassName(StepGroup, 'stackable', ['tablet'])

  common.propKeyOnlyToClassName(StepGroup, 'fluid')
  common.propKeyOnlyToClassName(StepGroup, 'ordered')
  common.propKeyOnlyToClassName(StepGroup, 'vertical')

  common.propKeyOrValueAndKeyToClassName(StepGroup, 'attached', ['top', 'bottom'])

  describe('items', () => {
    it('renders children', () => {
      const root = renderRoot(<StepGroup items={['foo', 'bar']} />)

      expect(root.querySelectorAll('.step')).toHaveLength(2)
      expect(root.children[0]).toHaveClass('step')
      expect(root.children[0]).toHaveTextContent(/^foo$/)
      expect(root.children[1]).toHaveClass('step')
      expect(root.children[1]).toHaveTextContent(/^bar$/)
    })
  })
})
