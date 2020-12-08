import io from 'socket.io-client'
import {ATTACK, MOVE, updateUnits, updateUnitsHealth} from './actions/move'
import {
  unrender,
  renderSplash,
  renderLobby,
  renderGame,
  renderGameOver,
  takeTurn
} from './index'

const socket = io(window.location.origin)

socket.on('connect', () => {
  renderSplash()
  console.log('Connected!')
})

socket.on('actionBroadcast', (actionType, unit) => {
  console.log('bcast recieved from server:', unit)

  switch (actionType) {
    case MOVE:
      updateUnits(unit)
      break
    case ATTACK:
      updateUnitsHealth(unit)
      break
    default:
      console.log('error, invalid action recieved')
  }

  takeTurn()
  console.log(`recieved a(n) ${actionType} action`)
})

socket.on('createLobby', () => {
  // rooms[roomName] aka roomObj initialized with player1
  // unloading the splash screen and sending player1 to lobby screen
  unrender()
  renderLobby()
  console.log(`${socket.id} created the lobby`)
})

socket.on('startGame', (roomObj, playerName) => {
  // player 2 added to roomObj
  console.log(`you are ${playerName}`)
  console.log('roomObj', roomObj)
  unrender()
  renderGame(roomObj, playerName)
  console.log('game starting!')
  takeTurn()
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
