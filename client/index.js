import * as PIXI from 'pixi.js'
import TextInput from 'pixi-text-input'
import Gameboard from './classes/gameboard'
import {testBoard} from './hardcoded-maps'
import {renderBoard, BoardContainer} from './renderers/board'
import {unitSprites} from './renderers/units'
import socket from './socket'
import {getActionTiles, restoreTiles} from './renderers/action-tiles'
import Player from './classes/player'
import {
  SidebarContainer,
  renderSidebar,
  updateCurrentTurnDisplay,
  sidebarDisplays,
  updatePointsDisplays,
  updateActionsLeftDisplay
} from './renderers/sidebar'
import {scaleContainer} from './scaling-tools'

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

// initialize global variables
export let SCALE = 0
export let selectedUnit = {}
export let gameboard = {}

export let gameState = {
  currentTurn: 'player2',
  actionsRemaining: 0,
  pointsToWin: 0,
  currentPlayers: {},
  colorblindMode: false
}

export function setPointsToWin(pointsToWin) {
  gameState.pointsToWin = pointsToWin
}

export function updateSelectedUnit(newObject) {
  //allows us to properly unrender and remove any info about a previously selected unit (if it exists)
  if (selectedUnit.data) {
    selectedUnit.data.toggleSelected(false)
  }

  //updates selectedUnit to equal newObject
  selectedUnit = newObject

  //properly renders and updates newly selected object (if it exists)
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

//mount PIXI to DOM
const canvas = document.getElementById('mycanvas')

const app = new PIXI.Application({
  view: canvas,
  width: window.outerWidth,
  height: window.outerHeight,
  resizeTo: window
})

// we're setting these so that the renderer fits to the window size upon start
// we have a style tag in index.html setting the padding and margins for all html elements to 0
// this way, we can get rid of the white lines along the edges
//? maybe we'll implement dynamic resizing later but for now this should do
app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)

//create GameContainer and append it to PIXI app
export let GameContainer = new PIXI.Container()
// console.log(GameContainer.pivot)

app.stage.addChild(GameContainer)
//scaleContainer(GameContainer)

// function to remove a view so that we can render the next view
export function unrender() {
  while (GameContainer.children.length) {
    GameContainer.removeChildAt(0)
  }
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
    "Welcome! Enter a room code to create or join a game. \n If you're new, click on How to Play to get started!",
    {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'left'
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

  renderSplashButtons(SplashContainer, inputRoomCode)
}

export function renderSplashButtons(SplashContainer, inputRoomCode) {
  renderPlayButton(SplashContainer, inputRoomCode)

  renderInstructionsButton(SplashContainer)

  renderColorblindButton(SplashContainer)
}

export function renderPlayButton(SplashContainer, inputRoomCode) {
  // add play button texture and create sprite from it
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
      emptyRoomNameErr.y = 260
      SplashContainer.addChild(emptyRoomNameErr)
    }
  })
}

export function renderInstructionsButton(SplashContainer) {
  // add how to play button
  const instructionsButton = PIXI.Texture.from('/images/how_to_play_button.png')
  const instructionsButtonTextures = [instructionsButton]
  let instructionsButtonSprite = new PIXI.Sprite(instructionsButtonTextures[0])
  instructionsButtonSprite.x = 264
  instructionsButtonSprite.y = 400
  SplashContainer.addChild(instructionsButtonSprite)

  // on click event for clicking instructions button
  instructionsButtonSprite.interactive = true
  instructionsButtonSprite.buttonMode = true
  instructionsButtonSprite.on('click', () => {
    unrender()
    renderInstructions()
  })
}

