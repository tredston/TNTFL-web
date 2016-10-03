# TNTFL

A Table Football Ladder website.

## API
A JSON API is available for ladder data.

In the JSON returned, links to other resources are represented by an object with an 'href' property. The value of this property is the URI of the linked resource.

### Player Info
`player/<playername>/json`

### Player games
`player/<playername>/games/json`

Contains full game data, rather than href links; because of this, responses could be quite large.

### Game Info
`game/<gameid>/json`

Where `gameid` is the epoch of when the game was played.

### Game list
`games.cgi?view=json&from=<time>&to=<time>`

Arguments:

* `from` specifies the epoch to start at

* `to` specifies the epoch to stop at

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

Arguments:

* `gamesFrom` (optional) epoch to start at

* `gamesTo` (optional) epoch to end at

Specifying `gamesFrom` and `gamesTo` calculates a ladder for the given time range.

### Recent Games
`recent/json`

Arguments:

* `limit` (optional) number of most recent games to return, defaults to 10.
