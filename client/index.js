import * as PIXI from 'pixi.js'
const canvas = document.getElementById('mycanvas')

const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight
})
