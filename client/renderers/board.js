import * as PIXI from 'pixi.js'
import {
  gameboard,
  SCALE,
  GameContainer,
  selectedUnit,
  updateSelectedUnit,
  getOffset
} from '../index'
import {handleMove} from '../actions/move'

//Making texture from image files
const plainTile = PIXI.Texture.from('/images/terrain_plains.png')
const mtTile = PIXI.Texture.from('/images/terrain_mountains.png')
const tileTextures = {
  plain: plainTile,
  mountain: mtTile
}

//stores rendered sprites added to gameboard
let tileSprites = []

// create container for the board
export const BoardContainer = new PIXI.Container()

/*
* * * * * * * * * * * * * * * * * * * * * * * * *
 renderBoard external Dependencies:
  gameboard
  SCALE
  offset()
  PIXI
  tileTextures
  selectedUnit
  handleMove
  GameContainer
  TileSprites
* * * * * * * * * * * * * * * * * * * * * * * * *
*/

export function renderBoard() {
  //going through each row of board
  for (let y = 0; y < gameboard.board.length; y++) {
    //offset for hex-style pattern
    let offset = getOffset(y)

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
      tileSprite.on('click', () => {
        console.log('tile clicked, tile data: ', tileSprite.data)
        if (selectedUnit.data.currentTile.coordinates) {
          handleMove(selectedUnit, tileSprite.data)
          //sets selectedUnit to an empty array
          updateSelectedUnit({})
        }
      })

      //recording sprite's type to tile
      tileSprite.type = 'tile'

      //mounting sprite to pixi & saving
      BoardContainer.addChild(tileSprite)
      tileSprites.push(tileSprite)
    }
  }
}
