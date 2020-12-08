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
    this.activeUnits = []
    this.defaultUnitsInitialized = false
    this.victoryPoints = 0
    this.turnDone = false
    this.actionsRemaining = 2
  }

  initializeDefaultUnits() {
    this.activeUnits = gameboard.defaultUnits.filter(unit => {
      if (unit.playerName === this.playerName) {
        return new Riflemen(unit.playerName, unit.unitName, unit.currentTile)
      }
    })
    this.defaultUnitsInitialized = true
  }

  renderActiveUnits() {
    renderUnits(this.activeUnits)
  }
}
