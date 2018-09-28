import json

from flask import abort, Blueprint

from tntfl.blueprints.common import tntfl
from tntfl.template_utils import playerToJson, gameToJson, getPlayerAchievementsJson, perPlayerStatsToJson, getPerPlayerStats

player_api = Blueprint('player_api', __name__)


@player_api.route('/player/<player>/json')
def player(player):
    if player in tntfl.get().players:
        return json.dumps(playerToJson(tntfl.get().getPlayer(player), tntfl.get()))
    else:
        abort(404)


@player_api.route('/player/<player>/games/json')
def playerGames(player):
    base = "../../../"
    if player in tntfl.get().players:
        return json.dumps([gameToJson(game, base) for game in tntfl.get().getPlayer(player).games])
    else:
        abort(404)


@player_api.route('/player/<player>/achievements/json')
def achievements(player):
    if player in tntfl.get().players:
        return json.dumps(getPlayerAchievementsJson(tntfl.get().getPlayer(player)))
    else:
        abort(404)


@player_api.route('/player/<player>/perplayerstats/json')
def perPlayerStats(player):
    if player in tntfl.get().players:
        return json.dumps(perPlayerStatsToJson(getPerPlayerStats(tntfl.get().getPlayer(player))))
    else:
        abort(404)
