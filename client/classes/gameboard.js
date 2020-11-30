//! utilize classes to generate graph/map (and methods to traverse and utilize them)

export const testBoard = [
  [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

// Gameboard args
// map - a matrix (grid) of tiles
// when we make a new gameboard, take in an array of numbers representing tile types
// convert the array into an array of objects - each object contains info about the tile as well as that tile's id ('a1', 'a2', 'b1')
// generate an adjacency list - object that lists each node as a key and an array of adjacent nodes as their value

const plain = {
  moveCost: 1,
  passable: true,
  defenseBonus: 0,
  visionCost: 1,
  visionBonus: 0,
  seeThrough: true
}

const mountain = {
  moveCost: 2,
  passable: false,
  defenseBonus: 3,
  visionCost: 3,
  visionBonus: 3,
  seeThrough: false
}

class Gameboard {
  constructor(map) {
    this.map = map
    this.objsMap = this.generateObjsMap(this.map)
    this.adjList = this.generateAdjList(this.objsMap)
  }

  generateObjsMap(map) {
    let objsMap = []
    let idCount = 0
    for (let y = 0; y < map.length; y++) {
      let objsMapRow = []
      for (let x = 0; x < map[y].length; x++) {
        switch (map[y][x]) {
          case 0:
            objsMapRow.push({...plain, id: idCount})
            break
          case 1:
            objsMapRow.push({...mountain, id: idCount})
            break
          default:
            break
        }
        idCount++
      }
      objsMap.push(objsMapRow)
    }
    console.log('objsMap', objsMap)
    // return an array of objects converted from our map input
    return objsMap
  }

  generateAdjList(objsMap) {
    let adjList = {}

    for (let y = 0; y < objsMap.length; y++) {
      for (let x = 0; x < objsMap[y].length; x++) {
        const adjTiles = []

        // !! NOT DRY REFACTOR ASAP
        if (objsMap[y - 1] && objsMap[x - 1])
          adjTiles.push(objsMap[y - 1][x - 1].id)
        if (objsMap[y - 1] && objsMap[x]) adjTiles.push(objsMap[y - 1][x].id)
        if (objsMap[y] && objsMap[x + 1]) adjTiles.push(objsMap[y][x + 1].id)
        if (objsMap[y + 1] && objsMap[x]) adjTiles.push(objsMap[y + 1][x].id)
        if (objsMap[y + 1] && objsMap[x - 1])
          adjTiles.push(objsMap[y + 1][x - 1].id)
        if (objsMap[y] && objsMap[x - 1]) adjTiles.push(objsMap[y][x - 1].id)

        adjList[objsMap[y][x].id] = adjTiles
      }
    }
    console.log('adjList', adjList)
    // return adjacency list that lists each node id an it's adjacent tiles
    return adjList
  }

  findRange(coordinates, magnitude) {
    // return possible nodes in range
  }
}

export default Gameboard

// console.log('building game', gameboard);
