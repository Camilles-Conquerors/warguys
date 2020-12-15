import * as PIXI from 'pixi.js'
import {
  SCALE,
  updateSelectedUnit,
  selectedUnit,
  getOffset,
  gameState
} from '../index'
import {BoardContainer} from './board'
import {handleAttack} from '../actions/attack'

//Making texture from image files
const rifleUnitGreen = PIXI.Texture.from('/images/unit_rifleman_usa.png')
const rifleUnitBlue = PIXI.Texture.from('/images/unit_rifleman_ger.png')
const unitTextures = [rifleUnitGreen, rifleUnitBlue]

const health5 = PIXI.Texture.from('/images/five.png')
const health4 = PIXI.Texture.from('/images/four.png')
const health3 = PIXI.Texture.from('/images/three.png')
const health2 = PIXI.Texture.from('/images/two.png')
const health1 = PIXI.Texture.from('/images/one.png')
const healthTextures = [null, health1, health2, health3, health4, health5]

const miss = PIXI.Texture.from('images/miss.png')
const hit = PIXI.Texture.from('images/hit.png')
const shootTextures = [miss, hit]

export function renderHealthSprite(unitSprite) {
  let healthSprite = new PIXI.Sprite(healthTextures[unitSprite.data.health])
  healthSprite.x = 95
  healthSprite.y = 10
  healthSprite.height = SCALE / 1.3
  healthSprite.width = SCALE / 1.3
  unitSprite.addChild(healthSprite)
}

export function renderHit(unitSprite) {
  //removes healthSprite
  unitSprite.removeChild(unitSprite.children[0])
  let hitSprite = new PIXI.Sprite(hit)
  hitSprite.x = 75
  hitSprite.y = -30
  unitSprite.addChild(hitSprite)
  // removes hit animation after 2 secs and renders healthSprite
  setTimeout(function() {
    unitSprite.removeChild(hitSprite)
    renderHealthSprite(unitSprite)
  }, 2000)
}

export function renderMiss(unitSprite) {
  //removes healthSprite
  unitSprite.removeChild(unitSprite.children[0])
  let missSprite = new PIXI.Sprite(miss)
  missSprite.x = 75
  missSprite.y = -30
  unitSprite.addChild(missSprite)
  // removes miss animation after 2 secs and renders healthSprite
  setTimeout(function() {
    console.log('remove miss')
    unitSprite.removeChild(missSprite)
    renderHealthSprite(unitSprite)
  }, 2000)
}

//stores rendered unitSprites added to gameboard
export let unitSprites = []

//work around for removing sprite
export function removeSprite(sprite) {
  unitSprites = unitSprites.filter(unitSprite => {
    return unitSprite !== sprite
  })
}

//enables interactive and buttonMode on all unitSprites including enemies
function makeClickable() {
  unitSprites.forEach(unitSprite => {
    unitSprite.interactive = true
    unitSprite.buttonMode = true
  })
}

//player can click their own units
//player cannot click their enemy's units
//enemy cannot click any units
export function disableEnemyInteraction() {
  unitSprites.forEach(unitSprite => {
    if (
      gameState.currentTurn === gameState.me &&
      gameState.currentTurn === unitSprite.data.player.playerName
    ) {
      unitSprite.interactive = true
      unitSprite.buttonMode = true
    } else {
      unitSprite.interactive = false
      unitSprite.buttonMode = false
    }
  })
}

/*
* * * * * * * * * * * * * * * * * * * * * * * * *
  renderUnits Dependencies:
    offset()
    unitTextures
    PIXI
    SCALE
    GameContainer
    unitSprites
    selectedUnit
* * * * * * * * * * * * * * * * * * * * * * * * *
*/
export function renderUnits(unitArr) {
  return unitArr.map(unit => {
    let offset = getOffset(unit.currentTile.coordinates.y)

    let unitSprite = {}

    if (unit.player.playerName === 'player1') {
      unitSprite = new PIXI.Sprite(unitTextures[0])
    } else {
      unitSprite = new PIXI.Sprite(unitTextures[1])
    }

    unitSprite.data = unit

    // setting position
    unitSprite.x = unit.currentTile.coordinates.x * SCALE + offset
    unitSprite.y = unit.currentTile.coordinates.y * SCALE

    unitSprite.height = SCALE / 1.5
    unitSprite.width = SCALE / 1.5

    unitSprite.type = 'unit'

    renderHealthSprite(unitSprite)

    //renderHit(unitSprite)
    unitSprites.push(unitSprite)

    //setting events
    unitSprite.interactive = true
    unitSprite.buttonMode = true //! set this true/false depending on the turn
    unitSprite.on('click', () => {
      //if no unit selected, select this unit
      if (!selectedUnit.data) {
        updateSelectedUnit(unitSprite)
        //make enemy units clickable
        makeClickable()
      } else {
        //if you click on unit that's already selected, unselect it
        // eslint-disable-next-line no-lonely-if
        if (unitSprite === selectedUnit) {
          updateSelectedUnit({})
          //disable enemy interaction
          disableEnemyInteraction()
        } else if (
          unitSprite.data.player.playerName ===
          selectedUnit.data.player.playerName
        ) {
          //if you click on a team unit, change select to that unit
          updateSelectedUnit(unitSprite)
        } else {
          //if you click enemy unit, attempt attack
          handleAttack(selectedUnit.data, unitSprite.data)
          updateSelectedUnit({}) // remove selected unit
          disableEnemyInteraction()
        }
      }
    })
    return unitSprite
  })
}
