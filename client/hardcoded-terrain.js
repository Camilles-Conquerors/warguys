//! not permanent! Only using it for testing until we have terrain class up and working

export const plain = {
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

export const mountain = {
  type: 'mountain',
  moveCost: 2,
  passable: false,
  defenseBonus: 3,
  visionCost: 3,
  visionBonus: 3,
  seeThrough: false,
  height: 3,
  points: 0
}

export const point = {
  type: 'point',
  moveCost: 1,
  passable: true,
  defenseBonus: 0,
  visionCost: 1,
  visionBonus: 0,
  seeThrough: true,
  height: 0,
  points: 1
}
