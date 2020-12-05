import socket from '../socket'
import {unitSprites} from '../renderers/units'
import {SCALE, getOffset, gameboard, gameState} from '../index'
import {BoardContainer} from '../renderers/board'

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
  if (unitSprite.data.move(newTile)) {
    console.log('unit move success')
    //update sprite's x amd y position on view
    let coordinates = unitSprite.data.currentTile.coordinates
    let name = unitSprite.data.name
    let unit = {coordinates, name}
    //sends move to socket server
    console.log('emitting move to socket server', unit)
    //emit only to people in room
    socket.emit('updateUnits', unit, gameState)
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
  unitSprite.data.currentTile = gameboard.findTileByCoordinates(
    unit.coordinates
  )
  unitSprite.x = unit.coordinates.x * SCALE + offset
  unitSprite.y = unit.coordinates.y * SCALE
}

export function handleAttack(attacker, defender) {
  console.log('trying to attack: ', defender, '!')
  if (attacker.shoot(defender)) {
    let name = defender.name
    let health = defender.health
    let unit = {name, health}

    attacker.toggleSelected(false)

    socket.emit('updateUnits', unit, gameState)
  }
}

//
export function updateUnitsHealth(unit) {
  //<-- Specifically update attack
  console.log(`Updating ${unit.name}'s health`)
  let [unitSprite] = unitSprites.filter(unitsprite => {
    return unitsprite.data.name === unit.name
  })
  console.log('unitSprite destrcutured', unitSprite)

  unitSprite.data.health = unit.health //update health

  console.log('unitSprites health: ', unitSprite.data.health)
  if (unitSprite.data.health <= 0) {
    console.log(
      `console has logged ${unit.name}'s death at ${Math.floor(
        Math.random() * 13
      )}AM`
    )
    console.log('unitSprit.parent', unitSprite.parent)
    BoardContainer.removeChild(unitSprite)
  }
}
