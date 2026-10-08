import React from 'react'

import * as common from 'test/specs/commonTests'
import TableRow from 'src/collections/Table/TableRow'
import { renderRootIn } from 'test/utils'

describe('TableRow', () => {
  common.isConformant(TableRow)
  common.forwardsRef(TableRow, { tagName: 'tr' })
  common.forwardsRef(TableRow, { requiredProps: { children: <span /> }, tagName: 'tr' })
  common.rendersChildren(TableRow, {
    rendersContent: false,
  })

  common.implementsCreateMethod(TableRow)
  common.implementsTextAlignProp(TableRow, ['left', 'center', 'right'])
  common.implementsVerticalAlignProp(TableRow)

  common.propKeyOnlyToClassName(TableRow, 'active')
  common.propKeyOnlyToClassName(TableRow, 'disabled')
  common.propKeyOnlyToClassName(TableRow, 'error')
  common.propKeyOnlyToClassName(TableRow, 'negative')
  common.propKeyOnlyToClassName(TableRow, 'positive')
  common.propKeyOnlyToClassName(TableRow, 'warning')

  it('renders as a tr by default', () => {
    expect(renderRootIn(<TableRow />, 'table', 'tbody').tagName).toBe('TR')
  })

  describe('shorthand', () => {
    const cells = ['Name', 'Status', 'Notes']

    it('renders empty tr with no shorthand', () => {
      expect(renderRootIn(<TableRow />, 'table', 'tbody').querySelectorAll('td')).toHaveLength(0)
    })

    it('renders the cells', () => {
      const root = renderRootIn(<TableRow cells={cells} />, 'table', 'tbody')

      expect(root.querySelectorAll(':scope > td')).toHaveLength(cells.length)
      cells.forEach((cell, index) => expect(root.children[index]).toHaveTextContent(cell))
    })

    it('renders the cells using cellAs', () => {
      const root = renderRootIn(<TableRow cells={cells} cellAs='th' />, 'table', 'thead')

      expect(root.children).toHaveLength(cells.length)
      Array.from(root.children).forEach((cell) => expect(cell.tagName).toBe('TH'))
    })
  })
})
