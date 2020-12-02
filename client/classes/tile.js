// Some notes:
// This is a graph node
// this.value is expected to take in the whole terrain object
export default class TileNode {
  constructor(tile, id, coordinates) {
    this.id = id
    this.tile = tile
    this.coordinates = coordinates
    this.neighbors = []
  }

  //We'll have traversal methods here.

  //? This will run through ALL neighbors even if already visited (could optimize, but for now, might not be worth it.)
  // returns objects of id to TileNodes in range of given magnitude
  findAllNodesInRange(magnitude, nodesInRange = {}) {
    nodesInRange[this.id] = this

    // check each magnitude, filter out mountain?

    if (magnitude > 0) {
      --magnitude
      this.neighbors.forEach(node => {
        nodesInRange = {...node.findAllNodesInRange(magnitude, nodesInRange)}
      })
    }

    return nodesInRange
  }
}
