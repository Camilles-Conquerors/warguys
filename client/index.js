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
  width: window.outerWidth,
  height: window.outerHeight
})

//create GameContainer and append it to PIXI app
export let GameContainer = new PIXI.Container()
app.stage.addChild(GameContainer)

// function to remove a view so that we can render the next view
export function unrender() {
  GameContainer.removeChildAt(0)
}

// Splash screen
export function renderSplash() {
  // create SplashContainer
  let SplashContainer = new PIXI.Container()
  GameContainer.addChild(SplashContainer)

  // create text obj and add it to SplashContainer
  let text = new PIXI.Text('Join room to start the game!', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center'
  })
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

  inputRoomCode.placeholder = 'Enter your Text...'
  inputRoomCode.x = 500
  inputRoomCode.y = 300
  inputRoomCode.pivot.x = inputRoomCode.width / 2
  inputRoomCode.pivot.y = inputRoomCode.height / 2
  SplashContainer.addChild(inputRoomCode)

  // add button texture and create sprite from it
  const joinButton = PIXI.Texture.from('/images/join_button_placeholder.png')
  const buttonTextures = [joinButton]
  let joinButtonSprite = new PIXI.Sprite(buttonTextures[0])
  joinButtonSprite.y = 400
  SplashContainer.addChild(joinButtonSprite)

  // on click event for clicking join room
  joinButtonSprite.interactive = true
  joinButtonSprite.buttonMode = true
  joinButtonSprite.on('click', () => {
    const roomName = inputRoomCode.text
    console.log(`you're about to join the room: ${roomName}`)
    socket.emit('joinRoom', roomName)
  })
}

// renderSplash()

export function renderLobby() {
  // create LobbyContainer
  let LobbyContainer = new PIXI.Container()
  GameContainer.addChild(LobbyContainer)

  // create text obj and add it to LobbyContainer
  let text = new PIXI.Text('Waiting for an opponent to join...', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center'
  })
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

export function renderGame(initialRoomObj, playerName) {
  //set playerName in gameState
  gameState.me = playerName
  // create the gameboard using the hardcoded testBoard
  gameboard = new Gameboard(testBoard)
  // sets tile width and height
  SCALE = app.renderer.screen.height / gameboard.board.length

  //run renders for the board and unit, which will add them to BoardContainer
  renderBoard(gameboard)
  //initialize Player instance for player1
  gameState.currentPlayers.player1 = new Player(
    initialRoomObj.currentPlayers.player1.id,
    initialRoomObj.currentPlayers.player1.playerName
  )
  console.log(gameState.currentPlayers.player1)
  gameState.currentPlayers.player1.initializeDefaultUnits()
  gameState.currentPlayers.player1.renderActiveUnits()
  //initialize player instance for player2
  gameState.currentPlayers.player2 = new Player(
    initialRoomObj.currentPlayers.player2.id,
    initialRoomObj.currentPlayers.player2.playerName
  )
  gameState.currentPlayers.player2.initializeDefaultUnits()
  gameState.currentPlayers.player2.renderActiveUnits()

  //renderUnits(defaultUnits)
  GameContainer.addChild(BoardContainer)
}

export function takeTurn() {
  //Global gameState stored locally
  //socket object is owner of currentPlayers
  gameState.currentTurn =
    gameState.currentTurn === 'player1' ? 'player2' : 'player1'
  console.log(`it is ${gameState.currentTurn}'s turn`)

  // if not your turn, you cannot click on anything
  // if it is your turn, you can click on your units to select them
  // once you select a unit, you can click on any enemy unit within range

  unitSprites.forEach(unitSprite => {
    BoardContainer.removeChild(unitSprite)

    if (
      gameState.currentTurn === gameState.me &&
      gameState.currentTurn === unitSprite.data.playerName
    ) {
      unitSprite.interactive = true
      unitSprite.buttonMode = true
    } else {
      unitSprite.interactive = false
      unitSprite.buttonMode = false
    }

    BoardContainer.addChild(unitSprite)
  })
}

//gameOver screen
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

  // // on click event for clicking join room
  // joinButtonSprite.interactive = true
  // joinButtonSprite.buttonMode = true
  // joinButtonSprite.on('click', () => {
  //   const roomName = 'room1'
  //   console.log("you're about to another game")
  //   socket.emit('joinRoom', roomName)
  // })
}
