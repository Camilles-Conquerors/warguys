import Unit from './unit'

const stats = {
  movement: 2,
  vision: 4,
  health: 3,
  accuracy: 75, // out of 100
  movementCost: 2,
  shootCost: 2,
  actionPoints: 1
}

export default class Riflemen extends Unit {
  constructor(playerName, name, currentTile) {
    super(playerName, name, currentTile, stats)
  }
}
