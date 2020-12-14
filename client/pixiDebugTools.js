import * as PIXI from 'pixi.js'

//methods in here help with debugging and seeing pixi elements in the view

const visualizing = []

//sets up PIXI element to be "visualize" in the scene
export function visualize(container) {
  const trackerObj = {container}
  const vertexTexture = new PIXI.Texture.from('images/faction_usa.png')
  const pivotTexture = new PIXI.Texture.from('images/faction_ger.png')

  const pivotSprite = new PIXI.Sprite(pivotTexture)
  const vertexSprites = [
    new PIXI.Sprite(vertexTexture),
    new PIXI.Sprite(vertexTexture),
    new PIXI.Sprite(vertexTexture),
    new PIXI.Sprite(vertexTexture)
  ]

  trackerObj.pivot = pivotSprite
  trackerObj.vertecies = vertexSprites

  //pivot
  container.addChild(pivotSprite)

  pivotSprite.x = container.pivot.x
  pivotSprite.y = container.pivot.y

  //corners
  container.addChild(...vertexSprites)

  vertexSprites[0].x = 0
  vertexSprites[0].y = 0

  vertexSprites[1].x = container.width
  vertexSprites[1].y = 0

  vertexSprites[2].x = container.width
  vertexSprites[2].y = container.height

  vertexSprites[3].x = 0
  vertexSprites[3].y = container.height

  visualizing.push(trackerObj)
}

//updates 'visualize' PIXI elements
export function updateVisualizer() {
  visualizing.forEach(element => {
    //set new values
    console.log('element: ', element)
    element.pivot.x = element.container.pivot.x
    element.pivot.y = element.container.pivot.y

    element.vertecies[0].x = 0
    element.vertecies[0].y = 0

    element.vertecies[1].x = element.container.width
    element.vertecies[1].y = 0

    element.vertecies[2].x = element.container.width
    element.vertecies[2].y = element.container.height

    element.vertecies[3].x = 0
    element.vertecies[3].y = element.container.height
  })
}
