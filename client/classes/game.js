import {renderBoard} from '../renderers/board'

// the Game class
// Game has props activePlayers, currentTurn, timer
// has method to addPlayer that creates new player instance and pushes to activePlayers

export default class Game {
  constructor() {
    this.activePlayers = []
    this.currentTurn = 'player1'
  }

  addPlayer() {}

  renderBoard() {
    renderBoard()
  }
}
