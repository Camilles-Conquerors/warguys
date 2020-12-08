import io from 'socket.io-client'
import {updateUnits, updateUnitsHealth} from './actions/move'
import {
  unrender,
  renderSplash,
  renderLobby,
  renderGame,
  renderGameOver,
  gameState,
  takeTurn
} from './index'

const socket = io(window.location.origin)

socket.on('connect', () => {
  renderSplash()
  console.log('Connected!')
})

socket.on('actionBroadcast', (unit, roomObj, currentTurn) => {
  let actionType = 'unknown'
  console.log('bcast recieved from server:', unit)
  console.log('emitting to all users in the room, roomObj:', roomObj)
  if (unit.coordinates) {
    actionType = 'move'
    updateUnits(unit)
  } else if (unit.health > -1) {
    actionType = 'attack'
    updateUnitsHealth(unit)
  }
  takeTurn(roomObj, currentTurn)
  console.log(`recieved a(n) ${actionType} action`)
})

socket.on('joinLobby', () => {
  unrender()
  renderLobby()
  //! create a new Game instance
  //! call Game.addPlayer to add player1
  console.log(`${socket.id} Joined the lobby`)
})

socket.on('startGame', (roomObj, playerName) => {
  console.log(`you are ${playerName}`)
  console.log('roomObj', roomObj)
  unrender()
  renderGame(roomObj, playerName)
  roomObj = gameState
  console.log('socket gs and ro----->')
  console.log('gs', gameState)
  console.log('ro', roomObj)
  //! call Game.addPlayer to add player2
  console.log('game starting!')
  takeTurn(roomObj)
})

socket.on('roomFull', msg => {
  console.log(msg)
})

socket.on('gameOver', winner => {
  console.log(winner, 'wins the game')
  unrender()
  renderGameOver(winner)
})

export default socket
