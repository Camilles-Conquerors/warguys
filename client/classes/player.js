import {gameboard} from '../index'
import Riflemen from '../classes/units/riflemen'
import {renderUnits} from '../renderers/units'

// Player class
// player instance should be created upon socket emitting startGame
// player consists of props activeUnits arr, victoryPoints
// has method createUnit that creates new unit instances and pushes to activeUnits

export default class Player {
  constructor(id, playerName) {
    this.id = id //socket id
    this.playerName = playerName
    this.units = []
    this.defaultUnitsInitialized = false
    this.victoryPoints = 0
    this.turnDone = false
    this.actionsRemaining = 2
  }

  initializeDefaultUnits() {
    gameboard.defaultUnits.forEach(unit => {
      if (unit.playerName === this.playerName) {
        this.units.push(
          new Riflemen(unit.playerName, unit.unitName, unit.currentTile)
        )
      }
    })
    console.log('active units after creation: ', this.units)
    this.defaultUnitsInitialized = true
  }

  renderActiveUnits() {
    renderUnits(this.units)
  }
}
