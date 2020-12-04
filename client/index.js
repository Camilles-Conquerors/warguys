import * as PIXI from 'pixi.js'
import Gameboard from './classes/gameboard'
import {testBoard} from './hardcoded-maps'
import {renderBoard, BoardContainer} from './renderers/board'
import {renderUnits} from './renderers/units'
import Riflemen from './classes/units/riflemen'
import socket from './socket'
import Game from './classes/game'

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
// assign units to respective players
// e.g. unit has a property player: "player1" || "player2"
// if true, unit cannot be clicked and cannot perform actions
// keep an array/some data structure containing all unit objects for a player
// upon performing an action, set hasActed = true
// once all units in the array have hasActed: true, switch gameState.currentTurn to next player
// on turn start, all of that player's units become hasActed: false

// have a gameState object that keeps track of current player's turn
// let me = player1
// //need to pass
// export function takeTurn(player) {
//   let myTurn = (player === me)
//   if(myTurn) {
//     //enable clicking abilities
//     //start clock
//   } else {
//     //disable clicking abilities

//   }
// }

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

  // add button texture and create sprite from it
  const joinButton = PIXI.Texture.from('/images/join_button_placeholder.png')
  const buttonTextures = [joinButton]
  let joinButtonSprite = new PIXI.Sprite(buttonTextures[0])
  joinButtonSprite.y = 200
  SplashContainer.addChild(joinButtonSprite)

  // on click event for clicking join room
  joinButtonSprite.interactive = true
  joinButtonSprite.buttonMode = true
  joinButtonSprite.on('click', () => {
    const roomName = 'room1'
    console.log("you're about to join the room")
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
export let gameState = {
  currentTurn: 'player2',
  pointsToWin: 0,
  currentPlayers: {}
}

export function setPointsToWin(pointsToWin) {
  gameState.pointsToWin = pointsToWin
}

export function updateSelectedUnit(newObject) {
  selectedUnit = newObject
}

export function getOffset(y) {
  return y % 2 === 0 ? SCALE / 2 : 0
}

export function renderGame(name) {
  //set playerName locally
  const playerName = name
  // create the gameboard using the hardcoded testBoard
  const gameboard = new Gameboard(testBoard)
  //console.log('gameboard.map', gameboard.map)

  // create initial unit placement with hardcoded riflemen
  const unitRed1 = new Riflemen('player1', 'billy', gameboard.board[1][3])
  const unitRed2 = new Riflemen('player1', 'bobby', gameboard.board[3][2])
  const unitBlue1 = new Riflemen('player2', 'henry', gameboard.board[13][11])
  const unitBlue2 = new Riflemen('player2', 'hienrik', gameboard.board[11][12])
  let defaultUnits = [unitRed1, unitRed2, unitBlue1, unitBlue2]

  SCALE = app.renderer.screen.height / gameboard.board.length

  //run renders for the board and unit, which will add them to BoardContainer
  renderBoard(gameboard)
  renderUnits(defaultUnits)
  GameContainer.addChild(BoardContainer)

  return function(roomObj) {
    //Global gameState stored locally
    //socket object is owner of currentPlayers
    gameState.currentPlayers = roomObj.currentPlayers
    gameState.currentTurn =
      gameState.currentTurn === 'player1' ? 'player2' : 'player1'
    console.log(`it is ${gameState.currentTurn}'s turn`)
    if (gameState.currentTurn === playerName) {
      console.log('enabling interaction with troops')
    } else {
      console.log('disabling interaction with troops')
    }
  }
}
//restrict click for player whose turn is not

// export function takeTurn(roomObj, playerName) {
//   console.log(`it is ${roomObj.currentTurn}'s turn`)
//   if (roomObj.currentTurn === playerName) {
//     console.log('enabling interaction with troops')
//   } else {
//     console.log('disabling interaction with troops')
//   }
//   //const player1 = currentGame.addPlayer();
//   // console.log('player1', player1)
//   // player1.createRiflemen()
// }

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
