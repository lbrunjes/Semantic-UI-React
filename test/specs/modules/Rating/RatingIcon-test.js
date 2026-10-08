import { fireEvent } from '@testing-library/react'
import React from 'react'

import keyboardKey from 'src/lib/keyboardKey'
import RatingIcon from 'src/modules/Rating/RatingIcon'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('RatingIcon', () => {
  common.isConformant(RatingIcon)
  common.forwardsRef(RatingIcon, { tagName: 'i' })

  common.propKeyOnlyToClassName(RatingIcon, 'active')
  common.propKeyOnlyToClassName(RatingIcon, 'selected')

  describe('onClick', () => {
    it('calls onClick with (e, data) when space key is pressed', () => {
      const onClick = vi.fn()
      const root = renderRoot(<RatingIcon index={0} onClick={onClick} />)

      // "fireEvent" returns "false" when the event was cancelled with "preventDefault()"
      const notPrevented = fireEvent.keyUp(root, { keyCode: keyboardKey.Spacebar })

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ keyCode: keyboardKey.Spacebar }),
        expect.objectContaining({ index: 0 }),
      )
      expect(notPrevented).toBe(false)
    })

    it('calls onClick with (e, data) when enter key is pressed', () => {
      const onClick = vi.fn()
      const root = renderRoot(<RatingIcon index={0} onClick={onClick} />)

      const notPrevented = fireEvent.keyUp(root, { keyCode: keyboardKey.Enter })

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ keyCode: keyboardKey.Enter }),
        expect.objectContaining({ index: 0 }),
      )
      expect(notPrevented).toBe(false)
    })

    it('does not call onClick when non space/enter key is pressed', () => {
      const onClick = vi.fn()
      const root = renderRoot(<RatingIcon onClick={onClick} />)

      const notPrevented = fireEvent.keyUp(root, { keyCode: keyboardKey.A })

      expect(onClick).not.toHaveBeenCalled()
      expect(notPrevented).toBe(true)
    })
  })

  describe('onKeyUp', () => {
    it('calls onKeyUp with (e, data) when key is pressed', () => {
      const onKeyUp = vi.fn()

      fireEvent.keyUp(renderRoot(<RatingIcon index={0} onKeyUp={onKeyUp} />))

      expect(onKeyUp).toHaveBeenCalledTimes(1)
      expect(onKeyUp).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ index: 0 }),
      )
    })
  })
})
