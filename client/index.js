import * as PIXI from 'pixi.js'
import Gameboard from './classes/gameboard'
import {testBoard} from './hardcoded-maps'
import Riflemen from './classes/units/riflemen'

// create the test board
const gameboard = new Gameboard(testBoard)

//console.log('gameboard.map', gameboard.map)

//mounting PIXI to DOM
const canvas = document.getElementById('mycanvas')

const app = new PIXI.Application({
  view: canvas,
  width: window.outerWidth,
  height: window.outerHeight
})

//Making texture from image files
const plainTile = PIXI.Texture.from('/images/terrain_plains.png')
const mtTile = PIXI.Texture.from('/images/terrain_mountains.png')
const tileTextures = {
  plain: plainTile,
  mountain: mtTile
}
const rifleUnit = PIXI.Texture.from('/images/unit_rifleman.png')
const unitTextures = [rifleUnit]

//creating and appending container
let GameContainer = new PIXI.Container()
app.stage.addChild(GameContainer)

const unit1 = new Riflemen(gameboard.board[0][2])
const unit2 = new Riflemen(gameboard.board[0][5])

//keeping rendered sprites
let tileSprites = []
let unitSprites = [unit1, unit2]

const SCALE = app.renderer.screen.height / gameboard.board.length

let selectedUnit = {}

function renderBoard() {
  //going through each row of board
  for (let y = 0; y < gameboard.board.length; y++) {
    //offset for hex-style pattern
    let offset = 0
    if (y % 2 === 0) offset = SCALE / 2

    //going through each column of current row
    for (let x = 0; x < gameboard.board[y].length; x++) {
      //make a new sprite

      //console.log(gameboard.board[y][x].value.name)

      let tileSprite = new PIXI.Sprite(
        tileTextures[gameboard.board[y][x].tile.name]
      )

      //pass reference to tile into sprite
      // TYPES
      // 0 = clear
      // 1 = impassible
      //? Key-value data structure to id tile types
      tileSprite.data = gameboard.board[y][x]

      //scale & position
      tileSprite.width = SCALE
      tileSprite.height = SCALE
      tileSprite.x = x * SCALE + offset
      tileSprite.y = y * SCALE

      //rendering based on tile type
      if (gameboard.board[y][x].tile.name === 'plain')
        tileSprite.tint = 0x008000
      else if (gameboard.board[y][x].tile.name === 'mountain')
        tileSprite.tint = 0xa52a2a

      //setting event handlers
      tileSprite.interactive = true

      //onClick, call selectedUnit's move fn to clicked tile coord
      tileSprite.on('click', e => {
        if (selectedUnit.data) {
          console.log('tile clicked, tile data: ', tileSprite.data)
          handleMove(selectedUnit, tileSprite.data)
          //selectedUnit.move(tileSprite.data.coordinates)

          selectedUnit = {}
        }
      })

      //DELETE ME LATER
      // tileSprite.on('click', e => {
      //   if (selectedUnit.coordinates) {
      //     // console.log('tile clicked, coordinates: ', tileSprite.data.coordinates)
      //     selectedUnit.move(tileSprite.data.coordinates)
      //     selectedUnit = {}
      //   }
      // })

      //recording sprite's type to tile
      tileSprite.type = 'tile'

      //mounting sprite to pixi & saving
      GameContainer.addChild(tileSprite)
      tileSprites.push(tileSprite)
    }
  }
}

// export function renderUnit(unit) {
//   // console.log(unit)
//   unitSprites.forEach(sprite => GameContainer.removeChild(sprite))

//   let offset = 0

//   if (unit.coordinates.y % 2 == 0) {
//     offset = SCALE / 2
//   }

//   let unitSprite = new PIXI.Sprite(unitTextures[0])

//   unitSprite.data = unit

//   //setting events
//   unitSprite.interactive = true
//   unitSprite.buttonMode = true
//   unitSprite.on('click', e => {
//     console.log('Sprite: ', unitSprite)
//     console.log('unit clicked!\n Event: ', e)
//     selectedUnit = unitSprite.data
//   })

//   // setting position
//   unitSprite.x = unit.coordinates.x * SCALE + offset
//   unitSprite.y = unit.coordinates.y * SCALE

//   unitSprite.height = SCALE / 1.5
//   unitSprite.width = SCALE / 1.5

//   unitSprite.type = 'unit'

//   GameContainer.addChild(unitSprite)
//   unitSprites.push(unitSprite)

//   // console.log(container)
// }

//unitArr is an array of unit objects
export function renderUnits(unitArr) {
  //
  unitArr.forEach(unit => {
    let offset = 0

    if (unit.currentTile.coordinates.y % 2 == 0) {
      offset = SCALE / 2
    }

    let unitSprite = new PIXI.Sprite(unitTextures[0])

    unitSprite.data = unit

    // setting position
    unitSprite.x = unit.currentTile.coordinates.x * SCALE + offset
    unitSprite.y = unit.currentTile.coordinates.y * SCALE

    unitSprite.height = SCALE / 1.5
    unitSprite.width = SCALE / 1.5

    unitSprite.type = 'unit'

    GameContainer.addChild(unitSprite)
    unitSprites.push(unitSprite)

    //setting events
    unitSprite.interactive = true
    unitSprite.buttonMode = true
    unitSprite.on('click', e => {
      //console.log('Sprite: ', unitSprite)
      console.log('unit clicked!\n Event: ', e.target)
      selectedUnit = unitSprite
      unitSprite.data.toggleSelected()
    })
  })

  // console.log(container)
}

/*
*  - unitSprite is the sprite object created in renderUnits
*  - unitSprite.data is the instance of the Unit class associated with the
*     sprite object -- use unitSprite.data to access class methods
*  - newCoordinates is an object containing the coordinates of the tile the
      unit is trying to move to
* - unitSprite.x & .y are updated using the unitSprite.data to ensure only valid
*/
function handleMove(unitSprite, newTile) {
  // update coords on unitSprite
  unitSprite.data.move(newTile)
  //update sprite's x amd y position
  let offset =
    unitSprite.data.currentTile.coordinates.y % 2 === 0 ? SCALE / 2 : 0
  unitSprite.x = unitSprite.data.currentTile.coordinates.x * SCALE + offset
  unitSprite.y = unitSprite.data.currentTile.coordinates.y * SCALE
  console.log('updating unit view', unitSprite)
}

renderBoard()

//renderUnit(unit)
renderUnits(unitSprites)

//move unit
