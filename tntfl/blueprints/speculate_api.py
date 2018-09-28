import json
import time

from flask import Blueprint, request

import tntfl.transforms.transformer as Transformer
import tntfl.transforms.transforms as PresetTransforms
from tntfl.constants import config
from tntfl.game import Game
from tntfl.game_store import GameStore
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import getSpeculateJson

speculate_api = Blueprint('speculate_api', __name__)


def deserialise(serialisedGames):
    game_parts = serialisedGames.split(',')
    games = []
    now = time.time()
    num_games = len(game_parts) // 4
    for i in range(0, num_games):
        g = Game(game_parts[4 * i].lower(), game_parts[4 * i + 1], game_parts[4 * i + 3].lower(), game_parts[4 * i + 2], now - (num_games - i))
        games.append(g)
    return games


def getLadder(speculative_games):
    transforms = PresetTransforms.transforms_for_recent()
    games = Transformer.transform(lambda: GameStore(config.ladderFilePath).getGames(), transforms)

    if len(speculative_games) > 0:
        games += speculative_games
        games = Transformer.transform(lambda: games, transforms)

    return TableFootballLadder(None, games=games)


def get_speculated_games(ladder, speculative_games):
    num_games = len(speculative_games)
    return ladder.games[-num_games:] if num_games > 0 else []


@speculate_api.route('/speculate/json')
def speculate():
    base = '../'
    show_inactive = request.args.get('showInactive')
    include_players = request.args.get('players')

    speculative_games = deserialise(request.args.get('previousGames') or '')

    ladder = getLadder(speculative_games)
    speculated_games = get_speculated_games(ladder, speculative_games)

    return json.dumps(getSpeculateJson(ladder, base, speculated_games, show_inactive, include_players))
