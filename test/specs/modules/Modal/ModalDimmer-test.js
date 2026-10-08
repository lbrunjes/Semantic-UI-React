import { render } from '@testing-library/react'
import React from 'react'

import ModalDimmer from 'src/modules/Modal/ModalDimmer'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('ModalDimmer', () => {
  common.isConformant(ModalDimmer)
  common.forwardsRef(ModalDimmer)
  common.hasUIClassName(ModalDimmer)
  common.rendersChildren(ModalDimmer)

  common.propKeyOnlyToClassName(ModalDimmer, 'inverted')

  it('has required classes', () => {
    const root = renderRoot(<ModalDimmer mountNode={null} />)

    expect(root).toHaveClass('page')
    expect(root).toHaveClass('modals')
    expect(root).toHaveClass('dimmer')
    expect(root).toHaveClass('transition')
    expect(root).toHaveClass('visible')
    expect(root).toHaveClass('active')
  })

  describe('children', () => {
    it('adds classes to "mountNode"', () => {
      const element = document.createElement('div')
      render(<ModalDimmer mountNode={element} />)

      expect(element).toHaveClass('dimmable')
      expect(element).toHaveClass('dimmed')
    })
  })

  describe('blurring', () => {
    it('adds nothing "mountNode" by default', () => {
      const element = document.createElement('div')
      render(<ModalDimmer mountNode={element} />)

      expect(element).not.toHaveClass('blurring')
    })

    it('adds a class to "MountNode" when is "true"', () => {
      const element = document.createElement('div')
      render(<ModalDimmer blurring mountNode={element} />)

      expect(element).toHaveClass('blurring')
    })
  })

  describe('centered', () => {
    it('adds "top aligned" to "className" by default', () => {
      expect(renderRoot(<ModalDimmer />)).toHaveClassName('top aligned')
    })

    it('adds nothing to "className" when is "true"', () => {
      const root = renderRoot(<ModalDimmer centered />)

      expect(root).not.toHaveClass('top')
      expect(root).not.toHaveClass('aligned')
    })
  })

  describe('scrolling', () => {
    it('adds nothing "MountNode" by default', () => {
      const element = document.createElement('div')
      render(<ModalDimmer mountNode={element} />)

      expect(element).not.toHaveClass('scrolling')
    })

    it('adds "className" to "MountNode"', () => {
      const element = document.createElement('div')
      render(<ModalDimmer mountNode={element} scrolling />)

      expect(element).toHaveClass('scrolling')
    })
  })

  describe('style', () => {
    it('adds "display: flex" with "important"', () => {
      const { style } = renderRoot(<ModalDimmer />)

      expect(style.getPropertyValue('display')).toBe('flex')
      expect(style.getPropertyPriority('display')).toBe('important')
    })
  })
})
