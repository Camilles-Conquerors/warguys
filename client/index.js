import * as PIXI from 'pixi.js'
import Unit from './classes/unit'
import gameboard from './classes/gameboard'

//mounting PIXI to DOM
const canvas = document.getElementById('mycanvas')

const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight
})

//Making texture from image files
const tileTexture = PIXI.Texture.from('/images/terrain_plains.png')
const unitTexture = PIXI.Texture.from('/images/unit_rifleman.png')

//creating and appending container
let GameContainer = new PIXI.Container()
app.stage.addChild(GameContainer)

//keeping rendered sprites
let tileSprites = []
let unitSprites = []

const SCALE = app.renderer.screen.height / gameboard.length

let selectedUnit = {}

const unit = new Unit({x: 1, y: 1})

function renderBoard() {
  //going through each row of board
  for (let y = 0; y < gameboard.length; y++) {
    //offset for hex-style pattern
    let offset = 0
    if (y % 2 === 0) offset = SCALE / 2

    //going through each column of current row
    for (let x = 0; x < gameboard[y].length; x++) {
      //make a new sprite
      let tileSprite = new PIXI.Sprite(tileTexture)

      //pass reference to tile into sprite
      // TYPES
      // 0 = clear
      // 1 = impassible
      //? Key-value data structure to id tile types
      tileSprite.data = {
        type: gameboard[y][x],
        coordinates: {x, y}
      }

      //scale & position
      tileSprite.width = SCALE
      tileSprite.height = SCALE
      tileSprite.x = x * SCALE + offset
      tileSprite.y = y * SCALE

      //rendering based on tile type
      if (gameboard[y][x] === 0) tileSprite.tint = 0x008000
      else if (gameboard[y][x] === 1) tileSprite.tint = 0xa52a2a

      //setting event handlers
      tileSprite.interactive = true

      //onClick, call selectedUnit's move fn to clicked tile coord
      tileSprite.on('click', e => {
        if (selectedUnit.coordinates) {
          // console.log('tile clicked, coordinates: ', tileSprite.data.coordinates)
          selectedUnit.move(tileSprite.data.coordinates)
          selectedUnit = {}
        }
      })

      //recording sprite's type to tile
      tileSprite.type = 'tile'

      //mounting sprite to pixi & saving
      GameContainer.addChild(tileSprite)
      tileSprites.push(tileSprite)
    }
  }
}

export function renderUnit(unit) {
  // console.log(unit)
  unitSprites.forEach(sprite => GameContainer.removeChild(sprite))

  let offset = 0

  if (unit.coordinates.y % 2 == 0) {
    offset = SCALE / 2
  }

  let unitSprite = new PIXI.Sprite(unitTexture)

  unitSprite.data = unit

  //setting events
  unitSprite.interactive = true
  unitSprite.buttonMode = true
  unitSprite.on('click', e => {
    console.log('Sprite: ', unitSprite)
    console.log('unit clicked!\n Event: ', e)
    selectedUnit = unitSprite.data
  })

  // setting position
  unitSprite.x = unit.coordinates.x * SCALE + offset
  unitSprite.y = unit.coordinates.y * SCALE

  unitSprite.height = SCALE
  unitSprite.width = SCALE / 2

  unitSprite.type = 'unit'

  GameContainer.addChild(unitSprite)
  unitSprites.push(unitSprite)

  // console.log(container)
}

renderBoard()
renderUnit(unit)
