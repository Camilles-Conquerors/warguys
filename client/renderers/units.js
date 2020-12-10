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
import Unit from '../classes/units/unit'

//Making texture from image files
const rifleUnitRed = PIXI.Texture.from('/images/unit_rifleman_ussr.png')
const rifleUnitBlue = PIXI.Texture.from('/images/unit_rifleman_ger.png')
const unitTextures = [rifleUnitRed, rifleUnitBlue]
const health5 = PIXI.Texture.from('/images/health5.png')
const healthTextures = [0, 1, 2, 3, 4, health5]

//stores rendered unitContainers added to gameboard
export let unitContainers = []

//work around for removing sprite
export function removeContainer(container) {
  unitContainers = unitContainers.filter(unitContainer => {
    return unitContainer !== container
  })
}

//enables interactive and buttonMode on all unitContainers including enemies
function makeClickable() {
  unitContainers.forEach(unitContainer => {
    BoardContainer.removeChild(unitContainer)
    unitContainer.interactive = true
    unitContainer.buttonMode = true
    BoardContainer.addChild(unitContainer)
  })
}

//player can click their own units
//player cannot click their enemy's units
//enemy cannot click any units
function disableEnemyInteraction() {
  unitContainers.forEach(unitContainer => {
    BoardContainer.removeChild(unitContainer)
    if (
      gameState.currentTurn === gameState.me &&
      gameState.currentTurn === unitContainer.children[0].data.player.playerName
    ) {
      unitContainer.interactive = true
      unitContainer.buttonMode = true
    } else {
      unitContainer.interactive = false
      unitContainer.buttonMode = false
    }

    BoardContainer.addChild(unitContainer)
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
    unitContainers
    selectedUnit
* * * * * * * * * * * * * * * * * * * * * * * * *
*/
export function renderUnits(unitArr) {
  console.log('renderer ua', unitArr)
  unitArr.forEach(unit => {
    let offset = getOffset(unit.currentTile.coordinates.y)

    let unitSprite = {}

    if (unit.player.playerName === 'player1') {
      unitSprite = new PIXI.Sprite(unitTextures[0])
    } else {
      unitSprite = new PIXI.Sprite(unitTextures[1])
    }

    unitSprite.data = unit

    // setting position
    // unitSprite.x = unit.currentTile.coordinates.x * SCALE + offset
    // unitSprite.y = unit.currentTile.coordinates.y * SCALE

    //unitSprite.height = SCALE / 1.5
    //unitSprite.width = SCALE / 1.5

    unitSprite.type = 'unit'

    let healthSprite = new PIXI.Sprite(healthTextures[5])
    healthSprite.x = unitSprite.width - 15
    // healthSprite.y = unit.currentTile.coordinates.y * SCALE
    //healthSprite.height = unitSprite.height * .9
    //healthSprite.width = unitSprite.width * .9

    //BoardContainer.addChild(unitSprite)
    //contains unitSprite and healthSprite
    const unitContainer = new PIXI.Container()
    unitContainer.addChild(unitSprite)
    unitContainer.addChild(healthSprite)
    unitContainer.x = unit.currentTile.coordinates.x * SCALE + offset
    unitContainer.y = unit.currentTile.coordinates.y * SCALE
    unitContainer.height = SCALE / 1.3
    unitContainer.width = SCALE

    unitContainers.push(unitContainer)
    console.log('unitcontainer', unitContainer)

    //setting events
    unitContainer.interactive = true
    unitContainer.buttonMode = true //! set this true/false depending on the turn
    unitContainer.on('click', () => {
      //if no unit selected, select this unit
      console.log('selectedUnit at units.js 121', selectedUnit)
      if (!selectedUnit.children) {
        updateSelectedUnit(unitContainer)
        //make enemy units clickable
        makeClickable()
      } else {
        //if you click on unit that's already selected, unselect it
        // eslint-disable-next-line no-lonely-if
        if (unitContainer === selectedUnit) {
          updateSelectedUnit({})
          //disable enemy interaction
          disableEnemyInteraction()
        } else if (
          unitContainer.children[0].data.player.playerName ===
          selectedUnit.children[0].data.player.playerName
        ) {
          //if you click on a team unit, change select to that unit
          updateSelectedUnit(unitContainer)
        } else {
          //if you click enemy unit, attempt attack
          //! //? pass whole unit so we can update health
          handleAttack(
            selectedUnit.children[0].data,
            unitContainer.children[0].data
          )
          updateSelectedUnit({})
          disableEnemyInteraction()
        }
      }
    })
  })
}
