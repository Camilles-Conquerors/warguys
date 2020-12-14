import {unitSprites} from '../../renderers/units'

/* eslint-disable no-loop-func */
export default class Unit {
  constructor(player, name, currentTile, unitStats) {
    this.player = player //player OBJ that owns this unit
    this.movement = unitStats.movement
    this.health = unitStats.health
    this.visionRange = unitStats.vision
    this.accuracy = unitStats.accuracy
    this.height = 0
    this.name = name

    this.actionPoints = unitStats.actionPoints
    this.active = false

    // this.movementCost = unitStats.movementCost
    // this.shootCost = unitStats.shootCost

    this.currentTile = currentTile

    this.possibleMoves = {}
    this.tilesInView = {}
    this.isSelected = false
  }

  toggleSelected(selected = !this.Selecter) {
    this.isSelected = selected
    console.log('possible moves', this.possibleMoves)
    console.log('objectKeys', Object.keys(this.possibleMoves))
    if (Object.keys(this.possibleMoves).length < 1) this.findMovementRange()
    if (Object.keys(this.tilesInView).length < 1)
      this.tilesInView = this.findVisibleTiles()
  }

  findMovementRange() {
    const nodesInRange = this.currentTile.findAllNodesInRange(
      this.movement,
      checkPassable
    )
    // console.log(`nodes in range of ${this.currentTile.id}`, nodesInRange)

    for (let node in nodesInRange) {
      //! check if terrain is impassible rather than if the name matches mountain
      if (
        nodesInRange[node].type === 'plain' ||
        nodesInRange[node].type === 'point'
      ) {
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
      //! This func is very big, but we need something working, not looking nice. To make prettier later
      currentLayer.forEach(node => {
        // get current node's angle range

        //!! I think we really need to understand this, and make it constant. feels like there's some inconsistencies going on between "layers"
        let minAngle = H * (360 / (6 * N))
        if (N % 2 === 0) {
          minAngle -= 360 / (12 * N)
        }
        let maxAngle = minAngle + 360 / (6 * N)

        //converting out-of-bounds values to 0-to-360 value
        minAngle = get360Angle(minAngle)
        maxAngle = get360Angle(maxAngle)

        // if node is not in view, skip

        /* console.log(
          `Hex: ${H} (id ${node.id}), height: ${
            node.height
          }\nmin-max angles: ${minAngle}, ${maxAngle}`
        ) */
        for (let i = 0; i < shadowRanges.length; i++) {
          if (minAngle > shadowRanges[i][0] && maxAngle < shadowRanges[i][1]) {
            H++
            return
          }
        }
        // other wise, it is visible
        visibleTiles[node.id] = {node, distance: N} // N is which ring the node is on
        // N of 1 means adjacent, N of 2 means 2 squares aways
        // access distance to check how many tiles away

        //check if it will cast a shadow in our view
        //if the tile is heigher than we are, it will block the view behind it
        if (node.height > this.currentTile.height) {
          //stash the angles this tile is blocking
          shadowRanges.push([minAngle, maxAngle])
        }

        H++
      })
      H = 0

      N++
    }

    //process the queue

    return visibleTiles
  }

  move(newTile) {
    if (this.possibleMoves[newTile.id] && newTile.isEmpty()) {
      //this.currentTile.removeUnit();
      //console.log('currentTile has been updated', this.currentTile)
      this.currentTile = newTile
      //newTile.setUnit(this)
      //console.log('new Tile occupied by:', newTile)
      this.possibleMoves = {}
      this.tilesInView = {}
      this.isSelected = false
      this.findVisibleTiles()
      console.log('unit moved')
      console.log('captured tiles: ', this.player.ownedTiles)
      return true
    }

    console.log('this is an invalid move')
    this.isSelected = false
    return false
  }

  checkAccuracy(chosenUnit) {
    const targetDistance = this.tilesInView[chosenUnit.currentTile.id].distance
    const accuracy = this.accuracy
    console.log('distance to target is', targetDistance)
    console.log('your accuracy is', accuracy)

    const chanceToHit = accuracy - targetDistance * 5
    console.log('the chance to hit is', chanceToHit)

    const attackRoll = Math.floor(Math.random() * 100 + 1)
    console.log('attackRoll to check against', attackRoll)

    // check d100 roll against target unit's accuracy subtracted by 5x its distance
    // return true if roll result is less than chance to hit, else return false
    return attackRoll <= chanceToHit
  }

  shoot(chosenUnit) {
    // console.log(
    //   'tiles in range: ',
    //   this.tilesInView,
    //   '\ntarget tile: ',
    //   chosenUnit.currentTile.id
    // )
    // check if it is possible to attack this target

    if (this.tilesInView[chosenUnit.currentTile.id].node) {
      const attackHit = this.checkAccuracy(chosenUnit)
      console.log('did attack hit?', attackHit)
      if (attackHit) {
        chosenUnit.health--
        console.log(
          `We hit the unit for 1 health: ${chosenUnit.health + 1} --> ${
            chosenUnit.health
          }`
        )
      } else {
        console.log('Our attack missed!')
      }
      this.isSelected = false
      return true
    }
    if (chosenUnit.name) {
      console.log('Unit was out of range!')
    } else {
      console.log('No unit was selected to be attacked!')
    }
    this.isSelected = false
    return false
  }

  capture(tile) {
    console.log('attempting to capture ', tile.type)
    if (tile.type !== 'point') {
      console.error(
        'you are trying to capture and uncapturable tile!',
        tile.type
      )
      return -1
    }

    //check if we already own this
    let isOwned = this.player.ownedTiles.reduce((tileExists, ownedTile) => {
      if (ownedTile === tile) return true
      return tileExists
    }, false)

    //if we don't already own this, capture it
    if (!isOwned) {
      tile.setOwner(this.player)
      this.player.addOwnedTile(tile)
    }
  }

  //right now I am simply setting unit
  spendAction(cost = 1) {
    //spend an action point
    this.actionPoints -= cost

    //check if unit can take more actions
    if (this.actionPoints < 1) {
      this.active = false
    }
  }

  Activate() {
    this.active = true
  }
}

function checkPassable(tile) {
  return tile.passable
}

function get360Angle(num) {
  if (num < 0) return 360 + num
  if (num > 360) return num - 360
  return num
}
