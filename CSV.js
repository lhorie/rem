module.exports = {
  parse: function parseCSV(csv) {
    var data = [], keys = [], header = true
    var i = 0, start = 0, col = 0, item = {}
    while (i < csv.length) {
      if (csv[i] === "\"") {
        start = i + 1
        while (++i) {
          if (csv[i] === "\\") i += 2
          if (csv[i] === "\"") break
        }
        var value = csv.substring(start, i).replace(/\\(.)/g, "$1")
        if (header) keys.push(value)
        else item[keys[col]] = value
        i++
        continue
      }
      if (csv[i] === ",") {
        var value = csv.substring(start, i)
        if (header) keys.push(value)
        else item[keys[col]] = item[keys[col]] != null ? item[keys[col]] : value
        start = ++i
        col++
        continue
      }
      if (csv[i] === "\n") {
        var value = csv.substring(start, i)
        start = ++i
        if (header) {
          keys.push(value)
          header = false
        }
        else {
          item[keys[col]] = item[keys[col]] != null ? item[keys[col]] : value
          data.push(item)
          item = {}
        }
        col = 0
        continue
      }
      i++
    }
    if (Object.keys(item).length > 0) {
      var value = csv.substring(start, i)
      item[keys[col]] = item[keys[col]] != null ? item[keys[col]] : value
      data.push(item)
    }
    return data
  },
  create: function(list) {
    var data = ""
    for (var k in list[0]) {
      data += k + ","
    }
    data = data.slice(0, -1) + "\n"

    for (var i = 0; i < list.length; i++) {
      for (var k in list[0]) {
        var value = list[i][k] !== undefined ? String(list[i][k]) : ""
        data += value.indexOf("\"") > -1 ? "\"" + value.replace(/("|,)/g, "\\$1") + "\"," : value + ","
      }
      data = data.slice(0, -1) + "\n"
    }
    data = data.slice(0, -1)
    return data
  }
}
