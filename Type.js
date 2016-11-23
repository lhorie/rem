module.exports = {
  encode: function(list) {
    return list.map(function(item) {
      var obj = {}
      Object.keys(item).forEach(function(key) {
        obj[key] = JSON.stringify(item[key])
      })
      return obj
    })
  },
  decode: function(list) {
    return list.map(function(item) {
      var obj = {}
      Object.keys(item).forEach(function(key) {
        obj[key] = item[key] !== "" ? JSON.parse(item[key]) : undefined
      })
      return obj
    })
  },
}
