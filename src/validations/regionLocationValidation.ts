import { mongoose } from "@typegoose/typegoose";
import { isValid } from "../utils";

export const isRegionLocationValid = function(this: mongoose.Document, coordinates: [[[number, number]]]) {

  let message: string = ""

  if (!isValid(coordinates)) {
    message = 'Coordinates are invalid'
    this.invalidate('coordinates', message, coordinates)
    return
  }

  for (const polygons of coordinates) {
    if (polygons.length < 4) {
      message = 'Polygon Coordinates are invalid'
      this.invalidate('coordinates', message, coordinates)
      return
    }
    const size = polygons.length
    if ((polygons[0][0] != polygons[size-1][0]) ||
      (polygons[0][1] != polygons[size-1][1])
    ) {
      message = 'The first and last points needs to be the same to complete the polygon'
      this.invalidate('coordinates', message, coordinates)
      return
    }

    for (const polygon of polygons) {
      if (polygon.length != 2) {
        message = 'Each point needs a longitude and a latitude, in this order'
        this.invalidate('coordinates', message, coordinates)
        return
      }

      if (typeof polygon[0] != 'number' || typeof polygon[1] != 'number') {
        message = 'The longitude and latitude points needs to represented in numbers'
        this.invalidate('coordinates', message, coordinates)
        return
      }
    }
  }

}