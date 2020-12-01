export function renderUnit(unit) {
  // console.log(unit)
  unitSprites.forEach(sprite => GameContainer.removeChild(sprite))

  let offset = 0

  if (unit.coordinates.y % 2 == 0) {
    offset = SCALE / 2
  }

  let unitSprite = new PIXI.Sprite(unitTextures[0])

  unitSprite.data = unit

  //setting events
  unitSprite.interactive = true
  unitSprite.buttonMode = true
  unitSprite.on('click', e => {
    //console.log('Sprite: ', unitSprite)
    //console.log('unit clicked!\n Event: ', e)
    selectedUnit = unitSprite.data
  })

  // setting position
  unitSprite.x = unit.coordinates.x * SCALE + offset
  unitSprite.y = unit.coordinates.y * SCALE

  unitSprite.height = SCALE / 1.5
  unitSprite.width = SCALE / 1.5

  unitSprite.type = 'unit'

  GameContainer.addChild(unitSprite)
  unitSprites.push(unitSprite)

  // console.log(container)
}
