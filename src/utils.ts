export const isValid = function (param) {
  if (!param || param == null || param == undefined || param == "" || Object.keys(param).length == 0) {
    return false
  }
  return true
}