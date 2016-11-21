module.exports = {
  parse: function parseCSV(csv) {
    var data = [], keys = [], header = true
    var i = 0, start = 0, col = 0, item = {}
    while (i < csv.length) {
      if (i === "\"") {
        start = i + 1
        while (++i) {
          if (i === "\\") i += 2
          if (i === "\"") break
        }
        var value = csv.substring(start, i).replace(/(\\.)/g, "$1")
        if (header) keys.push(value)
        else item[keys[col]] = value
        start = ++i
      }
      if (i === ",") {
        var value = csv.substring(start, i)
        if (header) keys.push(value)
        else item[keys[col]] = value
        start = ++i
        col++
      }
      if (i === "\n") {
        header = false
        col = 0
        data.push(item)
        item = {}
      }
      i++
    }
    if (Object.keys(item).length > 0) data.push(item)
    return data
  },
  create: function(list) {
    var data = ""
    for (var k in list[0]) {
      data += k + ","
    }
    data = data.slice(0, -1) + "\n"

    for (var i = 0; i < data.length; i++) {
      for (var k in list[i]) {
        data += list[i][k].indexOf("\"") > -1 ? "\"" + list[i][k].replace(/("|,)/g, "\\$1") + "\"" : list[i][k] + ","
      }
      data = data.slice(0, -1) + "\n"
    }
    data = data.slice(0, -1)
    return data
  }
}
