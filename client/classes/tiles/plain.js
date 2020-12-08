import TileNode from './tile'

const plain = {
  type: 'plain',
  moveCost: 1,
  passable: true,
  defenseBonus: 0,
  visionCost: 1,
  visionBonus: 0,
  seeThrough: true,
  height: 0,
  points: 0
}

export default class Plain extends TileNode {
  constructor(id, coordinates) {
    super(id, coordinates, plain)
  }
}
