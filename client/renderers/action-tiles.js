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
    sprite.tint = 0x506164
  })

  //render moves
  actionTiles[0].forEach(sprite => {
    sprite.tint = 0x79958d
  })
}
export function restoreTiles() {
  //remove tint from tiles
  //move tiles

  actionTiles.forEach(tileSet => {
    // eslint-disable-next-line guard-for-in
    for (let index in tileSet) {
      let newTint = 0xffffff
      if (tileSet[index].data.type === 'plain') newTint = 0xa2c5ac
      else if (tileSet[index].data.type === 'mountain') newTint = 0xb5651d
      else if (tileSet[index].data.type === 'point') newTint = 0xffd700

      tileSet[index].tint = newTint
    }
  })
  //attack tiles

  //clear actionTiles
  for (let i = 0; i < actionTiles.length; i++) {
    actionTiles.pop()
  }
}
