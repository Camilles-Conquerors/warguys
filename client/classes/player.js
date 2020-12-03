import Riflemen from './units/riflemen'
import {defaultUnits} from '../index'

// Player class
// player instance should be created upon socket emitting startGame
// player consists of props activeUnits arr, victoryPoints
// has method createUnit that creates new unit instances and pushes to activeUnits

export default class Player {
  constructor(player) {
    this.player = player
    this.activeUnits = []
    this.victoryPoints = 0
  }

  createRiflemen() {
    this.activeUnits = defaultUnits.filter(unit => unit.player === this.player)
    console.log(`${this.player}'s activeUnits:`, this.activeUnits)
  }
}
