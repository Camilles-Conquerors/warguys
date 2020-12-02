import {plain, mountain} from '../hardcoded-terrain'
import TileNode from './tile'
//! utilize classes to generate graph/map (and methods to traverse and utilize them)

// Gameboard args
// map - a matrix (grid) of tiles
// when we make a new gameboard, take in an array of numbers representing tile types
// convert the array into an array of objects - each object contains info about the tile as well as that tile's id
//method that creates associates between nodes

export default class Gameboard {
  constructor(map) {
    this.board = this.generateBoard(map)
    this.assignNeighbors(this.board)
  }

  generateBoard(map) {
    let newBoard = []
    let idCount = 0
    for (let y = 0; y < map.length; y++) {
      let objsMapRow = []
      for (let x = 0; x < map[y].length; x++) {
        switch (map[y][x]) {
          case 0:
            objsMapRow.push(new TileNode(plain, idCount, {x, y}))
            break
          case 1:
            objsMapRow.push(new TileNode(mountain, idCount, {x, y}))
            break
          default:
            break
        }
        idCount++
      }
      newBoard.push(objsMapRow)
    }
    //console.log('objsMap', newBoard)
    // return an array of objects converted from our map input
    return newBoard
  }

  // eslint-disable-next-line complexity
  assignNeighbors(board) {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const currentTile = board[y][x]

        // checking if tile is on an edge to avoid errors
        let availableSides = {
          up: y > 0,
          left: x > 0,
          right: x < board[y].length - 1,
          down: y < board.length - 1
        }

        //even y-rows look diagonally right / odds, left
        let directionToShift = y % 2 === 0 ? 'right' : 'left'

        //assigning neighbors based on above criteria
        if (availableSides.left) currentTile.neighbors.push(board[y][x - 1])
        if (availableSides.up) currentTile.neighbors.push(board[y - 1][x])
        if (availableSides.right) currentTile.neighbors.push(board[y][x + 1])
        if (availableSides.down) currentTile.neighbors.push(board[y + 1][x])

        if (availableSides.up && availableSides[directionToShift]) {
          if (directionToShift === 'right') {
            currentTile.neighbors.push(board[y - 1][x + 1])
          } else {
            currentTile.neighbors.push(board[y - 1][x - 1])
          }
        }
        if (availableSides.down && availableSides[directionToShift]) {
          if (directionToShift === 'right') {
            currentTile.neighbors.push(board[y + 1][x + 1])
          } else {
            currentTile.neighbors.push(board[y + 1][x - 1])
          }
        }
      }
    }
  }
}
