import * as PIXI from 'pixi.js'
import {SCALE, GameContainer, updateSelectedUnit, getOffset} from '../index'

//Making texture from image files
const rifleUnit = PIXI.Texture.from('/images/unit_rifleman.png')
const unitTextures = [rifleUnit]

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

    let unitSprite = new PIXI.Sprite(unitTextures[0])

    unitSprite.data = unit

    // setting position
    unitSprite.x = unit.currentTile.coordinates.x * SCALE + offset
    unitSprite.y = unit.currentTile.coordinates.y * SCALE

    unitSprite.height = SCALE / 1.5
    unitSprite.width = SCALE / 1.5

    unitSprite.type = 'unit'

    GameContainer.addChild(unitSprite)
    unitSprites.push(unitSprite)

    //setting events
    unitSprite.interactive = true
    unitSprite.buttonMode = true
    unitSprite.on('click', () => {
      console.log('unit clicked!')
      updateSelectedUnit(unitSprite)
      console.log('selectedUnit set to: ', unitSprite)
      unitSprite.data.toggleSelected()
      console.log('selectedUnit isSelected?:', unitSprite.data.isSelected)
    })
  })
}
