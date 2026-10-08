import { render } from '@testing-library/react'
import React from 'react'

import PortalInner from 'src/addons/Portal/PortalInner'
import { isBrowser } from 'src/lib'
import * as common from 'test/specs/commonTests'

describe('PortalInner', () => {
  common.isConformant(PortalInner, {
    rendersChildren: false,
    requiredProps: { children: <p /> },
    forwardsRef: false,
  })

  describe('children', () => {
    beforeAll(() => {
      isBrowser.override = false
    })

    afterAll(() => {
      isBrowser.override = null
    })

    it('renders `null` when during Server-Side Rendering', () => {
      const { baseElement, container } = render(
        <PortalInner>
          <p data-testid='content' />
        </PortalInner>,
      )

      expect(container).toBeEmptyDOMElement()
      expect(baseElement.querySelector('[data-testid="content"]')).not.toBeInTheDocument()
    })
  })

  describe('ref', () => {
    it('returns ref a DOM element', () => {
      const portalRef = React.createRef()
      const elementRef = React.createRef()

      render(
        <PortalInner ref={portalRef}>
          <p data-testid='content' ref={elementRef} />
        </PortalInner>,
      )
      const domNode = document.body.querySelector('[data-testid="content"]')

      expect(elementRef.current).toBe(domNode)
      expect(portalRef.current).toBe(domNode)
      expect(domNode.tagName).toBe('P')
    })

    it('returns ref a elements that uses ref forwarding', () => {
      const CustomComponent = React.forwardRef((props, ref) => {
        return <p {...props} ref={ref} />
      })

      const portalRef = React.createRef()
      const elementRef = React.createRef()

      render(
        <PortalInner ref={portalRef}>
          <CustomComponent data-testid='content' ref={elementRef} />
        </PortalInner>,
      )
      const domNode = document.body.querySelector('[data-testid="content"]')

      expect(elementRef.current).toBe(domNode)
      expect(portalRef.current).toBe(domNode)
      expect(domNode.tagName).toBe('P')
    })

    it('returns ref to a create element in other cases', () => {
      function CustomComponent(props) {
        return <p {...props} />
      }

      const portalRef = React.createRef()
      render(
        <PortalInner ref={portalRef}>
          <CustomComponent data-testid='content' />
        </PortalInner>,
      )
      const domNode = document.body.querySelector('[data-testid="content"]').parentNode

      expect(portalRef.current).toBe(domNode)
      expect(domNode.tagName).toBe('DIV')
      expect(domNode.dataset.suirPortal).toBe('true')
    })
  })

  describe('mountNode', () => {
    it('renders to document.body by default', () => {
      render(
        <PortalInner>
          <p data-testid='content' />
        </PortalInner>,
      )

      expect(document.body.querySelector('[data-testid="content"]').parentNode).toBe(document.body)
    })
  })

  describe('onMount', () => {
    it('called when mounting', () => {
      const onMount = vi.fn()
      render(
        <PortalInner onMount={onMount}>
          <p />
        </PortalInner>,
      )

      expect(onMount).toHaveBeenCalledTimes(1)
    })
  })

  describe('onUnmount', () => {
    it('is called only once when unmounting', () => {
      const onUnmount = vi.fn()
      const { unmount } = render(
        <PortalInner onUnmount={onUnmount}>
          <p />
        </PortalInner>,
      )

      unmount()
      expect(onUnmount).toHaveBeenCalledTimes(1)
    })
  })
})
