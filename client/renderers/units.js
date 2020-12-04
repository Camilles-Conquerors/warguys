import * as PIXI from 'pixi.js'
import {SCALE, GameContainer, updateSelectedUnit, getOffset} from '../index'
import {BoardContainer} from './board'
import {selectedUnit} from '../index'
import {handleAttack, updateUnitsHealth} from '../actions/move'

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
      //if no unit selected, select this unit
      if (!selectedUnit.data) {
        console.log('new unit selected!', unitSprite.data)
        updateSelectedUnit(unitSprite)
        selectedUnit.data.toggleSelected(true)
      } else {
        //if you click on unit that's already selected, unselect it
        if (unitSprite === selectedUnit) {
          console.log('unselected unit: ', unitSprite.data)
          selectedUnit.data.toggleSelected(false)
          updateSelectedUnit({})
        } else if (
          unitSprite.data.playerName === selectedUnit.data.playerName
        ) {
          //if you click on a team unit, change select to that unit
          console.log('changed selected unit!: ', unitSprite.data)
          selectedUnit.data.toggleSelected(false)
          updateSelectedUnit(unitSprite)
          selectedUnit.data.toggleSelected(true)
        } else {
          //if you click enemy unit, attempt attack
          handleAttack(selectedUnit.data, unitSprite.data)
          updateSelectedUnit({})
        }
      }
      // console.log('selectedUnit isSelected?:', unitSprite.data.isSelected)
      //
    })
  })
}
