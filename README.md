# TNTFL

A table football ladder.

## Deployment

Comes in two parts:
* a [web server](https://hub.docker.com/r/tredston/tntfl/) which hosts the API and UI
  * provide the configuration file at `/tntfl/tntfl.cfg`
* a separate ladder host, which manages the history of games played
  * comprises a checkout of this repo, hosted on a *persistent* httpd server or equivalent
  * `.htaccess` will need modifying for routing and auth
  * `game.cgi` and `delete.cgi` must be executable
  * the ladder file must be readable
  * provide the (same) configuration file at `tntfl.cfg` in the root of the checkout

## Configuration

Expected to be found in `tntfl.cfg` in the current working directory.

Example:
```
[tntfl]
ladder_file = ladder.txt
ladder_host = https://example.url
boss = company-ceo

[mattermost]
mattermost_url = https://mattermost.example.url
api_key = api-key
delete_api_key = api-key
tntfl_url = https://deployment.url
```

## Development

The web server is written with flask and can be started with:
```bash
FLASK_APP=tntfl/blueprints/entry.py python3 -m flask run
```
