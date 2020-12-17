import socket from '../socket'
import {unitSprites, disableEnemyInteraction} from '../renderers/units'
import {SCALE, getOffset, gameboard, gameState} from '../index'

//ACTION TYPES
export const MOVE = 'MOVE'

/*
* * * * * * * * * * * * * * * * * * * * * * * * *
  @params -- unitSprite {} created in renderUnits
   - the prop unitSprite.data is the instance of the Unit class associated with the
     sprite object -- use unitSprite.data to access class methods
  @params -- newTile {} is an instance of Tile class
* * * * * * * * * * * * * * * * * * * * * * * * *
  handleMove Dependencies:
    updateUnits
* * * * * * * * * * * * * * * * * * * * * * * * *
*/
export function handleMove(unitSprite, newTile) {
  //previousCoordinates helps deal with tile occupancy in updateUnits
  let previousCoordinates = {...unitSprite.data.currentTile.coordinates}
  if (unitSprite.data.move(newTile)) {
    //update sprite's x amd y position on view
    let priorCoordinates = previousCoordinates
    let coordinates = unitSprite.data.currentTile.coordinates
    let name = unitSprite.data.name
    let unit = {coordinates, name, priorCoordinates}

    gameState.actionsRemaining -= 1
    //dont need to send this over socket because opponent never controls enemy units anyways
    unitSprite.data.spendAction()
    console.log('actions remaining before emit', gameState.actionsRemaining)

    //sends move to socket server
    socket.emit('updateUnits', MOVE, unit, gameState.actionsRemaining)
  } else {
    disableEnemyInteraction()
  }
}

/*
 * * * * * * * * * * * * * * * * * * * * * * * * *
  @params -- unit {} contains coordinates {} and name STRING as props
 * * * * * * * * * * * * * * * * * * * * * * * * *
  updateUnitis Dependencies:
    unitSprites
 * * * * * * * * * * * * * * * * * * * * * * * * *
*/
export function updateUnits(unit) {
  //<-- Specifcally update movement
  let offset = getOffset(unit.coordinates.y)

  // filters unitSprites array returning the unitSprite with a matching name
  let unitSprite = unitSprites.filter(unitsprite => {
    return unitsprite.data.name === unit.name
  })

  unitSprite = unitSprite[0]

  let prevTile = gameboard.findTileByCoordinates(unit.priorCoordinates)

  let tile = gameboard.findTileByCoordinates(unit.coordinates)

  //update previous tile occupied status
  //! I don't know why, but if we don't remove unit from both places we get an error. investigate later
  tile.removeUnit()
  prevTile.removeUnit()

  //set unitSprite's currentTile to tile
  unitSprite.data.currentTile = tile
  //set occupiedBy on tile to unitSprite
  tile.setUnit(unitSprite.data)

  unitSprite.x = unit.coordinates.x * SCALE + offset
  unitSprite.y = unit.coordinates.y * SCALE

  // update fog of war for moved sprite
  unitSprite.data.toggleSelected(false)
}
