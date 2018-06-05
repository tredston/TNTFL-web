import json
from urllib.parse import urljoin

import requests
from flask import abort, Blueprint, request, redirect

from tntfl.blueprints.common import tntfl
from tntfl.constants import config
from tntfl.template_utils import gameToJson

game_api = Blueprint('game_api', __name__)


@game_api.route('/game/add/json', methods=['POST'])
def add():
    url = urljoin(config.ladder_host, 'game/add')
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


@game_api.route('/game/<int:game_time>/delete/json', methods=['GET', 'POST'])
def delete(game_time):
    tntfl.invalidate()
    referrer = request.referrer
    if referrer and referrer.endswith('/delete'):
        referrer = referrer[:-len('/delete')]
        url = urljoin(config.ladder_host, 'game/{}/delete?redirect={}'.format(game_time, referrer))
        return redirect(url, code=302)
    return '', 204
