import {plain, mountain} from '../hardcoded-terrain'
import TileNode from './tile'
import socket from '../socket'
import {setPointsToWin} from '../index'
//! utilize classes to generate graph/map (and methods to traverse and utilize them)

// Gameboard args
// map - a matrix (grid) of tiles
// when we make a new gameboard, take in an array of numbers representing tile types
// convert the array into an array of objects - each object contains info about the tile as well as that tile's id
//method that creates associates between nodes

export default class Gameboard {
  constructor(map, pointsToWin = 1) {
    this.board = this.generateBoard(map)
    this.assignNeighbors(this.board)
    this.pointsToWin(pointsToWin)
  }

  pointsToWin(pointsToWin) {
    socket.emit('setPointsToWin', pointsToWin)
    console.log('gameboard sets p2w', pointsToWin)
    setPointsToWin(pointsToWin)
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

        // We have to do this in the same order, clock-wise to do angle calculations properly
        if (directionToShift === 'right') {
          //top right
          if (availableSides.up && availableSides[directionToShift])
            currentTile.neighbors.push(board[y - 1][x + 1])
          //right
          if (availableSides.right) currentTile.neighbors.push(board[y][x + 1])
          //bottom right
          if (availableSides.down && availableSides[directionToShift])
            currentTile.neighbors.push(board[y + 1][x + 1])
          //bottom left
          if (availableSides.down) currentTile.neighbors.push(board[y + 1][x])
          //left
          if (availableSides.left) currentTile.neighbors.push(board[y][x - 1])
          //topleft
          if (availableSides.up) currentTile.neighbors.push(board[y - 1][x])
        } else {
          //top right
          if (availableSides.up) currentTile.neighbors.push(board[y - 1][x])
          //right
          if (availableSides.right) currentTile.neighbors.push(board[y][x + 1])
          //bottom right
          if (availableSides.down) currentTile.neighbors.push(board[y + 1][x])
          //bottom left
          if (availableSides.down && availableSides[directionToShift])
            currentTile.neighbors.push(board[y + 1][x - 1])
          //left
          if (availableSides.left) currentTile.neighbors.push(board[y][x - 1])
          //topleft
          if (availableSides.up && availableSides[directionToShift])
            currentTile.neighbors.push(board[y - 1][x - 1])
        }
      }
    }
  }
}
