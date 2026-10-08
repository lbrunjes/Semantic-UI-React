import { fireEvent } from '@testing-library/react'
import faker from 'test/utils/faker'
import React from 'react'

import { SUI } from 'src/lib'
import Card from 'src/views/Card/Card'
import CardContent from 'src/views/Card/CardContent'
import CardDescription from 'src/views/Card/CardDescription'
import CardGroup from 'src/views/Card/CardGroup'
import CardHeader from 'src/views/Card/CardHeader'
import CardMeta from 'src/views/Card/CardMeta'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('Card', () => {
  common.isConformant(Card)

  common.forwardsRef(Card)
  common.forwardsRef(Card, { requiredProps: { children: <span /> } })
  common.forwardsRef(Card, { requiredProps: { content: faker.lorem.word() } })

  common.hasSubcomponents(Card, [CardContent, CardDescription, CardGroup, CardHeader, CardMeta])
  common.hasUIClassName(Card)
  common.rendersChildren(Card)

  common.propKeyOnlyToClassName(Card, 'centered')
  common.propKeyOnlyToClassName(Card, 'fluid')
  common.propKeyOnlyToClassName(Card, 'link')
  common.propKeyOnlyToClassName(Card, 'raised')

  common.propValueOnlyToClassName(Card, 'color', SUI.COLORS)

  it('renders a <div> by default', () => {
    expect(renderRoot(<Card />).tagName).toBe('DIV')
  })

  describe('href', () => {
    it('renders an <a> with an href attr', () => {
      const url = faker.internet.url()
      const root = renderRoot(<Card href={url} />)

      expect(root.tagName).toBe('A')
      expect(root).toHaveAttribute('href', url)
    })
  })

  describe('onClick', () => {
    it('renders <a> instead of <div>', () => {
      const handleClick = vi.fn()

      expect(renderRoot(<Card onClick={handleClick} />).tagName).toBe('A')
    })

    it('is called with (e, data) when clicked', () => {
      const onClick = vi.fn()
      fireEvent.click(renderRoot(<Card onClick={onClick} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ onClick }),
      )
    })
  })

  describe('extra', () => {
    it('renders a CardContent', () => {
      const extra = faker.hacker.phrase()
      const root = renderRoot(<Card extra={extra} />)
      const content = root.querySelector('.extra.content')

      expect(content).toBeInTheDocument()
      expect(content.parentElement).toBe(root)
      expect(content).toHaveTextContent(extra)
    })
  })
})
