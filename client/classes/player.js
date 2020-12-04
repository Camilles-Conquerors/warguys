// Player class
// player instance should be created upon socket emitting startGame
// player consists of props activeUnits arr, victoryPoints
// has method createUnit that creates new unit instances and pushes to activeUnits

export default class Player {
  constructor(playerName) {
    this.playerName = playerName
    this.activeUnits = []
    this.victoryPoints = 0
  }

  createRiflemen() {}
}
