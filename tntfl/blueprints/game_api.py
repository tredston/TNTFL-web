import json
from urllib.parse import urljoin

import requests
from flask import abort, Blueprint, request

from tntfl.blueprints.common import tntfl
from tntfl.constants import ladder_host
from tntfl.template_utils import gameToJson

game_api = Blueprint('game_api', __name__)


@game_api.route('/game/add/json', methods=['POST'])
def add():
    url = urljoin(ladder_host, 'game/add')
    query = {
        'redPlayer': request.args.get('redPlayer'),
        'redScore': request.args.get('redScore'),
        'bluePlayer': request.args.get('bluePlayer'),
        'blueScore': request.args.get('blueScore'),
    }
    response = requests.post(url, params=query)
    if response.status_code is not 204:
        abort(response.status_code)

    tntfl.invalidate()

    base = '../../'
    game = tntfl.get().games[-1]
    return json.dumps(gameToJson(game, base))


@game_api.route('/game/<int:game_time>/json')
def game(game_time):
    try:
        base = '../../'
        game = next(g for g in tntfl.get().games if g.time == game_time)
        return json.dumps(gameToJson(game, base))
    except StopIteration:
        abort(404)


@game_api.route('/game/<int:game_time>/delete/json', methods=['POST'])
def delete(game_time):
    tntfl.invalidate()
    return ''