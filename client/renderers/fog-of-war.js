import {gameState, SCALE, getOffset} from '..'
import {restoreColorblindTiles, restoreNonColorblindTiles} from './action-tiles'
import {unitSprites} from './units'
import {tileSprites, BoardContainer} from './board'

// array of visible tiles around each unit
let fogTiles = []

// array of enemies in view
// remove any enemy units with health of 0
let visibleEnemySprites = []

export function getFogTiles(unit) {
  //sets fogTiles array equal to tilesInView
  fogTiles = tileSprites.filter(sprite => {
    if (unit.tilesInView[sprite.data.id]) {
      return true
    }
    return false
  })
  //render them
  renderFogTiles()
}
//render visible tiles around each unit
function renderFogTiles() {
  if (!fogTiles.length) {
    console.warn('woops! no Action Tiles queued for rendering')
    return false
  }

  fogTiles.forEach(sprite => {
    //render tint based on color blind mode
    if (gameState.colorblindMode) {
      restoreColorblindTiles(sprite)
    } else {
      restoreNonColorblindTiles(sprite)
    }

    //checks if tile in view is occupied with an enemy unit
    if (
      !sprite.data.isEmpty() &&
      sprite.data.occupiedBy.player.playerName !== gameState.me
    ) {
      //get enemy sprite based off enemy unit name where unit health > 0
      let enemyUnit = sprite.data.occupiedBy
      let enemySprite = unitSprites.filter(unitSprite => {
        if (unitSprite.data.health > 0) {
          return unitSprite.data === enemyUnit
        }
      })
      //add enemy sprite to view
      if (enemySprite.length > 0) {
        const offset = getOffset(enemyUnit.currentTile.coordinates.y)
        sprite = enemySprite[0]

        // assign x and y coordinates of enemySprite
        sprite.x = enemyUnit.currentTile.coordinates.x * SCALE + offset
        sprite.y = enemyUnit.currentTile.coordinates.y * SCALE

        //push enemy Sprite to BoardContainer and visible enemy array
        visibleEnemySprites.push(sprite)
        BoardContainer.addChild(sprite)
      }
    }
  })
}

// sets all tiles to black tint
// removes enemies from view
// removes enemies from visible enemies array
// run this function immediately before renderFogTiles
export function initializeFogTiles() {
  tileSprites.forEach(sprite => {
    sprite.tint = 0x000000
    if (sprite.type === 'point') sprite.tint = 0xffd700
  })
  visibleEnemySprites.forEach(enemySprite => {
    BoardContainer.removeChild(enemySprite)
  })

  visibleEnemySprites = []
}
