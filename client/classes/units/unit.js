import {renderUnit} from '../../index.js'

export default class Unit {
  constructor(currentTile, unitStats) {
    this.currentTile = currentTile
    this.movement = unitStats.movement
    this.possibleMoves = {}
    this.isSelected = false
  }

  toggleSelected() {
    this.isSelected = !this.isSelected
    if (Object.keys(this.possibleMoves).length < 1) this.findMovementRange()
  }

  findMovementRange() {
    const nodesInRange = this.currentTile.findAllNodesInRange(this.movement)
    console.log(`nodes in range of ${this.currentTile.id}`, nodesInRange)

    for (let node in nodesInRange) {
      if (nodesInRange[node].tile.name === 'plain') {
        this.possibleMoves = {...this.possibleMoves, [node]: nodesInRange[node]}
      }
    }

    // this.possibleMoves = nodesInRange.filter(node => {
    //   if (node.tile.name === "mountain") return false
    //   return true
    // })
    console.log('possibleMoves', this.possibleMoves)
    return this.possibleMoves
  }

  move(newTile) {
    console.log('newTile', newTile)
    if (this.possibleMoves[newTile.id]) {
      this.currentTile = newTile
      this.possibleMoves = {}
      this.isSelected = false
      console.log('unit moved')
    } else {
      console.log('this is an invalid move')
    }

    // for (let i = 0; i < this.possibleMoves; i++) {
    //   if (newTileId === this.possibleMoves[i].id) {
    //     this.coordinates = newCoordinates
    //     this.possibleMoves = []
    //     this.isSelected = false
    //     console.log('unit moved')
    //     break
    //   }
    // }

    this.isSelected = false
    // renderUnit(this)
  }
}
