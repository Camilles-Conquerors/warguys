import io from 'socket.io-client'
import {updateUnits, updateUnitsHealth} from './actions/move'
import {
  unrender,
  renderSplash,
  renderLobby,
  renderGame,
  renderGameOver,
  renderRoomFull
} from './index'

const socket = io(window.location.origin)

export let takeTurn

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

socket.on('createLobby', roomName => {
  // rooms[roomName] aka roomObj initialized with player1
  // unloading the splash screen and sending player1 to lobby screen
  unrender()
  renderLobby(roomName)
  console.log(`${socket.id} created the lobby`)
})

socket.on('startGame', (roomObj, playerName) => {
  // player 2 added to roomObj
  console.log(`you are ${playerName}`)
  console.log('roomObj', roomObj)
  unrender()
  takeTurn = renderGame(playerName)
  console.log('game starting!')
  takeTurn(roomObj)
})

socket.on('roomFull', msg => {
  unrender()
  renderRoomFull()
  console.log(msg)
})

socket.on('gameOver', winner => {
  console.log(winner, 'wins the game')
  unrender()
  renderGameOver(winner)
})

export default socket
