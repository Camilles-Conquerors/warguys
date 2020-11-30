import io from 'socket.io-client'
import {renderUnit} from './'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected')
  console.log('Joined room')
})

socket.on('unitRender', unit => {
  console.log('Enemy unit moved!: ', unit)
  renderUnit(unit)
})

export default socket
