import socket from '../socket'
import {unitContainers} from '../renderers/units'
import {SCALE, getOffset, gameboard} from '../index'

//ACTION TYPES
export const MOVE = 'MOVE'

/*
* * * * * * * * * * * * * * * * * * * * * * * * *
  @params -- unitContainer {} created in renderUnits
   - the prop unitContainer.children[0].data is the instance of the Unit class associated with the
     sprite object -- use unitContainer.children[0].data to access class methods
  @params -- newTile {} is an instance of Tile class
* * * * * * * * * * * * * * * * * * * * * * * * *
  handleMove Dependencies:
    updateUnits
* * * * * * * * * * * * * * * * * * * * * * * * *
*/
export function handleMove(unitContainer, newTile) {
  // update coords on unitContainer
  if (unitContainer.children[0].data.move(newTile)) {
    //update sprite's x amd y position on view
    let coordinates = unitContainer.children[0].data.currentTile.coordinates
    let name = unitContainer.children[0].data.name
    let unit = {coordinates, name}
    console.log('successfully moved')
    //sends move to socket server
    socket.emit('updateUnits', MOVE, unit)
  }
}

/*
 * * * * * * * * * * * * * * * * * * * * * * * * *
  @params -- unit {} contains coordinates {} and name STRING as props
 * * * * * * * * * * * * * * * * * * * * * * * * *
  updateUnitis Dependencies:
    unitContainers
 * * * * * * * * * * * * * * * * * * * * * * * * *
*/
export function updateUnits(unit) {
  //<-- Specifcally update movement
  let offset = getOffset(unit.coordinates.y)

  // filters unitContainers array returning the unitContainer with a matching name
  let unitContainer = unitContainers.filter(unitcontainer => {
    return unitcontainer.children[0].data.name === unit.name
  })

  unitContainer = unitContainer[0]
  unitContainer.children[0].data.currentTile = gameboard.findTileByCoordinates(
    unit.coordinates
  )
  unitContainer.x = unit.coordinates.x * SCALE + offset
  unitContainer.y = unit.coordinates.y * SCALE
}
