module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
    socket.on('unitRender', unit => {
      console.log('Something has happened: ', unit)
      socket.broadcast.emit('unitMoveBC', unit)
    })
  })
}
