module.exports = function(method, message) {
  var error = new Error(message)
  error.method = method
  return error
}
