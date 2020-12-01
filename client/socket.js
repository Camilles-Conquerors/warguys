import io from 'socket.io-client'
import {updateUnits} from './index'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('actionBroadcast', unit => {
  console.log('bcast recieved from server', unit)
  updateUnits(unit)
})

export default socket
