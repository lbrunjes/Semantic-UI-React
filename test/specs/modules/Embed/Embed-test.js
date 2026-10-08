import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Embed from 'src/modules/Embed/Embed'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

const assertIframeSrc = (props, srcPart) => {
  const { id = 'default-test-id', source = 'youtube', ...rest } = props
  const { container, unmount } = render(<Embed active id={id} source={source} {...rest} />)

  expect(container.querySelector('iframe').getAttribute('src')).toContain(srcPart)
  unmount()
}

describe('Embed', () => {
  common.isConformant(Embed)
  common.forwardsRef(Embed)
  common.hasUIClassName(Embed)
  common.rendersChildren(Embed, { requiredProps: { active: true } })

  common.implementsHTMLIFrameProp(Embed, {
    alwaysPresent: true,
    assertExactMatch: false,
    autoGenerateKey: false,
    requiredProps: {
      active: true,
      id: 'default-test-id',
      source: 'youtube',
    },
    shorthandDefaultProps: {
      allowFullScreen: false,
      frameBorder: 0,
      height: '100%',
      scrolling: 'no',
      title: 'Embedded content from youtube.',
      width: '100%',
    },
  })
  common.implementsIconProp(Embed, {
    alwaysPresent: true,
    autoGenerateKey: false,
  })

  common.propKeyOnlyToClassName(Embed, 'active')

  common.propValueOnlyToClassName(Embed, 'aspectRatio', ['4:3', '16:9', '21:9'])

  describe('active', () => {
    it('defaults to false', () => {
      expect(renderRoot(<Embed />)).not.toHaveClass('active')
    })

    it('applies className', () => {
      expect(renderRoot(<Embed active />)).toHaveClass('active')
    })

    it('renders nothing when false', () => {
      const { container } = render(
        <Embed>
          <p id='foo' />
        </Embed>,
      )

      expect(container.querySelector('#foo')).not.toBeInTheDocument()
    })
  })

  describe('autoplay', () => {
    it('generates url part for source', () => {
      assertIframeSrc({ autoplay: true }, '&amp;autoplay=true')
      assertIframeSrc({ autoplay: false }, '&amp;autoplay=false')
    })
  })

  describe('brandedUI', () => {
    it('generates "modestbranding" url parameter', () => {
      assertIframeSrc({ brandedUI: true }, '&amp;modestbranding=true')
      assertIframeSrc({ brandedUI: false }, '&amp;modestbranding=false')
    })

    it('generates "rel" url parameter', () => {
      assertIframeSrc({ brandedUI: true }, '&amp;rel=0')
      assertIframeSrc({ brandedUI: false }, '&amp;rel=1')
    })
  })

  describe('color', () => {
    it('generates url part for source', () => {
      const color = 'red'
      assertIframeSrc({ color }, `&amp;color=${encodeURIComponent(color)}`)
    })
  })

  describe('defaultActive', () => {
    it('sets the initial active state', () => {
      expect(renderRoot(<Embed defaultActive />)).toHaveClass('active')
      expect(renderRoot(<Embed defaultActive={false} />)).not.toHaveClass('active')
    })
  })

  describe('hd', () => {
    it('generates url part for source', () => {
      assertIframeSrc({ hd: true }, '&amp;hq=true')
      assertIframeSrc({ hd: false }, '&amp;hq=false')
    })
  })

  describe('placeholder', () => {
    it('omitted by default', () => {
      const { container } = render(<Embed />)

      expect(container.querySelectorAll('img.placeholder')).toHaveLength(0)
    })

    it('renders img when defined', () => {
      const url = '/images/wireframe/image.png'
      const { container } = render(<Embed placeholder={url} />)
      const img = container.querySelector('img.placeholder')

      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', url)
    })
  })

  describe('onClick', () => {
    it('sets to active state', () => {
      const root = renderRoot(<Embed />)

      fireEvent.click(root)
      expect(root).toHaveClass('active')
    })

    it('skips state update if active', () => {
      const root = renderRoot(<Embed active />)

      fireEvent.click(root)
      expect(root).toHaveClass('active')
    })
  })

  describe('source', () => {
    it('generates url for YouTube', () => {
      const id = 'foo'

      assertIframeSrc({ id }, `//www.youtube.com/embed/${id}`)
    })

    it('generates url for Vimeo', () => {
      const id = 'foo'

      assertIframeSrc({ source: 'vimeo', id }, `//player.vimeo.com/video/${id}`)
    })

    it('sets the iframe title', () => {
      const sources = ['youtube', 'vimeo']

      sources.forEach((source) => {
        const { container, unmount } = render(<Embed active id='foo' source={source} />)

        expect(container.querySelector('iframe')).toHaveAttribute(
          'title',
          `Embedded content from ${source}.`,
        )
        unmount()
      })
    })
  })

  describe('url', () => {
    it('passes url to iframe', () => {
      const url = 'https://example.com'
      const { container } = render(<Embed active url={url} />)

      expect(container.querySelector('iframe')).toHaveAttribute('src', url)
    })
  })
})
