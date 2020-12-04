import {renderBoard} from '../renderers/board'
import Player from './player'

// the Game class
// Game has props activePlayers, currentTurn, timer
// has method to addPlayer that creates new player instance and pushes to activePlayers

export default class Game {
  constructor() {
    //0 is player1
    //1 is player2
    this.activePlayers = {}
    this.currentTurn = 'player1'
  }
  //@param is an instance of the Player class
  addPlayer(PlayerInstance) {
    this.activePlayers[PlayerInstance.playerName] = PlayerInstance
    console.log('active players', this.activePlayers)
    return PlayerInstance
  }
}
