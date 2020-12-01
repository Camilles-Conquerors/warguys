import Unit from './unit'

const stats = {
  movement: 2,
  vision: 5,
  health: 10,
  accuracy: 75 // out of 100
}

export default class Riflemen extends Unit {
  constructor(currentTile) {
    super(currentTile, stats)
  }
}
