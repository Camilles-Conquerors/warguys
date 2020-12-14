import {gameState} from '..'

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
  if (gameState.colorblindMode) {
    // ATTACK colorblind mode ON
    actionTiles[1].forEach(sprite => {
      sprite.tint = 0x506164
    })
  } else {
    // ATTACK colorblind mode OFF
    actionTiles[1].forEach(sprite => {
      sprite.tint = 0xb40000
    })
  }

  //render moves
  if (gameState.colorblindMode) {
    // MOVE colorblind mode ON
    actionTiles[0].forEach(sprite => {
      sprite.tint = 0x79958d
    })
  } else {
    // MOVE colorblind mode OFF
    actionTiles[0].forEach(sprite => {
      sprite.tint = 0x0048b4
    })
  }
}
export function restoreTiles() {
  //remove tint from tiles
  //move tiles

  actionTiles.forEach(tileSet => {
    // check whether colorblind mode is on
    if (gameState.colorblindMode) {
      // eslint-disable-next-line guard-for-in
      for (let index in tileSet) {
        restoreColorblindTiles(tileSet[index])
      }
    } else {
      // eslint-disable-next-line guard-for-in
      for (let index in tileSet) {
        restoreNonColorblindTiles(tileSet[index])
      }
    }
  })
  //attack tiles

  //clear actionTiles
  for (let i = 0; i < actionTiles.length; i++) {
    actionTiles.pop()
  }
}

export function restoreColorblindTiles(tile) {
  let newTint = 0xffffff
  // use these colors for colorblind mode ON
  if (tile.data.type === 'plain') newTint = 0xc9cba3
  else if (tile.data.type === 'mountain') newTint = 0x627264
  else if (tile.data.type === 'point') newTint = 0xffd700
  tile.tint = newTint
}

export function restoreNonColorblindTiles(tile) {
  let newTint = 0xffffff
  // use these colors for colorblind mode OFF
  if (tile.data.type === 'plain') newTint = 0x80af49
  else if (tile.data.type === 'mountain') newTint = 0x733818
  else if (tile.data.type === 'point') newTint = 0xffd700
  tile.tint = newTint
}
