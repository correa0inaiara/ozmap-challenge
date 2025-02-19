import { mongoose } from "@typegoose/typegoose"
import { isObjectID, isValid } from "../utils"

export const isUserValid = function(this: mongoose.Document, address: string, location: mongoose.Types.ObjectId) {
  
  let message: string = ""

  if (isValid(location) && !isObjectID(location)) {
    message = "Location is invalid"
    this.invalidate('location', message, location)
  }

  if (isValid(address) && typeof address != 'string') {
    message = 'Your address needs to be a string'
    this.invalidate('address', message, address)
  }

  if ((!isValid(address) && !isObjectID(location)) || (isValid(address) && isObjectID(location))) {
    message = 'You need to provide either address or location'
    this.invalidate('address', message, address)
    this.invalidate('location', message, location)
  }
}