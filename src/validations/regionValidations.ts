import { mongoose } from "@typegoose/typegoose"
import { isObjectID, isValid } from "../utils"

export const isRegionValid = function (this: mongoose.Document, name: string, user: mongoose.Types.ObjectId, location: mongoose.Types.ObjectId) {
  let message: string = ""

  if (!isValid(name)) {
    message = "You need to give the region a name"
    this.invalidate('name', message, name)
  }

  if (!isObjectID(user)) {
    message = "You need to provide a user for the region"
    this.invalidate('user', message, user)
  }

  if (!isObjectID(location)) {
    message = "You need to provide a location."
    this.invalidate('location', message, location)
  }
}