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

  console.log(actionTiles)
  //get attack
  actionTiles.push(
    tileSprites.filter(sprite => {
      if (unit.tilesInView[sprite.data.id]) {
        return true
      }
      return false
    })
  )

  console.log(actionTiles)

  //render them
  renderActionTiles()
}

function renderActionTiles() {
  if (!actionTiles.length) {
    console.log('woops! no Action Tiles queued for rendering')
    return false
  }

  //render moves
  actionTiles[0].forEach(sprite => {
    sprite.tint = 0xff0000
  })

  //render attacks
  actionTiles[1].forEach(sprite => {
    sprite.tint = 0xff0000
  })
}
export function restoreTiles() {
  //remove tint from tiles
  //move tiles
  for (let tileSprite in actionTiles[0]) {
    if (tileSprite.data.name === 'plain') tileSprite.tint = 0x388004
    else if (tileSprite.data.name === 'mountain') tileSprite.tint = 0xb5651d
  }

  //attack tiles
  for (let tileSprite in actionTiles[1]) {
    if (tileSprite.data.name === 'plain') tileSprite.tint = 0x388004
    else if (tileSprite.data.name === 'mountain') tileSprite.tint = 0xb5651d
  }

  //clear actionTiles
  for (let i = 0; i < actionTiles.length; i++) {
    actionTiles.pop()
  }
}
