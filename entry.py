import json
import time

from flask import Flask, request, abort

import tntfl.transforms.elo as Elo
from tntfl.blueprints.common import tntfl, parse_times
from tntfl.blueprints.game_api import game_api
from tntfl.blueprints.games_api import games_api
from tntfl.blueprints.ladder_api import ladder_api
from tntfl.blueprints.pages import pages
from tntfl.blueprints.player_api import player_api
from tntfl.blueprints.pundit_api import pundit_api
from tntfl.blueprints.speculate_api import speculate_api
from tntfl.template_utils import gameToJson, getSharedGames, getStatsJson

app = Flask(__name__)
app.register_blueprint(pages)
app.register_blueprint(ladder_api)
app.register_blueprint(game_api)
app.register_blueprint(games_api)
app.register_blueprint(player_api)
app.register_blueprint(speculate_api)
app.register_blueprint(pundit_api)


@app.route('/recent/json')
def recent():
    base = "../"
    limit = request.args.get('limit') or 10

    recent_games = [l for l in tntfl.get().games if not l.isDeleted()][-limit:]

    return json.dumps([gameToJson(game, base) for game in reversed(recent_games)])


@app.route('/activeplayers/json')
def activePlayers():
    def add(record, time, cur):
        record[int(time)] = {'count': cur}

    at = request.args.get('at') or ''
    times = parse_times(at)
    active_players = {}
    if len(times) > 0:
        [add(active_players, t, tntfl.get().getNumActivePlayers(t)) for t in times]
    else:
        add(active_players, time.time(), tntfl.get().getNumActivePlayers())

    return json.dumps(active_players)


@app.route('/headtohead/<player1>/<player2>/games/json')
def headToHeadGames(player1, player2):
    base = '../../../../'

    if player1 in tntfl.get().players and player2 in tntfl.get().players:
        player1 = tntfl.get().getPlayer(player1)
        player2 = tntfl.get().getPlayer(player2)
        games = getSharedGames(player1, player2)
        return json.dumps([gameToJson(game, base) for game in games])
    else:
        abort(404)


@app.route('/predict/<red_elo>/<blue_elo>/json')
def predict(red_elo, blue_elo):
    return json.dumps({'blueGoalRatio': Elo.getBlueGoalRatio(float(red_elo), float(blue_elo))})


@app.route('/stats/json')
def stats():
    base = '../'
    return json.dumps(getStatsJson(tntfl.get(), base))
