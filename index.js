var http = require("http")
var url = require("url")
var querystring = require("querystring")

var CSV = require("./CSV")
var Type = require("./Type")
var Cookie = require("./Cookie")
var HttpError = require("./HttpError")

var home = require("fs").readFileSync("index.html", "utf-8")
var data = require("./data.json")

http.createServer(function route(req, res) {
	var u = url.parse(req.url)
	var q = u.search ? querystring.parse(u.search.slice(1)) : {}
	var args = u.pathname.match(/\/(api)\/([^\/]+)(?:\/([^\/]+))?/) // `/api/:collection/:id`
	try {
		if (args == null) {
			if (u.pathname === "/") {
				res.writeHead(200)
				res.end(home)
				return
			}
			else throw new HttpError(404, "Not found")
		}
		var resStatus = req.headers['rem-response-status']
		if (resStatus) throw new HttpError(Number(resStatus), "Rem-Response-Status")
		if (args[1] !== "api") throw new HttpError(404, "Not found")
		var key = args[2]
		var id = Number(args[3])
		var db = getData(req.headers.cookie)
		var items = db[key] || []
	req.method = req.method.toUpperCase()
		if (req.method === "GET") {
			res.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": req.headers.origin || '',
				"Access-Control-Allow-Credentials": "true",
			})
			var offset = isNaN(parseInt(q.offset, 10)) ? 0 : parseInt(q.offset, 10)
			var limit = isNaN(parseInt(q.limit, 10)) ? 10 : parseInt(q.limit, 10)
			var payload = get(id, items)
			var output = payload instanceof Array ? {
				data: payload.slice(offset, offset + limit),
				offset: offset,
				limit: limit,
				total: items.length,
			} : payload
			res.end(JSON.stringify(output, null, 2))
		}
		else if (req.method === "PUT" || req.method === "POST" || req.method === "DELETE") {
			var body = ""
			req.on("data",function(data) {
				body += data.toString()
 			})
			req.on("end",function commit() {
				try {
					var item = body !== "" ? JSON.parse(body) : null
					if (req.method === "DELETE") remove(id, items)
					else if (item != null) {
						if (req.method === "PUT") put(id, items, item)
						if (req.method === "POST") post(id, items, item)
					}
					else throw new HttpError(400, "Missing JSON input")
					db[key] = items
					var output = stageData(db)
					if (output.length <= 4093) {
						res.writeHead(200, {
							"Content-Type": "application/json",
							"Set-Cookie": output,
							"Access-Control-Allow-Origin": req.headers.origin || '',
							"Access-Control-Allow-Credentials": "true",
						})
						res.end(JSON.stringify(item, null, 2))
					}
					else {
						var error = new HttpError(500, "Database size limit exceeded! Clearing data")
						for (var k in db) db[k] = []
						res.writeHead(500, {
							"Content-Type": "application/json",
							"Set-Cookie": output,
							"Access-Control-Allow-Origin": req.headers.origin || '',
							"Access-Control-Allow-Credentials": "true",
						})
						res.end(JSON.stringify({message: error.message, stack: e.stack}, null, 2))
					}
				}
				catch (e) {
					console.log(e)
					res.writeHead((e && e.method) || 400, {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": req.headers.origin || '',
						"Access-Control-Allow-Credentials": "true",
					})
					res.end(JSON.stringify({message: e.message, stack: e.stack}, null, 2))
				}
			})
		}
		else if (req.method === "OPTIONS") {
			res.writeHead(200, {
				"Access-Control-Allow-Origin": req.headers.origin || '',
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type,Rem-Response-Status",
				"Access-Control-Max-Age": 600, // seconds
			})
			res.end("")
		}
		else throw new HttpError(405, "Method not allowed")
	}
	catch (e) {
		res.writeHead(e.method || 400, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": req.headers.origin || '',
			"Access-Control-Allow-Credentials": "true",
		})
		res.end(JSON.stringify({message: e.message, stack: e.stack}, null, 2))
	}
}).listen(process.env.PORT || 8000)

function getData(cookieString) {
	var map = Cookie.parse(cookieString)
	if (Object.keys(map).length > 0) {
		for (var k in map) {
			var csv = CSV.parse(map[k])
			map[k] = Type.decode(csv)
		}
		return map
	}
	return JSON.parse(JSON.stringify(data))
}
function stageData(db) {
	var cookies = []
	for (var k in db) {
		var typed = Type.encode(db[k])
		var csv = CSV.create(typed)
		cookies.push(k + "=" + encodeURIComponent(csv) + "; Path=/;")
	}
	return cookies
}
function get(id, items) {
	if (!id) return items
	for (var i = 0; i < items.length; i++) {
		if (items[i].id === id) return items[i]
	}
	throw new HttpError(404, "Item not found")
}
function put(id, items, item) {
	if (!id) throw new HttpError(400, "ID must be provided")
	item.id = id
	var found = false
	for (var i = 0; i < items.length; i++) {
		if (items[i].id === id) {
			items[i] = item
			found = true
			break
		}
	}
	if (!found) items.push(item)
}
function post(id, items, item) {
	if (id) throw new HttpError(400, "Cannot post with ID")
	var last = items.slice().sort(function(a, b) {return b.id - a.id})[0]
	var newId = last ? last.id : 0
	item.id = Number(newId) + 1
	items.push(item)
}
function remove(id, items) {
	if (!id) throw new HttpError(400, "ID must be provided")
	for (var i = 0; i < items.length; i++) {
		if (items[i].id === id) items.splice(i, 1)
	}
}
