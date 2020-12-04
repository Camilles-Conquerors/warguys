import io from 'socket.io-client'
import {updateUnits, updateUnitsHealth} from './actions/move'
import {
  unrender,
  renderSplash,
  renderLobby,
  renderGame,
  renderGameOver
} from './index'

const socket = io(window.location.origin)

socket.on('connect', () => {
  renderSplash()
  console.log('Connected!')
})

socket.on('actionBroadcast', unit => {
  let actionType = 'unknown'
  console.log('bcast recieved from server:', unit)
  if (unit.coordinates) {
    actionType = 'move'
    updateUnits(unit)
  } else if (unit.health > -1) {
    actionType = 'attack'
    updateUnitsHealth(unit)
  }
  console.log(`recieved a(n) ${actionType} action`)
})

socket.on('joinLobby', () => {
  unrender()
  renderLobby()
  console.log(`${socket.id} Joined the lobby`)
})

socket.on('startGame', () => {
  unrender()
  renderGame()
  console.log('game starting!')
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
