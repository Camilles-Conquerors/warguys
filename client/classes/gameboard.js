import socket from '../socket'
import {setPointsToWin} from '../index'
import Plain from './tiles/plain'
import Mountain from './tiles/mountain'
import Point from './tiles/point'
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
    ////1,3   15,13
    //1,5   15,11
    //2,1   14,15
    //0,7   16,9
    //2,8   14,8
    this.defaultUnits = [
      {playerName: 'player1', unitName: 'Jack', currentTile: this.board[1][3]},
      {playerName: 'player1', unitName: 'Henry', currentTile: this.board[1][5]},
      {playerName: 'player1', unitName: 'Joey', currentTile: this.board[2][1]},
      {playerName: 'player1', unitName: 'Rob', currentTile: this.board[0][7]},
      {playerName: 'player1', unitName: 'Mike', currentTile: this.board[2][8]},
      {
        playerName: 'player2',
        unitName: 'Helmut',
        currentTile: this.board[15][13]
      },
      {
        playerName: 'player2',
        unitName: 'Karl',
        currentTile: this.board[15][11]
      },
      {
        playerName: 'player2',
        unitName: 'Uwe',
        currentTile: this.board[14][15]
      },
      {
        playerName: 'player2',
        unitName: 'Holger',
        currentTile: this.board[16][9]
      },
      {
        playerName: 'player2',
        unitName: 'Friedrich',
        currentTile: this.board[14][8]
      }
    ]
  }

  pointsToWin(pointsToWin) {
    socket.emit('setPointsToWin', pointsToWin)
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
            objsMapRow.push(new Plain(idCount, {x, y}))
            break
          case 1:
            objsMapRow.push(new Mountain(idCount, {x, y}))
            break
          case 2:
            objsMapRow.push(new Point(idCount, {x, y}, 1))
            break
          default:
            break
        }
        idCount++
      }
      newBoard.push(objsMapRow)
    }

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

  findTileByCoordinates(coordinates) {
    return this.board[coordinates.y][coordinates.x]
  }

  getDefaultUnits() {
    return this.defaultUnits
  }
}
