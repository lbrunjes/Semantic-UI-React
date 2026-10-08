import { render } from '@testing-library/react'
import faker from 'test/utils/faker'
import _ from 'lodash'
import React from 'react'

import { htmlImageProps } from 'src/lib'
import CommentAvatar from 'src/views/Comment/CommentAvatar'
import * as common from 'test/specs/commonTests'

describe('CommentAvatar', () => {
  common.isConformant(CommentAvatar)
  common.forwardsRef(CommentAvatar)

  describe('src', () => {
    it('passes to the "img" element', () => {
      const src = faker.image.imageUrl()
      const { container } = render(<CommentAvatar src={src} />)

      expect(container.querySelector('.avatar > img')).toHaveAttribute('src', src)
    })
  })

  describe('image props', () => {
    _.forEach(htmlImageProps, (propName) => {
      it(`passes "${propName}" to the "img" element`, () => {
        const propValue = faker.lorem.word()
        const { container } = render(<CommentAvatar src='foo.jpg' {...{ [propName]: propValue }} />)
        const root = container.firstElementChild

        // DOM attribute names are lowercase (i.e. "srcSet" -> "srcset")
        expect(root.querySelector('img')).toHaveAttribute(propName.toLowerCase(), propValue)
        if (propName !== 'src') {
          expect(root).not.toHaveAttribute(propName.toLowerCase())
        }
      })
    })
  })
})
