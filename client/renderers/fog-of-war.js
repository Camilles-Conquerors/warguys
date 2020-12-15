import {gameState, SCALE, getOffset} from '..'
import {restoreColorblindTiles, restoreNonColorblindTiles} from './action-tiles'
import {unitSprites} from './units'

const {tileSprites, BoardContainer} = require('./board')

let fogTiles = []
let visibleEnemySprites = []

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
    if (gameState.colorblindMode) {
      restoreColorblindTiles(sprite)
    } else {
      restoreNonColorblindTiles(sprite)
    }
    if (!sprite.data.isEmpty()) {
      console.log(
        'other unit in view (team dont matter)',
        sprite.data.occupiedBy
      )
    }
    if (
      !sprite.data.isEmpty() &&
      sprite.data.occupiedBy.player.playerName !== gameState.me
    ) {
      console.log('enemy unit in view', sprite.data.occupiedBy)
      //renderUnit
      let enemyUnit = sprite.data.occupiedBy
      let [enemySprite] = unitSprites.filter(unitSprite => {
        return unitSprite.data === enemyUnit
      })
      //visibleEnemySprites.push(enemySprite);
      // setting position
      enemySprite.x =
        enemyUnit.currentTile.coordinates.x * SCALE +
        getOffset(enemyUnit.currentTile.coordinates.y)
      enemySprite.y = enemyUnit.currentTile.coordinates.y * SCALE
      BoardContainer.addChild(enemySprite)
      //! check to make sure in view units are enemies

      //BoardContainer.addChild()
    }
  })
}
export function unrenderFogTiles() {
  tileSprites.forEach(sprite => {
    //console.log('unrendering sprite', sprite)
    sprite.tint = 0x000000
  })
  // unitSprites.forEach(unitSprite => {
  //   if(gameState.me !== unitSprite.data.player.playerName){
  //     BoardContainer.removeChild(unitSprite)
  //   }
  // })
}
