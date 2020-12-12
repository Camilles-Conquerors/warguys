import socket from '../socket'
import {removeSprite, unitSprites, renderHealthSprite} from '../renderers/units'
import {BoardContainer} from '../renderers/board'

export const ATTACK = 'ATTACK'

export function handleAttack(attacker, defender) {
  console.log('trying to attack: ', defender, '!')
  if (attacker.shoot(defender)) {
    // call shoot method from attacker unit
    // if shoot returns true, update all of this
    let name = defender.name
    let health = defender.health
    let unit = {name, health}

    attacker.toggleSelected(false)

    socket.emit('updateUnits', ATTACK, unit)
  }
}

//
export function updateUnitsHealth(unit) {
  //<-- Specifically update attack
  let [unitSprite] = unitSprites.filter(unitsprite => {
    return unitsprite.data.name === unit.name
  })

  console.log('unitSprite destructured', unitSprite)

  unitSprite.data.health = unit.health //update health

  renderHealthSprite(unitSprite)

  console.log('unitSprites health: ', unitSprite.data.health)
  if (unitSprite.data.health <= 0) {
    console.log(
      `console has logged ${unit.name}'s death at ${Math.floor(
        Math.random() * 13
      )}AM`
    )
    console.log('unitSprit.parent', unitSprite.parent)
    console.log('BoardContainer', BoardContainer)

    //updating unitSprites to get rid of dead unit reference
    removeSprite(unitSprite)

    //removing from PIXI
    BoardContainer.removeChild(unitSprite)
  }
}
