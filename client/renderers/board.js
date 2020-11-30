export function renderBoard(gameboard) {
  //going through each row of board
  for (let y = 0; y < gameboard.length; y++) {
    //offset for hex-style pattern
    let offset = 0
    if (y % 2 === 0) offset = SCALE / 2

    //going through each column of current row
    for (let x = 0; x < gameboard[y].length; x++) {
      //make a new sprite
      let tileSprite = new PIXI.Sprite(tileTextures[gameboard[y][x]])

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
