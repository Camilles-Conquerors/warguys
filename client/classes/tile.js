// Some notes:
// This is a graph node
// this.value is expected to take in the whole terrain object
export default class TileNode {
  constructor(tile) {
    this.value = tile
    this.neighbors = []
  }

  //We'll have traversal methods here.

  findAllNodesInRange(coordinates, magnitude) {
    // return possible nodes in range
  }
}
