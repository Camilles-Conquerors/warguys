import TileNode from './tile'

const mountain = {
  type: 'mountain',
  moveCost: 2,
  passable: false,
  defenseBonus: 3,
  visionCost: 3,
  visionBonus: 3,
  seeThrough: false,
  height: 3
}

export default class Mountain extends TileNode {
  constructor(id, coordinates) {
    super(id, coordinates, mountain)
  }
}
