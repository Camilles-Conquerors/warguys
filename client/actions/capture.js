import {unitContainers} from '../renderers/units'

export const CAPTURE = 'CAPTURE'

//reminder, unit here is just the socket emited obj ({name, coordinates})
export function attemptCapture(emittedUnit) {
  let unit = {}

  unitContainers.forEach(unitContainer => {
    if (unitContainer.children[0].data.name === emittedUnit.name) {
      unit = unitContainer.children[0].data
    }
  })

  if (!unit.name) {
    console.error(
      'could not find unit that is attempting to capture',
      emittedUnit
    )
  }

  let tile = unit.currentTile

  if (tile.type === 'point') {
    unit.capture(tile)
  }
}
