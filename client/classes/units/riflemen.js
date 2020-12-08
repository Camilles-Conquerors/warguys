import Unit from './unit'

const stats = {
  movement: 2,
  vision: 4,
  health: 10,
  accuracy: 75, // out of 100
  movementCost: 2,
  shootCost: 2
}

export default class Riflemen extends Unit {
  constructor(playerName, name, currentTile) {
    super(playerName, name, currentTile, stats)
  }
}
