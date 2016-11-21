module.exports = {
  parse: function(cookie) {
    var data = {}
    if (cookie) {
      cookie.split(";").forEach(function(c) {
        var parts = c.split("=")
        var key = parts.shift().trim()
        if (key !== "Path" && key !== "Domain" && key !== "Expires" && key !== "Secure" && key !== "HttpOnly") {
          data[key] = decodeURIComponent(parts.join("="))
        }
      })
    }
    return data
  }
}
