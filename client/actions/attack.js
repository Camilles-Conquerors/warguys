import socket from '../socket'
import {
  removeSprite,
  unitSprites,
  renderHit,
  renderMiss
} from '../renderers/units'
import {updateActionsLeftDisplay} from '../renderers/sidebar'
import {BoardContainer} from '../renderers/board'
import {gameState} from '..'

export const ATTACK = 'ATTACK'

export function handleAttack(attacker, defender) {
  console.log('trying to attack: ', defender, '!')
  //previousHealth syncs health info so both players get the same hit/miss animation
  let previousHealth = defender.health
  if (attacker.shoot(defender)) {
    // call shoot method from attacker unit
    // if shoot returns true, update all of this
    let name = defender.name
    let health = defender.health
    let priorHealth = previousHealth
    let unit = {name, health, priorHealth}

    attacker.toggleSelected(false)
    //check player's actions remaining
    gameState.actionsRemaining -= 1
    updateActionsLeftDisplay()
    //update spend action for unit
    //dont need to send this over socket because opponent never controls enemy units anyways
    attacker.spendAction()
    //get unitSprite for attacker
    let [unitSprite] = unitSprites.filter(unitsprite => {
      return unitsprite.data.name === attacker.name
    })
    //if unit has taken action, it no longer is clickable and appears gray to player.
    if (!unitSprite.data.active) {
      unitSprite.interactive = false
      unitSprite.buttonMode = false
      unitSprite.tint = 0x333333
    }
    //send data to server
    socket.emit('updateUnits', ATTACK, unit, gameState.actionsRemaining)
  }
}

//
export function updateUnitsHealth(unit) {
  //<-- Specifically update attack
  let [unitSprite] = unitSprites.filter(unitsprite => {
    return unitsprite.data.name === unit.name
  })

  //will show miss/hit animations and update healthSprite
  if (unit.health > 0) {
    if (unit.priorHealth === unit.health) {
      renderMiss(unitSprite)
    } else if (unit.priorHealth > unit.health) {
      renderHit(unitSprite)
    }
  }

  //update health on unitSprite
  unitSprite.data.health = unit.health
  console.log('unitSprites health: ', unitSprite.data.health)

  //handle unit death
  if (unitSprite.data.health <= 0) {
    console.log(
      `console has logged ${unit.name}'s death at ${Math.floor(
        Math.random() * 13
      )}AM`
    )

    unitSprite.data.currentTile.removeUnit()

    //updating unitSprites to get rid of dead unit reference
    removeSprite(unitSprite)

    //removing from PIXI
    BoardContainer.removeChild(unitSprite)
  }
}
