import * as PIXI from 'pixi.js'
import Gameboard from './classes/gameboard'
import {testBoard} from './hardcoded-maps'
import {renderBoard} from './renderers/board'
import {renderUnits} from './renderers/units'
import Riflemen from './classes/units/riflemen'

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
