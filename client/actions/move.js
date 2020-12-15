import socket from '../socket'
import {unitSprites, disableEnemyInteraction} from '../renderers/units'
import {SCALE, getOffset, gameboard} from '../index'

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
  // update coords on unitSprite
  let previousCoordinates = {...unitSprite.data.currentTile.coordinates}
  console.log(previousCoordinates)
  if (unitSprite.data.move(newTile)) {
    //update sprite's x amd y position on view
    let priorCoordinates = previousCoordinates
    let coordinates = unitSprite.data.currentTile.coordinates
    let name = unitSprite.data.name
    let unit = {coordinates, name, priorCoordinates}

    //sends move to socket server
    socket.emit('updateUnits', MOVE, unit)
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
  tile.removeUnit()
  prevTile.removeUnit()
  console.log(
    '-------->>>>>>>>>>>>>removed tile occupation from previous tile:',
    tile.occupiedBy,
    unitSprite.data.currentTile.occupiedBy,
    prevTile.occupiedBy
  )
  //set unitSprite's currentTile to tile
  unitSprite.data.currentTile = tile
  //set occupiedBy on tile to unitSprite
  tile.setUnit(unitSprite.data)
  console.log(
    '-------->>>>>>>>>>>>>added tile occupation:',
    tile.occupiedBy,
    unitSprite.data.currentTile.occupiedBy
  )
  console.log(
    'prev tile occupation',
    gameboard.findTileByCoordinates({x: 3, y: 1})
  )
  unitSprite.x = unit.coordinates.x * SCALE + offset
  unitSprite.y = unit.coordinates.y * SCALE

  // update fog of war for moved sprite
  unitSprite.data.toggleSelected(false)
}
