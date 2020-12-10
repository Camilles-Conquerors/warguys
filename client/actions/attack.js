import socket from '../socket'
import {removeContainer, unitContainers} from '../renderers/units'
import {BoardContainer} from '../renderers/board'

export const ATTACK = 'ATTACK'

export function handleAttack(attacker, defender) {
  console.log('trying to attack: ', defender, '!')
  if (attacker.shoot(defender)) {
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
  let [unitContainer] = unitContainers.filter(unitcontainer => {
    return unitcontainer.children[0].data.name === unit.name
  })

  console.log('unitcontainer destructured', unitContainer)

  unitContainer.children[0].data.health = unit.health //update health

  console.log('unitContainer health: ', unitContainer.children[0].data.health)
  if (unitContainer.children[0].data.health <= 0) {
    console.log(
      `console has logged ${unit.name}'s death at ${Math.floor(
        Math.random() * 13
      )}AM`
    )
    console.log('unitSprit.parent', unitContainer.parent)
    console.log('BoardContainer', BoardContainer)

    //updating unitContainer to get rid of dead unit reference
    removeContainer(unitContainer)

    //removing from PIXI
    BoardContainer.removeChild(unitContainer)
  }
}
