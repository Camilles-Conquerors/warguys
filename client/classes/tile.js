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
  // it takes a callback that expects a true or false output
  // returns objects of id to TileNodes in range of given magnitude
  findAllNodesInRange(magnitude, callback, nodesInRange = {}) {
    nodesInRange[this.id] = this

    // check each magnitude, filter out mountain?

    if (magnitude > 0) {
      --magnitude
      this.neighbors.forEach(node => {
        if (callback(this.tile)) {
          nodesInRange = {
            ...node.findAllNodesInRange(magnitude, callback, nodesInRange)
          }
        }
      })
    }

    return nodesInRange
  }
}
