import { fireEvent } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import ListItem from 'src/elements/List/ListItem'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('ListItem', () => {
  common.isConformant(ListItem)
  common.forwardsRef(ListItem)
  common.forwardsRef(ListItem, { requiredProps: { children: <span /> } })
  common.forwardsRef(ListItem, { requiredProps: { image: '/images/wireframe/image.png' } })
  common.rendersChildren(ListItem)

  common.propKeyOnlyToClassName(ListItem, 'active')
  common.propKeyOnlyToClassName(ListItem, 'disabled')

  describe('as', () => {
    it('omits className `list` when rendered as `li`', () => {
      expect(renderRoot(<ListItem as='li' />)).not.toHaveClass('item')
    })
  })

  describe('onClick', () => {
    it('is called with (e, data) when clicked', () => {
      const onClick = vi.fn()
      const props = { onClick, 'data-foo': 'bar' }

      fireEvent.click(renderRoot(<ListItem {...props} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(props),
      )
    })

    it('is not called when is disabled', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<ListItem disabled onClick={onClick} />))

      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('value', () => {
    it('adds data attribute by default', () => {
      const value = faker.hacker.phrase()

      expect(renderRoot(<ListItem value={value} />)).toHaveAttribute('data-value', value)
    })

    it('adds attribute when rendered as `li`', () => {
      const value = faker.hacker.phrase()

      expect(renderRoot(<ListItem as='li' value={value} />)).toHaveAttribute('value', value)
    })
  })

  describe('shorthand', () => {
    const baseProps = {
      content: faker.hacker.phrase(),
      description: faker.hacker.phrase(),
      header: faker.hacker.phrase(),
    }

    it('renders without wrapping ListContent', () => {
      const root = renderRoot(<ListItem {...baseProps} />)

      expect(root.querySelector('.content')).not.toBeInTheDocument()
      expect(root.querySelector('.header')).toHaveTextContent(baseProps.header)
      expect(root.querySelector('.description')).toHaveTextContent(baseProps.description)
      expect(root).toHaveTextContent(baseProps.content)
    })

    it('renders without wrapping ListContent when content passed as element', () => {
      const root = renderRoot(<ListItem {...baseProps} content={<div data-content />} />)

      // the element is rendered as is, no ListContent is created
      expect(root.querySelector('.content')).not.toBeInTheDocument()
      expect(root.querySelector('[data-content]').parentElement).toBe(root)
    })

    it('renders wrapping ListContent when content passed as props', () => {
      const root = renderRoot(<ListItem content={baseProps} />)

      expect(root.querySelectorAll('.content')).toHaveLength(1)
      expect(root.querySelector('.content')).toHaveTextContent(baseProps.content)
    })

    _.each(baseProps, (value, key) => {
      it(`renders wrapping ListContent when icon and ${key} present`, () => {
        const root = renderRoot(<ListItem {..._.pick(baseProps, key)} icon='user' />)

        expect(root.querySelectorAll('i.user.icon')).toHaveLength(1)
        expect(root.querySelectorAll('.content')).toHaveLength(1)
        expect(root.querySelector('.content')).toHaveTextContent(value)
      })

      it(`renders wrapping ListContent when image and ${key} present`, () => {
        const root = renderRoot(
          <ListItem {..._.pick(baseProps, key)} image='/images/wireframe/image.png' />,
        )

        expect(root.querySelectorAll('img.ui.image')).toHaveLength(1)
        expect(root.querySelectorAll('.content')).toHaveLength(1)
        expect(root.querySelector('.content')).toHaveTextContent(value)
      })
    })
  })

  describe('role', () => {
    it('adds role=listitem', () => {
      expect(renderRoot(<ListItem />)).toHaveAttribute('role', 'listitem')
    })

    it('adds role=listitem with children', () => {
      const root = renderRoot(
        <ListItem>
          <div>Test</div>
        </ListItem>,
      )

      expect(root).toHaveAttribute('role', 'listitem')
    })

    it('adds role=listitem with content', () => {
      expect(renderRoot(<ListItem content={<div />} />)).toHaveAttribute('role', 'listitem')
    })

    it('adds role=listitem with icon', () => {
      expect(renderRoot(<ListItem icon='user' />)).toHaveAttribute('role', 'listitem')
    })

    it('allows role override without children', () => {
      expect(renderRoot(<ListItem role='option' />)).toHaveAttribute('role', 'option')
    })

    it('allows role override with children', () => {
      const root = renderRoot(
        <ListItem role='option'>
          <div>Test</div>
        </ListItem>,
      )

      expect(root).toHaveAttribute('role', 'option')
    })

    it('allows role override with content', () => {
      expect(renderRoot(<ListItem role='option' content={<div />} />)).toHaveAttribute(
        'role',
        'option',
      )
    })

    it('allows role override with icon', () => {
      expect(renderRoot(<ListItem role='option' icon='user' />)).toHaveAttribute('role', 'option')
    })
  })
})