export function renderColorblindButton(SplashContainer) {
  // add colorblind button textures and create sprite from it
  const colorblindButtonOff = PIXI.Texture.from(
    '/images/colorblind_button_off.png'
  )
  const colorblindButtonOn = PIXI.Texture.from(
    '/images/colorblind_button_on.png'
  )
  const colorblindButtonTextures = [colorblindButtonOff, colorblindButtonOn]

  const colorblindButtonOffSprite = new PIXI.Sprite(colorblindButtonTextures[0])
  colorblindButtonOffSprite.x = 100
  colorblindButtonOffSprite.y = 440
  SplashContainer.addChild(colorblindButtonOffSprite)

  const colorblindButtonOnSprite = new PIXI.Sprite(colorblindButtonTextures[1])
  colorblindButtonOnSprite.x = 100
  colorblindButtonOnSprite.y = 440

  // on click event for clicking colorblind off button
  colorblindButtonOffSprite.interactive = true
  colorblindButtonOffSprite.buttonMode = true
  colorblindButtonOffSprite.on('click', () => {
    // if colorblind mode off, set to on and render colorblindButtonOnSprite
    gameState.colorblindMode = true
    console.log('turning on colorblind mode', gameState)
    SplashContainer.removeChild(colorblindButtonOffSprite)
    SplashContainer.addChild(colorblindButtonOnSprite)
  })

  colorblindButtonOnSprite.interactive = true
  colorblindButtonOnSprite.buttonMode = true
  colorblindButtonOnSprite.on('click', () => {
    // if colorblind mode On, set to off and render colorblindButtonOffSprite
    gameState.colorblindMode = false
    console.log('turning off colorblind mode', gameState)
    SplashContainer.removeChild(colorblindButtonOnSprite)
    SplashContainer.addChild(colorblindButtonOffSprite)
  })
}

// renderSplash()

export function renderInstructions() {
  let InstructionsContainer = new PIXI.Container()
  GameContainer.addChild(InstructionsContainer)

  const instructionsTexture = PIXI.Texture.from('/images/instructions.png')
  const instructionsSprite = new PIXI.Sprite(instructionsTexture)
  InstructionsContainer.addChild(instructionsSprite)

  renderInstructionsButtons(InstructionsContainer)
}

export function renderInstructionsButtons(InstructionsContainer) {
  // add back button
  const backButton = PIXI.Texture.from('/images/back_button.png')
  const backButtonTextures = [backButton]
  let backButtonSprite = new PIXI.Sprite(backButtonTextures[0])
  backButtonSprite.x = 375
  backButtonSprite.y = 810
  InstructionsContainer.addChild(backButtonSprite)

  // on click event for clicking back button
  backButtonSprite.interactive = true
  backButtonSprite.buttonMode = true
  backButtonSprite.on('click', () => {
    unrender()
    renderSplash()
  })
}

export function renderLobby(roomName) {
  // create LobbyContainer
  let LobbyContainer = new PIXI.Container()
  GameContainer.addChild(LobbyContainer)

  // create text obj and add it to LobbyContainer
  let text1 = new PIXI.Text(`Your room code is ${roomName}`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'left'
  })
  LobbyContainer.addChild(text1)

  let text2 = new PIXI.Text('Waiting for an opponent to join...', {
    fontFamily: 'Arial',
    fontSize: 32,
    fill: 0xffffff,
    align: 'left'
  })
  text2.y = 50
  LobbyContainer.addChild(text2)
}

// renderLobby()

export function renderGame(roomObj, playerName) {
  // assign vars to players in roomObj
  const player1 = roomObj.currentPlayers.player1
  const player2 = roomObj.currentPlayers.player2

  // create the gameboard using the hardcoded testBoard
  gameboard = new Gameboard(testBoard, 15)
  // sets tile width and height
  SCALE = app.renderer.screen.height / gameboard.board.length

  // run renders for the board and unit, which will add them to BoardContainer
  renderBoard(gameboard)

  // sets playerName in gameState
  gameState.me = playerName
  // initialize Player instances for player1 & player 2 and save to gameState
  // this will also render the player's units to the GameBoard container
  gameState.currentPlayers.player1 = new Player(
    player1.id,
    player1.playerName,
    player1.faction
  )
  gameState.currentPlayers.player2 = new Player(
    player2.id,
    player2.playerName,
    player2.faction
  )
  // add tile and unit sprites to the GameContainer
  GameContainer.addChild(BoardContainer)

  renderSidebar(roomObj)
  GameContainer.addChild(SidebarContainer)
}

