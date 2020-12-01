export default class Unit {
  constructor(name, coordinates) {
    this.coordinates = coordinates
    this.name = name
  }

  move(newCoordinates) {
    this.coordinates = newCoordinates
    return true
  }
}
