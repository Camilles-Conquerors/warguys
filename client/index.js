import * as PIXI from 'pixi.js'
import Gameboard from './classes/gameboard'
import {testBoard} from './hardcoded-maps'
import {renderBoard, BoardContainer} from './renderers/board'
import {renderUnits} from './renderers/units'
import Riflemen from './classes/units/riflemen'
import socket from './socket'

// create a view that just has a button to join room
// click to join the room if not full
// if full give a message saying room is full
// a second view for player1 that indicates that they're waiting for another player to join
// figure out how to add a player
// third view renders the game board once both players joined
// figure out logic for when to render each view, once room is full start the game
// figure out what data we're passing between server and the gameboard

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

// splash screen
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

// var scene1 = new PIXI.DisplayObjectContainer(),
// scene2 = new PIXI.DisplayObjectContainer(),
// scene3 = new PIXI.DisplayObjectContainer();
// //add some stuff to scene 1
// scene1.addChild(new PIXI.Sprite(myTexture));
// //add some stuff to scene 2
// scene2.addChild(new PIXI.Sprite(anotherTexture));
// //add some stuff to scene 3
// scene3.addChild(new PIXI.Sprite(moarTexture));
// //add all the scenes to the stagestage.addChild(scene1);stage.addChild(scene2);stage.addChild(scene3);
// //show only scene1
// scene2.visible = false;
// scene3.visible = false;

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

// create the gameboard using the hardcoded testBoard
export const gameboard = new Gameboard(testBoard)
//console.log('gameboard.map', gameboard.map)

// create initial unit placement with hardcoded riflemen
const unit1 = new Riflemen('bobby', gameboard.board[0][2])
const unit2 = new Riflemen('henry', gameboard.board[0][5])
let defaultUnits = [unit1, unit2]

// initialize global variables
export const SCALE = app.renderer.screen.height / gameboard.board.length
export let selectedUnit = {}

export function updateSelectedUnit(newObject) {
  selectedUnit = newObject
}

export function getOffset(y) {
  return y % 2 === 0 ? SCALE / 2 : 0
}

//run initial renders
renderBoard()
renderUnits(defaultUnits)
// GameContainer.addChild(BoardContainer)
