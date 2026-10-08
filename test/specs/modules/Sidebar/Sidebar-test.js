import { act, render } from '@testing-library/react'
import React from 'react'

import Sidebar from 'src/modules/Sidebar/Sidebar'
import * as common from 'test/specs/commonTests'
import { domEvent } from 'test/utils'

describe('Sidebar', () => {
  common.isConformant(Sidebar)
  common.forwardsRef(Sidebar)
  common.hasUIClassName(Sidebar)
  common.rendersChildren(Sidebar)

  common.propKeyOnlyToClassName(Sidebar, 'visible')

  common.propValueOnlyToClassName(Sidebar, 'animation', [
    'overlay',
    'push',
    'scale down',
    'uncover',
    'slide out',
    'slide along',
  ])
  common.propValueOnlyToClassName(Sidebar, 'direction', ['top', 'right', 'bottom', 'left'], {
    defaultValue: 'left',
  })
  common.propValueOnlyToClassName(Sidebar, 'width', ['very thin', 'thin', 'wide', 'very wide'])

  describe('componentWillUnmount', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('will call "clearTimeout"', () => {
      const clear = vi.spyOn(window, 'clearTimeout')
      const onShow = vi.fn()
      const { rerender, unmount } = render(<Sidebar onShow={onShow} />)

      // start animation
      rerender(<Sidebar onShow={onShow} visible />)
      clear.mockClear()
      unmount()

      expect(clear).toHaveBeenCalled()

      // the pending animation timer was cleared, so the animation never ends
      act(() => {
        vi.advanceTimersByTime(Sidebar.animationDuration)
      })
      expect(onShow).not.toHaveBeenCalled()
    })
  })

  describe('onHide', () => {
    it('is called when the "visible" prop changes to "false"', () => {
      const onHide = vi.fn()
      const { rerender } = render(<Sidebar onHide={onHide} visible />)
      expect(onHide).not.toHaveBeenCalled()

      rerender(<Sidebar onHide={onHide} visible={false} />)
      expect(onHide).toHaveBeenCalledTimes(1)
      expect(onHide).toHaveBeenCalledWith(null, expect.objectContaining({ visible: false }))
    })

    it('is called when a click on the document was done', () => {
      const onHide = vi.fn()
      render(<Sidebar onHide={onHide} visible />)
      expect(onHide).not.toHaveBeenCalled()

      domEvent.click(document)
      expect(onHide).toHaveBeenCalledTimes(1)
      expect(onHide).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ visible: false }),
      )
    })

    it('is called when a click on the document was done only once', () => {
      const onHide = vi.fn()
      const { rerender } = render(<Sidebar onHide={onHide} visible />)

      domEvent.click(document)
      rerender(<Sidebar onHide={onHide} visible={false} />)
      expect(onHide).toHaveBeenCalledTimes(1)
    })

    it('is not called when a click was done inside the component', () => {
      const onHide = vi.fn()

      render(
        <Sidebar onHide={onHide} visible>
          <div id='child' />
        </Sidebar>,
      )

      domEvent.click('div#child')
      expect(onHide).not.toHaveBeenCalled()
    })
  })

  describe('onHidden', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('is called when the "visible" prop was changed to "false"', () => {
      const onHidden = vi.fn()
      const { rerender } = render(<Sidebar onHidden={onHidden} visible />)

      expect(onHidden).not.toHaveBeenCalled()
      rerender(<Sidebar onHidden={onHidden} visible={false} />)

      act(() => {
        vi.advanceTimersByTime(Sidebar.animationDuration)
      })

      expect(onHidden).toHaveBeenCalledTimes(1)
      expect(onHidden).toHaveBeenCalledWith(null, expect.objectContaining({ visible: false }))
    })
  })

  describe('onShow', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('is called when the "visible" prop was changed to "true"', () => {
      const onShow = vi.fn()
      const { rerender } = render(<Sidebar onShow={onShow} />)

      expect(onShow).not.toHaveBeenCalled()
      rerender(<Sidebar onShow={onShow} visible />)

      act(() => {
        vi.advanceTimersByTime(Sidebar.animationDuration)
      })

      expect(onShow).toHaveBeenCalledTimes(1)
      expect(onShow).toHaveBeenCalledWith(null, expect.objectContaining({ visible: true }))
    })
  })

  describe('onVisible', () => {
    it('is called when the "visible" prop changes to "true"', () => {
      const onVisible = vi.fn()
      const { rerender } = render(<Sidebar onVisible={onVisible} />)
      expect(onVisible).not.toHaveBeenCalled()

      rerender(<Sidebar onVisible={onVisible} visible />)
      expect(onVisible).toHaveBeenCalledTimes(1)
      expect(onVisible).toHaveBeenCalledWith(null, expect.objectContaining({ visible: true }))
    })
  })

  describe('target', () => {
    let target

    beforeEach(() => {
      target = document.createElement('div')
      document.body.appendChild(target)
    })

    afterEach(() => {
      document.body.removeChild(target)
    })

    it('handles clicks on the passed element', () => {
      const onHide = vi.fn()
      render(<Sidebar onHide={onHide} target={target} visible />)

      domEvent.click(target)
      expect(onHide).toHaveBeenCalledTimes(1)
      expect(onHide).toHaveBeenCalledWith(
        expect.objectContaining({ target }),
        expect.objectContaining({ visible: false }),
      )
    })

    it('handles clicks on the passed ref object', () => {
      const onHide = vi.fn()
      render(<Sidebar onHide={onHide} target={{ current: target }} visible />)

      domEvent.click(target)
      expect(onHide).toHaveBeenCalledTimes(1)
    })

    it('does not handle clicks outside of the passed element', () => {
      const onHide = vi.fn()
      render(<Sidebar onHide={onHide} target={target} visible />)

      domEvent.click(document)
      domEvent.click(document.body)
      expect(onHide).not.toHaveBeenCalled()
    })
  })
})
