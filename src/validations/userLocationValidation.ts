import { mongoose } from "@typegoose/typegoose";
import { isValid } from "../utils";
import { log } from "../logs";

export const isUserLocationValid = function(this: mongoose.Document, coordinates: [[[number]]]) {
  
  let message: string = ""

  if (!isValid(coordinates)) {
    message = 'Coordinates are invalid'
    log.error({api: message})
    this.invalidate('coordinates', message, coordinates)
  }
}