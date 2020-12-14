import io from 'socket.io-client'
import {MOVE, updateUnits} from './actions/move'
import {ATTACK, updateUnitsHealth} from './actions/attack'
import {
  unrender,
  renderSplash,
  renderLobby,
  renderGame,
  renderGameOver,
  renderRoomFull,
  takeTurn,
  gameState
} from './index'
import {attemptCapture} from './actions/capture'
import {getFogTiles, unrenderFogTiles} from './renderers/fog-of-war'
import {unitSprites} from './renderers/units'

const socket = io(window.location.origin)

socket.on('connect', () => {
  renderSplash()
  // // -v- part of scaling window
  //GameContainer.pivot.x = GameContainer.width / 2
  //GameContainer.pivot.y = GameContainer.height / 2
  // scaleGameContainer()
  // // -^- part of scaling window
  console.log('Connected!')
})

socket.on('actionBroadcast', (actionType, unit) => {
  console.log('bcast recieved from server:', unit)

  switch (actionType) {
    case MOVE:
      updateUnits(unit)
      attemptCapture(unit)
      //updates each sprite's view radius for fog of war
      //unrenderFogTiles()
      unitSprites.forEach(unitSprite => {
        //update unfogged tiles if moved player belongs to me
        if (
          //gameState.currentTurn === gameState.me &&
          unitSprite.data.player.playerName === gameState.me
        ) {
          unitSprite.data.toggleSelected(false)
          getFogTiles(unitSprite.data)
        } else if (gameState.me !== unitSprite.data.player.playerName) {
          //and it the enemy is in view
          console.log('buildiong...')
        }
      })

      console.log(
        'player obj for most recent turn',
        gameState.currentPlayers[gameState.currentTurn]
      )
      break
    case ATTACK:
      updateUnitsHealth(unit)
      break
    default:
      console.log('error, invalid action recieved')
  }
  takeTurn()
  console.log(`recieved a(n) ${actionType} action`)
})

socket.on('createLobby', roomName => {
  // rooms[roomName] aka roomObj initialized with player1
  // unloading the splash screen and sending player1 to lobby screen
  unrender()
  renderLobby(roomName)
  console.log(`${socket.id} created the lobby`)
})

socket.on('startGame', (roomObj, playerName) => {
  // player 2 added to roomObj
  console.log(`you are ${playerName}`)
  console.log('roomObj', roomObj)
  unrender()
  renderGame(roomObj, playerName)
  //GameContainer.pivot.x = GameContainer.width / 2
  //GameContainer.pivot.y = GameContainer.height / 2
  //scaleContainer(GameContainer)
  //visualize(GameContainer)

  //window.addEventListener('resize', () => {
  //  scaleContainer(GameContainer)
  //  updateVisualizer()
  //}) //! This is not optimal, it fires off many times. Perhaps have it fire off when user releases mouse button when trying to rescale

  console.log('game starting!')
  takeTurn()
})

socket.on('roomFull', msg => {
  unrender()
  renderRoomFull()
  console.log(msg)
})

socket.on('gameOver', winner => {
  console.log(winner, 'wins the game')
  unrender()
  renderGameOver(winner)
})

export default socket
