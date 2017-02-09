var first = ["Peter", "Cindy", "Ted", "Susan", "Emily"]
var last = ["Mackenzie", "Zhang", "Smith", "Fernbrook", "Kim"]

var users = [], id = 1
for (var i = 0; i < last.length; i++) {
  for (var j = 0; j < first.length; j++) {
    var f = first[j]
    var l = last[j + i < first.length ? j + i : j + i - first.length]
    users.push({id: id++, firstName: f, lastName: l/*, email: (f + l + "@mailinator.com").toLowerCase()*/})
  }
}

var data = {users: users}

require("fs").writeFileSync("data.json", JSON.stringify(data, null, 4), "utf-8")
