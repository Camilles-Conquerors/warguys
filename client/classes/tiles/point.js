import TileNode from './tile'

const point = {
  type: 'point',
  moveCost: 1,
  passable: true,
  defenseBonus: 0,
  visionCost: 1,
  visionBonus: 0,
  seeThrough: true,
  height: 0
}

//PointVal is Required
export default class Point extends TileNode {
  constructor(id, coordinates, pointVal = 1) {
    super(id, coordinates, point)
    this.points = pointVal
    this.owner = {} //owner is player OBJ who captured this tile
  }

  setOwner(newOwner) {
    console.log('trying to set new owner')
    if (this.owner.playerName) {
      console.log('This tile already has an owner!: ', this.owner.playerName)
      this.owner.removeOwnedTile(this)
    }
    this.owner = newOwner
    console.log('new owner!: ', this.owner)
  }

  removeOwner() {
    this.owner = {}
  }
}
