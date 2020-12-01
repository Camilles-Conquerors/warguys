import {renderUnits} from '../index.js'

export default class Unit {
  constructor(coordinates) {
    this.coordinates = coordinates
  }

  move(newCoordinates) {
    console.log('new coords', newCoordinates)
    this.coordinates = newCoordinates

    //renderUnits(this)

  }
}
