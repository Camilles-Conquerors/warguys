module.exports = io => {
  // client: emit a joinRoom event
  // server: listen for joinRoom and checks the following
  // - does the room already exist
  //   - yes? do the next check
  //   - no? create room, add user to room, render lobby for user
  // - does the room have space for a new player?
  //   - yes? add user to the room and start the game
  //   - no? send the user back to the splash screen with text indicating room is full

  // every time we render a view, we need to emit
  // joinLobby
  //   emit: indicate player1 sent to lobby
  //   listener: render the lobbyContainer
  // startGame
  //   emit: indicate the game is ready to start
  //   listener: render the gameBoard

  let rooms = {}

  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('joinRoom', roomName => {
      console.log('roomName', roomName)
      // if the room does not already exist
      if (!rooms[roomName]) {
        // if room doesn't exist, create the room as player1
        rooms[roomName] = {
          name: roomName,
          players: {
            //? if needed, we can turn player1 into an object with mutliple props (id, display name, etc)
            player1: socket.id
          }
        }
        socket.join(roomName).emit('joinLobby')
      } else if (rooms[roomName] && !rooms[roomName].players.player2) {
        // if room exists and has 1 player inside, join room and start the game
        rooms[roomName].players.player2 = socket.id
        socket.join(roomName).emit('startGame')
        socket.to(roomName).emit('startGame')
      }
      //! handle case if room is full
      console.log('rooms', rooms)
    })

    //! handle player leaving the room by first popping up a warning message in their window
    // ask them to confirm if they wanna leave page
    // if they leave the other player wins the game by default
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })

  //! reimplement updating units over socket on movement

  // const nsp1 = io.of('/room1')

  // io.on('connection', socket => {
  //   //console.log(socket.rooms)
  //   console.log(`A socket connection to the server has been made: ${socket.id}`)
  //   if (!room1.player1) {
  //     room1.player1 = socket.id
  //     socket.join('room1')
  //     console.log(socket.id, 'has been assigned to player1', room1)
  //   } else if (!room1.player2) {
  //     room1.player2 = socket.id
  //     socket.join('room1')
  //     console.log(socket.id, 'has been assigned to player2', room1)
  //     console.log('socket rooms', socket.rooms)
  //   } else {
  //     socket
  //       .to(socket.id)
  //       .emit('roomFull', 'please try another room, this one is full')
  //     console.log(socket.id, 'is waiting for a room to open')
  //   }
  //   socket.on('disconnect', () => {
  //     console.log(`Connection ${socket.id} has left the building`)
  //     if (room1.player1 === socket.id || room1.player2 === socket.id) {
  //       console.log(socket.id, 'is leaving room1')
  //       room1.player1 === socket.id
  //         ? delete room1.player1
  //         : delete room1.player2
  //       socket.leave('room1')
  //     }
  //   })
  //   if (room1.player1 === socket.id || room1.player2 === socket.id) {
  //     socket.on('updateUnits', unit => {
  //       console.log('Enemy has acted!: ', unit)
  //       socket.to('room1').broadcast.emit('actionBroadcast', unit)
  //     })
  //   }
  // })
}
