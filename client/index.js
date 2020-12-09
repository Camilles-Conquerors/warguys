import * as PIXI from 'pixi.js'
import TextInput from 'pixi-text-input'
import Gameboard from './classes/gameboard'
import {testBoard} from './hardcoded-maps'
import {renderBoard, BoardContainer} from './renderers/board'
import {unitSprites} from './renderers/units'
import socket from './socket'
import {getActionTiles, restoreTiles} from './renderers/action-tiles'
import Player from './classes/player'

// room/lobby system
// create a view that just has a button to join room
// click to join the room if not full
// if full give a message saying room is full
// a second view for player1 that indicates that they're waiting for another player to join
// figure out how to add a player
// third view renders the game board once both players joined
// figure out logic for when to render each view, once room is full start the game
// figure out what data we're passing between server and the gameboard

// turn order flow
// in index.js, initialize a gameState object to manage state for the local user
// in socket/index.js upon joining room, initialize a rooms[roomName] object, referred to as roomObj to manage state for all users in the room
// Gameboard class has method pointsToWin which emits the number of points to win, setting the pointsToWin prop on roomObj
// pointsToWin method also calls the setPointsToWin function from index.js, setting the pointsToWin prop on gameState object
// on startGame emit, we call renderGame from index.js, passing in playerName - which will either be player1 or player2
// we save assign the variable takeTurn = renderGame(playerName) in order to access the return function of renderGame, which will handle our turns switching over

// every time we wanna access the game state, we can send that roomObj over a socket
// but we wanna store a shallow copy on the client side for quick access so that we don't need to keep pinging the server
// only reference the the client side game state when we need to perform check
// but when we update the state, we send the update to server
// and then sync the server side state with the client side state
// socket.to sends to just that client
// io.to sends to all sockets in a room/connection

//mount PIXI to DOM
const canvas = document.getElementById('mycanvas')

const app = new PIXI.Application({
  view: canvas,
  resizeTo: window
})

export let GameContainer = new PIXI.Container()
//create GameContainer and append it to PIXI app
console.log(GameContainer.pivot)
console.log(GameContainer.width, ', ', GameContainer.height)
app.stage.addChild(GameContainer)

const testSprite = new PIXI.Sprite(
  new PIXI.Texture.from('images/faction_usa.png')
)

app.stage.addChild(testSprite)
testSprite.x = canvas.width / 2
testSprite.y = canvas.height / 2

function scaleGameContainerSize() {
  //find distace from container width/height to window width/height
  let heightDelta = canvas.height - GameContainer.height
  let widthDelta = canvas.width - GameContainer.width

  let diff = heightDelta < widthDelta ? heightDelta : widthDelta

  GameContainer.width = GameContainer.height += diff
  // GameContainer.height += diff;
}

function scaleGameContainerPosition() {
  GameContainer.x = canvas.width / 2
  GameContainer.y = canvas.height / 2
  console.log('pivot: ', GameContainer.pivot.x, ', ', GameContainer.pivot.y)
  console.log('position: ', GameContainer.x, ', ', GameContainer.y)
  //for testing
  testSprite.x = GameContainer.pivot.x
  testSprite.y = GameContainer.pivot.y
}

export function scaleGameContainer() {
  scaleGameContainerSize()
  console.log(GameContainer.width, ', ', GameContainer.height)
  scaleGameContainerPosition()
  console.log(canvas.height)
}

window.addEventListener('resize', scaleGameContainer) //! This is not optimal, it fires off many times. Perhaps have it fire off when user releases mouse button when trying to rescale

// function to remove a view so that we can render the next view
export function unrender() {
  GameContainer.removeChildAt(0)
}

// Splash screen
export function renderSplash() {
  // create SplashContainer
  let SplashContainer = new PIXI.Container()
  GameContainer.addChild(SplashContainer)

  // create logo sprite and add it to SplashContainer
  const logoTexture = PIXI.Texture.from('/images/logo.png')
  const logoSprite = new PIXI.Sprite(logoTexture)
  logoSprite.x = 100
  logoSprite.y = 50
  SplashContainer.addChild(logoSprite)

  // create text obj and add it to SplashContainer
  let text = new PIXI.Text(
    'Welcome! Enter a room code to create or join a game.',
    {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    }
  )
  text.x = 100
  text.y = 200
  SplashContainer.addChild(text)

  // create an input field to enter room code, add to SplashContainer
  let inputRoomCode = new TextInput({
    input: {
      fontFamily: 'Arial',
      fontSize: '36px',
      padding: '12px',
      width: '500px',
      color: '#26272E'
    },
    box: {
      default: {
        fill: 0xe8e9f3,
        rounded: 12,
        stroke: {color: 0xcbcee0, width: 3}
      },
      focused: {
        fill: 0xe1e3ee,
        rounded: 12,
        stroke: {color: 0xabafc6, width: 3}
      },
      disabled: {fill: 0xdbdbdb, rounded: 12}
    }
  })

  inputRoomCode.placeholder = 'Enter Room Code...'
  inputRoomCode.x = 100
  inputRoomCode.y = 300
  // inputRoomCode.pivot.x = inputRoomCode.width / 2
  // inputRoomCode.pivot.y = inputRoomCode.height / 2
  SplashContainer.addChild(inputRoomCode)

  // add button texture and create sprite from it
  const playButton = PIXI.Texture.from('/images/play_button.png')
  const buttonTextures = [playButton]
  let playButtonSprite = new PIXI.Sprite(buttonTextures[0])
  playButtonSprite.x = 100
  playButtonSprite.y = 400
  SplashContainer.addChild(playButtonSprite)

  // on click event for clicking join room
  playButtonSprite.interactive = true
  playButtonSprite.buttonMode = true
  playButtonSprite.on('click', () => {
    const roomName = inputRoomCode.text
    if (roomName.length) {
      // if text field is filled
      console.log(`you're about to join the room: ${roomName}`)
      socket.emit('joinRoom', roomName)
    } else {
      // if text field is empty
      let emptyRoomNameErr = new PIXI.Text('Please enter a room code', {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xff0000,
        align: 'center'
      })
      emptyRoomNameErr.x = 100
      emptyRoomNameErr.y = 250
      SplashContainer.addChild(emptyRoomNameErr)
    }
  })
}

