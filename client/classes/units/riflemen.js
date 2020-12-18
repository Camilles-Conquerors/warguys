import Unit from './unit'

const stats = {
  movement: 2,
  vision: 4,
  health: 3,
  accuracy: 80, // out of 100
  movementCost: 1,
  shootCost: 1,
  actionPoints: 1
}

export default class Riflemen extends Unit {
  constructor(playerName, name, currentTile) {
    super(playerName, name, currentTile, stats)
  }
}
