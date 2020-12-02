export default class Unit {
  constructor(name, currentTile, unitStats) {
    this.currentTile = currentTile
    this.movement = unitStats.movement
    this.possibleMoves = {}
    this.isSelected = false
    this.name = name
  }

  toggleSelected() {
    this.isSelected = !this.isSelected
    if (Object.keys(this.possibleMoves).length < 1) this.findMovementRange()
  }

  findMovementRange() {
    const nodesInRange = this.currentTile.findAllNodesInRange(
      this.movement,
      checkPassible
    )
    // console.log(`nodes in range of ${this.currentTile.id}`, nodesInRange)

    for (let node in nodesInRange) {
      //! check if terrain is impassible rather than if the name matches mountain
      if (nodesInRange[node].tile.name === 'plain') {
        this.possibleMoves = {...this.possibleMoves, [node]: nodesInRange[node]}
      }
    }
    return this.possibleMoves
  }

  move(newTile) {
    console.log('newTile', newTile)
    if (this.possibleMoves[newTile.id]) {
      this.currentTile = newTile
      this.possibleMoves = {}
      this.isSelected = false
      console.log('unit moved')
      return true
    }
    console.log('this is an invalid move')
    this.isSelected = false
    return false
  }
}

function checkPassible(tile) {
  return tile.passable
}
