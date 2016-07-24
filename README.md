# pokemon-server

## Getting started

```
npm install
npm start
```

Then navigate to [http://localhost:3000](http://localhost:3000)

## Routes

`GET /login?username=&password=&provider=`

Log the current user with given username/password/provider

`GET /me`

Get information about the current user

`GET /getHeartbeat/XX,XX`

Get nearest pokemons

`GET /users`

Get current users connected through the API
