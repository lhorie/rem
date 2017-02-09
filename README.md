# REM REST API

[API](#api) | [What REM offers](#what-rem-offers) | [Why REM](#why-rem) | [How it works](#how-it-works) | [About](#about) | [Try it](http://rem-rest-api.herokuapp.com)

A starting point for big dreams.

REM is a REST API for prototyping. It accepts JSON requests, returns JSON responses and persists data between requests like a real API. But your test data is only visible to you. It's [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled and no API key is required.

```javascript
var xhr = new XMLHttpRequest()
xhr.open("GET", "http://rem-rest-api.herokuapp.com/api/users", true)
xhr.withCredentials = true
xhr.send()
xhr.onload = function() {
  var data = JSON.parse(xhr.responseText)
}
```

---

### API

#### Get a list of things

```
GET http://rem-rest-api.herokuapp.com/api/users
//or
GET http://rem-rest-api.herokuapp.com/api/projects
//or
GET http://rem-rest-api.herokuapp.com/api/[whatever]
```

Results:

```
{
  "offset": 0,
  "limit": 10,
  "total": 36,
  "data": [{
    "id": "1",
    "firstName": "Peter",
    "lastName": "Mackenzie",
  }, ...]
}
```

Optional querystring parameters:

- `offset`: pagination offset. Defaults to `0`
- `limit`: pagination size. Defaults to `10`

```
GET http://rem-rest-api.herokuapp.com/api/[things]?offset=1&limit=10
```

---

#### Get one thing

```
GET http://rem-rest-api.herokuapp.com/api/[things]/1
```

Results:

```
{
  "id": "1",
  "firstName": "Peter",
  "lastName": "Mackenzie"
}
```

---

#### Create new thing

```
POST http://rem-rest-api.herokuapp.com/api/[things]

{"firstName": "Lorem", "lastName": "Ipsum"}
```

---

#### Upsert/replace thing

```
PUT http://rem-rest-api.herokuapp.com/api/[things]/1

{"id": 1, "firstName": "Lorem", "lastName": "Ipsum"}
```

---

#### Delete thing

```
DELETE http://rem-rest-api.herokuapp.com/api/[things]/1
```

---

### What REM offers

The `/api/users` endpoint comes pre-populated with some dummy data. You can also post anything to any endpoint you want (e.g. `/api/projects`, `/api/comments`, `/api/toys`, and so on) to create datasets on the fly. Those start off empty. `POST` endpoints automatically add an `id` field to new entities. In the same vein, other endpoints expect the primary key field to be called `id`, so that request like `PUT /api/things/1` and `DELETE /api/others/2` can affect the correct entities. Other than that, there are no schema restrictions.

The server has [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled for all origins, and no API key is required. You can just make requests from anywhere and be on your way.

---

### Why REM

Creating an application these days can often be paralyzing: Ruby or Python? Flask or Express? MySQL or Postgres? What about Redis? Often times, people give up before even starting.

REM is useful if you want to put together a UI but don't want to set up a server and a database to store your data yet (or ever). Maybe you're making a demo, running a workshop, or test-driving a trendy javascript framework. Whatever it is, if you just want to get an idea on screen, this tool is for you.

---

### How it works

The REM API responds as if it had a real database storing your data, but rather than doing that, it saves data in a cookie instead.

This means you can create entities, update them and query them, and the data will persist between requests, just like in a real API. The difference vs a real API is that no one else can see your data, because nothing actually gets saved in the server. Any data you create is only available to you, and only until the end of the browser session.

Note that cookies can only store about 4kb worth of data. If you go over the limit, the server will return an error and clear the cookie. When this happens, all the data will be erased, so you can continue using REM as a data storage mechanism without needing to mess around with the storage cookie.

---

### About

REM is ~250 LOC, and has no NPM dependencies.

Licence: MIT
