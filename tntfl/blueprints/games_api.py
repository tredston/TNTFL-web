import json

from flask import Blueprint, request

from tntfl.blueprints.common import tntfl
from tntfl.template_utils import gameToJson

games_api = Blueprint('games_api', __name__)


def within_lower_bound(game, games_from):
    return not games_from or game.time >= games_from


def within_upper_bound(game, games_to):
    return not games_to or game.time <= games_to


def include_if_deleted(game, include_deleted):
    return include_deleted or not game.isDeleted()


def accept(game, games_from, games_to, include_deleted):
    return within_lower_bound(game, games_from) and within_upper_bound(game, games_to) and include_if_deleted(game, include_deleted)


def filter_games(games, games_from, games_to, include_deleted):
    return [g for g in games if accept(g, games_from, games_to, include_deleted)]


def limit_games(games, limit):
    if limit:
        games = games[-int(limit):]
    return games


@games_api.route('/games/<int:games_from>/<int:games_to>/json')
def games(games_from, games_to):
    limit = request.args.get('limit')
    include_deleted = request.args.get('includeDeleted')
    if include_deleted:
        include_deleted = int(include_deleted)

    base = ''
    games = tntfl.get().games
    games = filter_games(games, games_from, games_to, include_deleted)
    games = limit_games(games, limit)

    return json.dumps([gameToJson(game, base) for game in games])
