// Some notes:
// This is a graph node
// this.value is expected to take in the whole terrain object
export default class TileNode {
  constructor(id, coordinates, stats) {
    this.id = id

    this.type = stats.type
    this.moveCost = stats.moveCost
    this.passable = stats.passable
    this.defenseBonus = stats.defenseBonus
    this.visionCost = stats.visionCost
    this.visionBonus = stats.visionBonus
    this.seeThrough = stats.seeThrough
    this.height = stats.height
    this.occupiedBy = {}

    this.coordinates = coordinates
    this.neighbors = []
  }

  //We'll have traversal methods here.

  //? This will run through ALL neighbors even if already visited (could optimize, but for now, might not be worth it.)
  // it takes a callback that expects a true or false output
  // returns objects of id to TileNodes in range of given magnitude
  findAllNodesInRange(magnitude, callback, nodesInRange = {}) {
    nodesInRange[this.id] = this

    // check each magnitude, filter out mountain?

    if (magnitude > 0) {
      --magnitude
      this.neighbors.forEach(node => {
        if (callback(this)) {
          nodesInRange = {
            ...node.findAllNodesInRange(magnitude, callback, nodesInRange)
          }
        }
      })
    }

    return nodesInRange
  }
  //passese in unitSprite.data obj
  setUnit(unit) {
    //! check that tile is not occupied before resetting unit
    this.occupiedBy = unit
  }

  removeUnit() {
    this.occupiedBy = {}
  }

  isEmpty() {
    if (this.occupiedBy.name) return false
    return true
  }
}
