import { isValid } from "../utils"

export const isUserValid = function(this, address, coordinates) {
  console.log("this ", this)
  console.log("address ", address)
  console.log("coordinates ", coordinates)
  let message: string = ""
  
  if (isValid(address) && typeof address != 'string') {
    message = 'Your address needs to be a string'
    this.invalidate('address', message, address)
  }

  if (isValid(coordinates) && !Array.isArray(coordinates)) {
    message = 'Your coordinates needs to be an array of type Coordinates: [number, number]'
    this.invalidate('coordinates', message, coordinates)
  }

  if (isValid(coordinates) && Array.isArray(coordinates) && coordinates.length != 2) {
    message = 'Your coordinates needs to be an array of type Coordinates: [number, number]'
    this.invalidate('coordinates', message, coordinates)
  }

  if (isValid(coordinates) && Array.isArray(coordinates) 
    && coordinates.length == 2 && (typeof coordinates[0] != 'number' || typeof coordinates[1] != 'number')) {
    message = 'Your coordinates needs to be an array of type Coordinates: [number, number]'
    this.invalidate('coordinates', message, coordinates)
  }

  if ((!isValid(address) && !isValid(coordinates)) || (isValid(address) && isValid(coordinates))) {
    message = 'You need to provide either address or coordinates'
    this.invalidate('address', message, address)
    this.invalidate('coordinates', message, coordinates)
  }
}