import io from 'socket.io-client'
import {updateUnits} from './actions/move'
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
  console.log('bcast recieved from server:', unit)
  console.log()
  updateUnits(unit)
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
