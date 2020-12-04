import io from 'socket.io-client'
import {updateUnits} from './actions/move'
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

socket.on('actionBroadcast', (unit, roomObj, playerName) => {
  console.log('bcast recieved from server:', unit)
  console.log()
  updateUnits(unit)
  takeTurn(roomObj, playerName)
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
  renderGame()
  //! call Game.addPlayer to add player2
  console.log('game starting!')
  takeTurn(roomObj, playerName)
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
