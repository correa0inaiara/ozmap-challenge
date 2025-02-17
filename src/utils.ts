import { mongoose } from "@typegoose/typegoose"

export const isValid = function (param) {
  if (!param || param == null || param == undefined || param == "" || Object.keys(param).length == 0) {
    return false
  }
  return true
}

export const isObjectID = function (param) {
  if (mongoose.Types.ObjectId.isValid(param)) {
    return true
  }
  return false
}