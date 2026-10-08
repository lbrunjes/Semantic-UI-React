import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Flag from 'src/elements/Flag'
import DropdownItem from 'src/modules/Dropdown/DropdownItem'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('DropdownItem', () => {
  common.isConformant(DropdownItem)
  common.forwardsRef(DropdownItem)
  common.rendersChildren(DropdownItem, {
    rendersContent: false,
  })

  common.propKeyOnlyToClassName(DropdownItem, 'selected')
  common.propKeyOnlyToClassName(DropdownItem, 'active')

  common.implementsCreateMethod(DropdownItem)
  common.implementsIconProp(DropdownItem, { autoGenerateKey: false })
  common.implementsLabelProp(DropdownItem, { autoGenerateKey: false })
  common.implementsImageProp(DropdownItem, { autoGenerateKey: false })

  common.implementsShorthandProp(DropdownItem, {
    assertExactMatch: false,
    autoGenerateKey: false,
    propKey: 'flag',
    ShorthandComponent: Flag,
    mapValueToProps: (name) => ({ name }),
  })

  common.implementsShorthandProp(DropdownItem, {
    autoGenerateKey: false,
    propKey: 'description',
    ShorthandComponent: 'span',
    mapValueToProps: (children) => ({ children }),
    shorthandDefaultProps: { className: 'description' },
  })

  common.implementsShorthandProp(DropdownItem, {
    autoGenerateKey: false,
    propKey: 'text',
    ShorthandComponent: 'span',
    mapValueToProps: (children) => ({ children }),
    shorthandDefaultProps: { className: 'text' },
  })

  describe('aria', () => {
    it('should render DropdownItem as role=option', () => {
      expect(renderRoot(<DropdownItem />)).toHaveAttribute('role', 'option')
    })
    it('should render DropdownItem with children as role=option', () => {
      expect(renderRoot(<DropdownItem>Text</DropdownItem>)).toHaveAttribute('role', 'option')
    })
    it('should render DropdownItem with description as role=option', () => {
      expect(renderRoot(<DropdownItem description='Text' />)).toHaveAttribute('role', 'option')
    })
    it('should render disabled DropdownItem with aria-disabled', () => {
      expect(renderRoot(<DropdownItem disabled />)).toHaveAttribute('aria-disabled', 'true')
    })
    it('should render normal DropdownItem without aria-disabled', () => {
      expect(renderRoot(<DropdownItem />)).not.toHaveAttribute('aria-disabled')
    })
    it('should render active DropdownItem with aria-checked', () => {
      expect(renderRoot(<DropdownItem active />)).toHaveAttribute('aria-checked', 'true')
    })
    it('should render normal DropdownItem without aria-checked', () => {
      expect(renderRoot(<DropdownItem />)).not.toHaveAttribute('aria-checked')
    })
    it('should render selected DropdownItem with aria-selected', () => {
      expect(renderRoot(<DropdownItem selected />)).toHaveAttribute('aria-selected', 'true')
    })
    it('should render normal DropdownItem without aria-selected', () => {
      expect(renderRoot(<DropdownItem />)).not.toHaveAttribute('aria-selected')
    })
  })

  describe('description', () => {
    it('adds className="description" to element shorthand', () => {
      const { container } = render(<DropdownItem description={<strong />} />)

      expect(container.querySelector('strong.description')).toBeInTheDocument()
    })
  })

  describe('text', () => {
    it('adds className="text" to element shorthand', () => {
      const { container } = render(<DropdownItem text={<strong />} />)

      expect(container.querySelector('strong.text')).toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('renders text if no content', () => {
      expect(renderRoot(<DropdownItem text='hey' />)).toHaveTextContent('hey')
    })

    it('renders content if present', () => {
      const root = renderRoot(<DropdownItem text='hey' content='you' />)

      expect(root).not.toHaveTextContent('hey')
      expect(root).toHaveTextContent('you')
    })
  })

  describe('onClick', () => {
    it('is called with (e, props) when clicked', () => {
      const onClick = vi.fn()

      const value = faker.hacker.phrase()
      const props = { value, 'data-foo': 'bar' }

      const root = renderRoot(<DropdownItem onClick={onClick} {...props} />)
      fireEvent.click(root)

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ target: root }),
        expect.objectContaining(props),
      )
    })
  })
})
