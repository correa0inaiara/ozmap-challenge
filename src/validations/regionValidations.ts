import { mongoose } from "@typegoose/typegoose"
import { isObjectID, isValid } from "../utils"
import { log } from "../logs"

export const isRegionValid = function (this: mongoose.Document, name: string, user: mongoose.Types.ObjectId, location: mongoose.Types.ObjectId) {
  let message: string = ""

  if (!isValid(name)) {
    message = "You need to give the region a name"
    log.error({api: message})
    this.invalidate('name', message, name)
  }

  if (!isObjectID(user)) {
    message = "You need to provide a user for the region"
    log.error({api: message})
    this.invalidate('user', message, user)
  }

  if (!isObjectID(location)) {
    message = "You need to provide a location."
    log.error({api: message})
    this.invalidate('location', message, location)
  }
}