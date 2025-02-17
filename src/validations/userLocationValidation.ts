import { mongoose } from "@typegoose/typegoose";
import { isValid } from "../utils";

export const isUserLocationValid = function(this: mongoose.Document, coordinates: [[[number]]]) {

  let message: string = ""

  if (!isValid(coordinates)) {
    message = 'Coordinates are invalid'
    this.invalidate('coordinates', message, coordinates)
  }
}