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
import {getFogTiles, initializeFogTiles} from './renderers/fog-of-war'
import {unitSprites} from './renderers/units'
import {updateActionsLeftDisplay} from './renderers/sidebar'

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

socket.on('actionBroadcast', (actionType, unit, actionsRemaining, roomObj) => {
  console.log('bcast recieved from server:', unit)

  switch (actionType) {
    case MOVE:
      updateUnits(unit)
      attemptCapture(unit)
      //resets view radius around each unit for fog of war
      initializeFogTiles()
      unitSprites.forEach(unitSprite => {
        //update unfogged tiles around units belonging to a player
        if (unitSprite.data.player.playerName === gameState.me) {
          unitSprite.data.toggleSelected(false)
          getFogTiles(unitSprite.data)
        }
      })
      break
    case ATTACK:
      updateUnitsHealth(unit)
      break
    default:
      console.log('error, invalid action recieved')
  }
  //update gameState to match actionsRemaining passed via socket
  roomObj.actionsRemaining = actionsRemaining

  gameState.actionsRemaining = actionsRemaining

  updateActionsLeftDisplay()

  //check if current player has no actions remaining pass turn
  if (gameState.actionsRemaining < 1) {
    unitSprites.forEach(unitSprite => {
      //clears inactive tint from units
      unitSprite.tint = 0xffffff
    })
    takeTurn()
  }
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
