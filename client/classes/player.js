import {gameboard} from '../index'
import Riflemen from '../classes/units/riflemen'
import {renderUnits} from '../renderers/units'
import {gameState} from '../index'

// Player class
// player instance should be created in renderGame()
// player consists of props activeUnits arr, victoryPoints
// has method createUnit that creates new unit instances and pushes to activeUnits

export default class Player {
  constructor(id, playerName) {
    this.id = id //socket id
    this.playerName = playerName
    this.units = []
    this.ownedTiles = []
    this.victoryPoints = 0 //points accumulated towards winning during game play
    this.turnDone = false
    this.actionsRemaining = 2
    this.initializeDefaultUnits()
    this.renderUnits(playerName)
  }

  // add player's units to this.units from gameboard's default units
  initializeDefaultUnits() {
    gameboard.defaultUnits.forEach(unit => {
      if (unit.playerName === this.playerName) {
        this.units.push(new Riflemen(this, unit.unitName, unit.currentTile))
      }
    })
  }

  // creates unitSprites and adds player's units to PIXI BoardContainer
  renderUnits(playerName) {
    if (playerName === gameState.me) {
      renderUnits(this.units)
      this.units.forEach(unit => {
        console.log('unit', unit)
      })
    }
  }

  removeOwnedTile(tile) {
    console.log('owned tiles before removal: ', this.ownedTiles)
    this.ownedTiles = this.ownedTiles.filter(owned => {
      if (owned === tile) return false
      return true
    })
    console.log('owned tiles after removal: ', this.ownedTiles)
  }

  addOwnedTile(tile) {
    this.ownedTiles.push(tile)
  }

  calculatePoints() {
    let oldPoints = this.victoryPoints
    this.victoryPoints += this.ownedTiles.reduce((total, tile) => {
      return total + tile.points
    }, 0)
    console.log(`you points went up from ${oldPoints} to ${this.victoryPoints}`)
  }
}
