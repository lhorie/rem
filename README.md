# REM

A starting point for big dreams.

REM is a REST API for prototyping.

Creating an application these days can often be paralyzing: Ruby or Python? Flask or Express? MySQL or Postgres? What about Redis? Often times, people give up before even starting.

REM is useful if you want to put together a UI but don't want to set up a server and a database to store your data yet (or ever). Maybe you're making a demo, running a workshop, or test-driving a trendy javascript framework. Whatever it is, if you just want to get an idea on screen, this tool is for you.

The REM API responds as if it had a real database storing your data, but rather than doing that, it saves data in a cookie instead.

This means you can create entities, update them and query them, and the data will persist between requests, just like in a real API. The difference vs a real API is that no one else can see your data, because nothing actually gets saved in the server. Any data you create is only available to you, and only until the end of the browser session. As it turns out, this is sufficient for you to develop and test server interactions, and can even help iron out those embarrassing edge cases that made your last demo break because you forgot to account for zero-length lists.

The `/api/users` endpoint comes pre-populated with some dummy data. You can also post anything to any endpoint you want (e.g. `/api/projects`, `/api/comments`, `/api/toys`, and so on) to create datasets on the fly. Those start off empty. `POST` endpoints automatically add an `id` field to new entities. In the same vein, other endpoints expect the primary key field to be called `id`, so that request like `PUT /api/things/1` and `DELETE /api/others/2` can affect the correct entities. Other than that, there are no schema restrictions.

The server has [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled for all origins, and no API key is required. You can just make requests from anywhere and be on your way.

Note that cookies can only store about 4kb worth of data. If you go over the limit, the server will return an error and clear the cookie. When this happens, all the data will be erased, so you can continue using REM as a data storage mechanism without needing to mess around with the storage cookie.

### About

REM is ~200 LOC, and has no NPM dependencies.

Licence: MIT

---

## API

Get a list of things

```
GET http://[server]/api/[things]
```

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
GET http://[server]/api/[things]?offset=1&limit=10
```

---

Get one thing

```
GET http://[server]/api/[things]/1
```

```
{
  "id": "1",
  "firstName": "Peter",
  "lastName": "Mackenzie",
  "email": "petermackenzie@mailinator.com"
}
```

---

Create new thing

```
POST http://[server]/api/[things]

{"firstName": "Lorem", "lastName": "Ipsum", "email": "loremipsum@mailinator.com"}
```

---

Replace thing

```
PUT http://[server]/api/[things]/1

{"id": 1, "firstName": "Lorem", "lastName": "Ipsum", "email": "loremipsum@mailinator.com"}
```

---

Delete thing

```
DELETE http://[server]/api/[things]/1
```
