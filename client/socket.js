import io from 'socket.io-client'
import {updateUnits} from './actions/move'
import {unrender, renderSplash, renderLobby} from './index'

const socket = io(window.location.origin)

socket.on('connect', () => {
  renderSplash()
  console.log('Connected!')
})

socket.on('actionBroadcast', unit => {
  console.log('bcast recieved from server', unit)
  updateUnits(unit)
})

socket.on('joinLobby', () => {
  unrender()
  renderLobby()
  console.log(`${socket.id} Joined the lobby`)
})

socket.on('roomFull', msg => {
  console.log(msg)
})

export default socket
