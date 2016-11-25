# TNTFL

A Table Football Ladder website.

## API
A JSON API is available for ladder data.

In the JSON returned, links to other resources are represented by an object with an 'href' property. The value of this property is the URI of the linked resource.

### Player Info
`player/<playername>/json`

### Player Games
`player/<playername>/games/json`

Contains full game data, rather than href links; because of this, responses could be quite large.

### Game Info
`game/<gameid>/json`

Where `gameid` is the epoch of when the game was played.

### Game List
`games/<epoch>/<epoch>/json`

Returns the list of games played between the two dates provided.

Arguments:

* `includeDeleted` (optional) specifies whether to include deleted games. Can be 0 or 1, defaults to 0

### Add Game
`game/add/json` (POST)

Request should be a POST containing the following fields:

* `redPlayer`

* `redScore`

* `bluePlayer`

* `blueScore`

Returns a game resource representing the added game.

### Ladder
`ladder/json`

`ladder/<epoch>/<epoch>/json`

Limits the ladder to the two dates provided.

### Recent Games
`recent/json`

Arguments:

* `limit` (optional) number of most recent games to return, defaults to 10.

### Pundit
`pundit/<epoch>/json`