export function takeTurn() {
  // toggle currentTurn between player1 and player2
  gameState.currentTurn =
    gameState.currentTurn === 'player1' ? 'player2' : 'player1'
  console.log(`${gameState.currentTurn}'s turn`)

  const currentPlayer = gameState.currentPlayers[gameState.currentTurn]
  currentPlayer.calculatePoints()
  let totalHealth = currentPlayer.checkUnitsHealth()

  updatePointsDisplays()

  if (currentPlayer.victoryPoints >= gameState.pointsToWin) {
    socket.emit('victory', currentPlayer.faction)
    return
  } else if (totalHealth <= 0) {
    //if player2 does not have health for any of its units, player1 wins
    //winner is not the current player]
    let winner =
      gameState.currentPlayers[
        currentPlayer.playerName !== 'player1' ? 'player1' : 'player2'
      ]
    socket.emit('victory', winner.faction)
  }

  const unitsRemaining = gameState.currentPlayers[
    gameState.currentTurn
  ].units.filter(unit => unit.health > 0)
  if (unitsRemaining.length < 3) {
    console.log(
      `-->you have ${unitsRemaining.length} actions to start your turn`
    )
    gameState.actionsRemaining = unitsRemaining.length
    updateActionsLeftDisplay()
  } else {
    console.log('you have 3 actions to start your turn')
    gameState.actionsRemaining = 3
    updateActionsLeftDisplay()
  }

  // sets default unit interaction for beginning of a turn
  unitSprites.forEach(unitSprite => {
    // if it is your turn, you can click on your units to begin a turn
    if (
      gameState.currentTurn === gameState.me &&
      gameState.currentTurn === unitSprite.data.player.playerName
    ) {
      unitSprite.interactive = true
      unitSprite.buttonMode = true
      //reset action points for current player's turn
      unitSprite.data.activate()
    } else {
      // if not your turn, you cannot click on anything
      unitSprite.interactive = false
      unitSprite.buttonMode = false
    }

    updateCurrentTurnDisplay(
      sidebarDisplays.currentTurnPlayerDisplay,
      sidebarDisplays.currentTurnDisplay
    )
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

  // create text objs and add them to GameOverContainer
  const text1 = new PIXI.Text('The ', {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center'
  })
  GameOverContainer.addChild(text1)

  let winnerIconTexture

  if (winner === 'Federation') {
    winnerIconTexture = PIXI.Texture.from('/images/faction_usa.png')
  } else if (winner === 'Empire') {
    winnerIconTexture = PIXI.Texture.from('/images/faction_ger.png')
  }

  const winnerIconSprite = new PIXI.Sprite(winnerIconTexture)
  winnerIconSprite.width = 50
  winnerIconSprite.height = 50
  winnerIconSprite.x = text1.width
  GameOverContainer.addChild(winnerIconSprite)

  const text2 = new PIXI.Text(`${winner} `, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center'
  })
  text2.x = text1.width + winnerIconSprite.width
  switch (winner) {
    case 'Federation':
      text2.tint = 0x0f7001
      break
    case 'Empire':
      text2.tint = 0x0000fe
      break
    default:
      text2.tint = 0xffffff
  }
  GameOverContainer.addChild(text2)

  const text3 = new PIXI.Text('is Victorious!', {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center'
  })
  text3.x = text1.width + winnerIconSprite.width + text2.width
  GameOverContainer.addChild(text3)

  const text4 = new PIXI.Text('Refresh the page to play again!', {
    fontFamily: 'Arial',
    fontSize: 32,
    fill: 0xffffff,
    align: 'center'
  })
  text4.y = 50
  GameOverContainer.addChild(text4)

  // let text = new PIXI.Text(
  //   `The ${winner} is Victorious! \n Refresh page to play again!`,
  //   {
  //     fontFamily: 'Arial',
  //     fontSize: 24,
  //     fill: 0xffffff,
  //     align: 'center'
  //   }
  // )
  // GameOverContainer.addChild(text)
  // !add join button to gameover splash to allow user to enter another room
  // !find and fix issue with implementation - not working as is
  // //! add button texture and create sprite from it
  // const joinButton = PIXI.Texture.from('/images/join_button_placeholder.png')
  // const buttonTextures = [joinButton]
  // let joinButtonSprite = new PIXI.Sprite(buttonTextures[0])
  // joinButtonSprite.y = 200
  // GameOverContainer.addChild(joinButtonSprite)
}