// renderSplash()

export function renderLobby(roomName) {
  // create LobbyContainer
  let LobbyContainer = new PIXI.Container()
  GameContainer.addChild(LobbyContainer)

  // create text obj and add it to LobbyContainer
  let text = new PIXI.Text(
    `Your room code is ${roomName} \n Waiting for an opponent to join...`,
    {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    }
  )
  LobbyContainer.addChild(text)
}

// renderLobby()

// initialize global variables
export let SCALE = 0
export let selectedUnit = {}
export let gameboard = {}

export let gameState = {
  currentTurn: 'player2',
  pointsToWin: 0,
  currentPlayers: {}
}

export function setPointsToWin(pointsToWin) {
  gameState.pointsToWin = pointsToWin
}

export function updateSelectedUnit(newObject) {
  if (selectedUnit.data) {
    selectedUnit.data.toggleSelected(false)
  }

  selectedUnit = newObject

  if (selectedUnit.data) {
    selectedUnit.data.toggleSelected(true)
    getActionTiles(selectedUnit.data)
  } else {
    restoreTiles()
  }
}

export function getOffset(y) {
  return y % 2 === 0 ? SCALE / 2 : 0
}

export function renderGame(roomObj, playerName) {
  // assign vars to players in roomObj
  const player1 = roomObj.currentPlayers.player1
  const player2 = roomObj.currentPlayers.player2

  // create the gameboard using the hardcoded testBoard
  gameboard = new Gameboard(testBoard, 5)
  // sets tile width and height
  SCALE = app.renderer.screen.height / gameboard.board.length

  // run renders for the board and unit, which will add them to BoardContainer
  renderBoard(gameboard)

  // sets playerName in gameState
  gameState.me = playerName
  // initialize Player instances for player1 & player 2 and save to gameState
  // this will also render the player's units to the GameBoard container
  gameState.currentPlayers.player1 = new Player(player1.id, player1.playerName)
  gameState.currentPlayers.player2 = new Player(player2.id, player2.playerName)
  // add tile and unit sprites to the GameContainer
  GameContainer.addChild(BoardContainer)
}

export function takeTurn() {
  // toggle currentTurn between player1 and player2
  gameState.currentTurn =
    gameState.currentTurn === 'player1' ? 'player2' : 'player1'
  console.log(`${gameState.currentTurn}'s turn`)

  const currentPlayer = gameState.currentPlayers[gameState.currentTurn]
  currentPlayer.calculatePoints()

  if (currentPlayer.victoryPoints >= gameState.pointsToWin) {
    socket.emit('victory', currentPlayer.playerName)
    return
  }

  // sets default unit interaction for beginning of a turn
  unitSprites.forEach(unitSprite => {
    //remove unitSprite from BoardContainer
    BoardContainer.removeChild(unitSprite)
    // if it is your turn, you can click on your units to begin a turn
    if (
      gameState.currentTurn === gameState.me &&
      gameState.currentTurn === unitSprite.data.player.playerName
    ) {
      unitSprite.interactive = true
      unitSprite.buttonMode = true
    } else {
      // if not your turn, you cannot click on anything
      unitSprite.interactive = false
      unitSprite.buttonMode = false
    }

    BoardContainer.addChild(unitSprite)
  })
}

// error screen when room is full
export function renderRoomFull() {
  let RoomFullContainer = new PIXI.Container()
  GameContainer.addChild(RoomFullContainer)

  // create text obj and add it to GameOverContainer
  let text = new PIXI.Text(
    'That room is already full \n Refresh page to try again!',
    {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    }
  )
  RoomFullContainer.addChild(text)
}

// game over screen
export function renderGameOver(winner) {
  // create GameOverContainer
  let GameOverContainer = new PIXI.Container()
  GameContainer.addChild(GameOverContainer)

  // create text obj and add it to GameOverContainer
  let text = new PIXI.Text(
    `${winner} wins the Game! \n Refresh page to play again!`,
    {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    }
  )
  GameOverContainer.addChild(text)
  // !add join button to gameover splash to allow user to enter another room
  // !find and fix issue with implementation - not working as is
  // //! add button texture and create sprite from it
  // const joinButton = PIXI.Texture.from('/images/join_button_placeholder.png')
  // const buttonTextures = [joinButton]
  // let joinButtonSprite = new PIXI.Sprite(buttonTextures[0])
  // joinButtonSprite.y = 200
  // GameOverContainer.addChild(joinButtonSprite)
}
