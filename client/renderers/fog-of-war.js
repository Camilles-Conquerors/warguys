const {tileSprites} = require('./board')

let fogTiles = []

export function getFogTiles(unit) {
  //sets fogTiles array equal to tilesInView
  //! we can make it possible to see 1 or two tiles past shot ability
  fogTiles = tileSprites.filter(sprite => {
    if (unit.tilesInView[sprite.data.id]) {
      return true
    }
    return false
  })
  //render them
  renderFogTiles()
}

function renderFogTiles() {
  if (!fogTiles.length) {
    console.warn('woops! no Action Tiles queued for rendering')
    return false
  }

  //render visible tiles
  fogTiles.forEach(sprite => {
    //console.log('fog sprite', sprite)
    switch (sprite.data.type) {
      case 'plain':
        sprite.tint = 0xc9cba3
        break
      case 'mountain':
        sprite.tint = 0x627264 /*0xa52a2a*/
        break
      case 'point':
        console.log('tinting ')
        sprite.tint = 0xffd700
        break
      default:
        console.log(
          'hey, homie, idk what tile this is. I cant color it properly'
        )
    }
  })
}
