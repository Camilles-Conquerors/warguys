import {renderUnit} from '../index.js'

export default class Unit {
  constructor(coordinates) {
    this.coordinates = coordinates
  }

  move(newCoordinates) {
    this.coordinates = newCoordinates
    renderUnit(this)
  }
}
