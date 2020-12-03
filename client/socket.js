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

socket.on('joinLobby', (playersObj, player) => {
  unrender()
  renderLobby()
  //! create a new Game instance
  //! call Game.addPlayer to add player1
  console.log(`you are ${player}`)
  console.log(`${socket.id} Joined the lobby`)
})

socket.on('startGame', (playersObj, player) => {
  unrender()
  renderGame()
  //! call Game.addPlayer to add player2
  console.log(`you are ${player}`)
  console.log('playersObj', playersObj)
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
