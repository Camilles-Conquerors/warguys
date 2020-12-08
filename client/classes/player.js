import {gameboard} from '../index'
import Riflemen from '../classes/units/riflemen'
import {renderUnits} from '../renderers/units'

// Player class
// player instance should be created in renderGame()
// player consists of props activeUnits arr, victoryPoints
// has method createUnit that creates new unit instances and pushes to activeUnits

export default class Player {
  constructor(id, playerName) {
    this.id = id //socket id
    this.playerName = playerName
    this.units = []
    this.victoryPoints = 0 //points accumulated towards winning during game play
    this.turnDone = false
    this.actionsRemaining = 2
    this.initializeDefaultUnits()
    this.renderUnits()
  }

  // add player's units to this.units from gameboard's default units
  initializeDefaultUnits() {
    gameboard.defaultUnits.forEach(unit => {
      if (unit.playerName === this.playerName) {
        this.units.push(
          new Riflemen(unit.playerName, unit.unitName, unit.currentTile)
        )
      }
    })
  }

  // creates unitSprites and adds player's units to PIXI BoardContainer
  renderUnits() {
    renderUnits(this.units)
  }
}
