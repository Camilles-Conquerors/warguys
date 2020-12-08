const {tileSprites} = require('./board')

const actionTiles = []

export function getActionTiles(unit) {
  //clear tiles before rendering
  restoreTiles()

  //get move
  actionTiles.push(
    tileSprites.filter(sprite => {
      if (unit.possibleMoves[sprite.data.id]) {
        return true
      }
      return false
    })
  )

  //get attack
  actionTiles.push(
    tileSprites.filter(sprite => {
      if (unit.tilesInView[sprite.data.id]) {
        return true
      }
      return false
    })
  )

  //render them
  renderActionTiles()
}

function renderActionTiles() {
  if (!actionTiles.length) {
    console.warn('woops! no Action Tiles queued for rendering')
    return false
  }

  //render attacks
  actionTiles[1].forEach(sprite => {
    sprite.tint = 0xff0000
  })

  //render moves
  actionTiles[0].forEach(sprite => {
    sprite.tint = 0x0000ff
  })
}
export function restoreTiles() {
  //remove tint from tiles
  //move tiles

  for (let index in actionTiles[0]) {
    if (actionTiles[0][index].data.tile.name === 'plain')
      actionTiles[0][index].tint = 0x388004
    else if (actionTiles[0][index].data.tile.name === 'mountain')
      actionTiles[0][index].tint = 0xb5651d
  }

  //attack tiles
  for (let index in actionTiles[1]) {
    if (actionTiles[1][index].data.tile.name === 'plain')
      actionTiles[1][index].tint = 0x388004
    else if (actionTiles[1][index].data.tile.name === 'mountain')
      actionTiles[1][index].tint = 0xb5651d
  }

  //clear actionTiles
  for (let i = 0; i < actionTiles.length; i++) {
    actionTiles.pop()
  }
}
