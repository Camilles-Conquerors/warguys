import * as PIXI from 'pixi.js'
import {
  SCALE,
  GameContainer,
  updateSelectedUnit,
  getOffset,
  gameState
} from '../index'
import {BoardContainer} from './board'
import {selectedUnit} from '../index'
import {handleAttack} from '../actions/move'

//Making texture from image files
const rifleUnitRed = PIXI.Texture.from('/images/unit_rifleman_ussr.png')
const rifleUnitBlue = PIXI.Texture.from('/images/unit_rifleman_ger.png')
const unitTextures = [rifleUnitRed, rifleUnitBlue]

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
    BoardContainer.removeChild(unitSprite)
    unitSprite.interactive = true
    unitSprite.buttonMode = true
    BoardContainer.addChild(unitSprite)
  })
}

//player can click their own units
//player cannot click their enemy's units
//enemy cannot click any units
function disableEnemyInteraction() {
  unitSprites.forEach(unitSprite => {
    BoardContainer.removeChild(unitSprite)
    if (
      gameState.currentTurn === gameState.me &&
      gameState.currentTurn === unitSprite.data.playerName
    ) {
      unitSprite.interactive = true
      unitSprite.buttonMode = true
    } else {
      unitSprite.interactive = false
      unitSprite.buttonMode = false
    }

    BoardContainer.addChild(unitSprite)
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
  console.log('renderer ua', unitArr)
  unitArr.forEach(unit => {
    let offset = getOffset(unit.currentTile.coordinates.y)

    let unitSprite = {}

    if (unit.playerName === 'player1') {
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

    BoardContainer.addChild(unitSprite)
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
          unitSprite.data.playerName === selectedUnit.data.playerName
        ) {
          //if you click on a team unit, change select to that unit
          updateSelectedUnit(unitSprite)
        } else {
          //if you click enemy unit, attempt attack
          handleAttack(selectedUnit.data, unitSprite.data)
          updateSelectedUnit({})
          disableEnemyInteraction()
        }
      }
      // console.log('selectedUnit isSelected?:', unitSprite.data.isSelected)
      //
    })
  })
}
