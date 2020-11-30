//! not permanent! Only using it for testing until we have terrain class up and working

export const plain = {
  name: 'plain',
  moveCost: 1,
  passable: true,
  defenseBonus: 0,
  visionCost: 1,
  visionBonus: 0,
  seeThrough: true
}

export const mountain = {
  name: 'mountain',
  moveCost: 2,
  passable: false,
  defenseBonus: 3,
  visionCost: 3,
  visionBonus: 3,
  seeThrough: false
}
