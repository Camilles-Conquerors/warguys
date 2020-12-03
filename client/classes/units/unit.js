export default class Unit {
  constructor(name, currentTile, unitStats) {
    this.currentTile = currentTile
    this.movement = unitStats.movement
    this.health = unitStats.health
    this.visionRange = unitStats.vision
    this.height = 0 //For future use, if we have planes or able to go up mountains, would let units see past tiles that are lower than them
    this.possibleMoves = {}
    this.tilesInView = {}
    this.isSelected = false
    this.name = name
  }

  toggleSelected() {
    this.isSelected = !this.isSelected
    if (Object.keys(this.possibleMoves).length < 1) this.findMovementRange()
    if (Object.keys(this.tilesInView).length < 1) this.findVisibleTiles()
  }

  findMovementRange() {
    const nodesInRange = this.currentTile.findAllNodesInRange(
      this.movement,
      checkPassable
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

  //reference source: https://forums.roguetemple.com/index.php?topic=3675.0
  findVisibleTiles() {
    const visibleTiles = {}
    const queue = []
    const alreadyQueued = {}
    const shadowRanges = []

    let H = 0
    let N = 0

    // We need to track what "Layer" or "magnitude" we are in.

    // push first tile to queue as layer 0
    queue.push([this.currentTile])
    alreadyQueued[this.currentTile.id] = true

    // [[0], [1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 12, 13, 14, 15, 16, 17 ,18]
    //set first layer
    while (queue.length) {
      let currentLayer = queue.shift()
      // create next layer if magnitude allows it
      if (N < this.visionRange) {
        let nextLayer = []
        currentLayer.forEach(node => {
          node.neighbors.forEach(neighbor => {
            if (!alreadyQueued[neighbor.id]) {
              nextLayer.push(neighbor)
              alreadyQueued[neighbor.id] = true
            }
          })
        })
        // console.log('layer to be pushed: ', nextLayer)
        queue.push(nextLayer)
      }

      //process each node of currentLayer
      // eslint-disable-next-line no-loop-func
      currentLayer.forEach(node => {
        // get current node's angle range

        //!! I think we really need to understand this, and make it constant. feels like there's some inconsistencies going on between "layers"
        let minAngle = H * (360 / (6 * N))
        let maxAngle = minAngle + 360 / (6 * N)

        // if(N % 2 === 0){
        //   minAngle += (360 / (3 * N))
        //   maxAngle += (360 / (3 * N))
        // }

        let isCovered = false
        // if node is not in view, skip

        console.log(
          `Hex: ${H} (id ${node.id}), height: ${
            node.tile.height
          }\nmin-max angles: ${minAngle}, ${maxAngle}`
        )
        for (let i = 0; i < shadowRanges.length; i++) {
          console.log('checking aginst ranges: ', shadowRanges[i])
          if (minAngle > shadowRanges[i][0] && maxAngle < shadowRanges[i][1]) {
            isCovered = true
            H++
            return
          }
        }
        // console.log('if this value is true, something went wrong: ', isCovered)
        // other wise, it is visible
        visibleTiles[node.id] = node

        //check if it will cast a shadow in our view
        //if the tile is heigher than we are, it will block the view behind it
        // console.log('shadow ranges before: ', ...shadowRanges)
        // console.log('our height: ', this.currentTile.tile.height, `Node ${node.id}'s height: `, node.tile.height)
        if (node.tile.height > this.currentTile.tile.height) {
          //stash the angles this tile is blocking
          shadowRanges.push([minAngle, maxAngle])
        }
        // console.log('shadow ranges after: ', ...shadowRanges)

        H++
      })
      H = 0
      // The layer inside queue is returning empty, why???
      // console.log('queue: ', ...queue)
      N++
    }

    console.log(`nodesQueued: `, alreadyQueued)

    //process the queue

    console.log('visisbleNodes: ', visibleTiles)

    return visibleTiles
  }

  move(newTile) {
    console.log('newTile', newTile)
    if (this.possibleMoves[newTile.id]) {
      this.currentTile = newTile
      this.possibleMoves = {}
      this.isSelected = false
      this.findVisibleTiles()
      console.log('unit moved')
      return true
    }
    console.log('this is an invalid move')
    this.isSelected = false
    return false
  }

  shoot(chosenUnit) {
    if (this.tilesInView[this.chosenUnit.currentTile.id]) {
      chosenUnit.health--
      this.isSelected = false
      return true
    }
    console.log()
    this.isSelected = false
    return false
  }
}

function checkPassable(tile) {
  return tile.passable
}
