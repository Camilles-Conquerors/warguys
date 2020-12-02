module.exports = io => {
  let room1 = {}
  let room2 = {}
  let rooms = [room1, room2]

  const nsp1 = io.of('/room1')

  io.on('connection', socket => {
    //console.log(socket.rooms)
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    if (!room1.player1) {
      room1.player1 = socket.id
      socket.join('room1')
      console.log(socket.id, 'has been assigned to player1', room1)
    } else if (!room1.player2) {
      room1.player2 = socket.id
      socket.join('room1')
      console.log(socket.id, 'has been assigned to player2', room1)
      console.log('socket rooms', socket.rooms)
    } else {
      socket
        .to(socket.id)
        .emit('roomFull', 'please try another room, this one is full')
      console.log(socket.id, 'is waiting for a room to open')
    }
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
      if (room1.player1 === socket.id || room1.player2 === socket.id) {
        console.log(socket.id, 'is leaving room1')
        room1.player1 === socket.id
          ? delete room1.player1
          : delete room1.player2
        socket.leave('room1')
      }
    })
    if (room1.player1 === socket.id || room1.player2 === socket.id) {
      socket.on('updateUnits', unit => {
        console.log('Enemy has acted!: ', unit)
        socket.to('room1').broadcast.emit('actionBroadcast', unit)
      })
    }
  })
}
