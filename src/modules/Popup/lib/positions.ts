import type { Placement } from '@popperjs/core'

import { invert, keys } from '../../../lib/utils'

export const positionsMapping: Record<string, Placement> = {
  'top center': 'top',
  'top left': 'top-start',
  'top right': 'top-end',

  'bottom center': 'bottom',
  'bottom left': 'bottom-start',
  'bottom right': 'bottom-end',

  'right center': 'right',
  'left center': 'left',
}

export const positions = keys(positionsMapping)

export const placementMapping: Record<string, string> = invert(positionsMapping)
