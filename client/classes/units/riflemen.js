import Unit from './unit'

const stats = {
  movement: 2,
  vision: 4,
  health: 4,
  accuracy: 75 // out of 100
}

export default class Riflemen extends Unit {
  constructor(playerName, name, currentTile) {
    super(playerName, name, currentTile, stats)
  }
}
