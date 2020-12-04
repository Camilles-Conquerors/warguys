import * as PIXI from 'pixi.js'
import {SCALE, GameContainer, updateSelectedUnit, getOffset} from '../index'
import {BoardContainer} from './board'

//Making texture from image files
const rifleUnitRed = PIXI.Texture.from('/images/unit_rifleman_ussr.png')
const rifleUnitBlue = PIXI.Texture.from('/images/unit_rifleman_ger.png')
const unitTextures = [rifleUnitRed, rifleUnitBlue]

//stores rendered unitSprites added to gameboard
export let unitSprites = []

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
      // check if this unit is already selected and is on your team
      //! this is bugged as of now, clicking directly on another unit before making a move locks out previous unit
      if (
        !unitSprite.data
          .isSelected /*&& unitSprite.playerThisUnitBelongsTo === e.playerWhoclicked*/
      ) {
        console.log('new unit selected!')
        updateSelectedUnit(unitSprite)
        console.log('selectedUnit set to: ', unitSprite)
        unitSprite.data.toggleSelected()
        console.log('selectedUnit isSelected?:', unitSprite.data.isSelected)
      } else {
        updateSelectedUnit({})
      }
    })
  })
}
