import json

from flask import Blueprint, request, abort

from tntfl.blueprints.common import tntfl, parse_times
from tntfl.pundit import Pundit

pundit_api = Blueprint('pundit_api', __name__)


def getFacts(gameTime, ladder):
    game = next(g for g in ladder.games if g.time == gameTime)
    red = ladder.getPlayer(game.redPlayer)
    blue = ladder.getPlayer(game.bluePlayer)
    pundit = Pundit()
    red_facts = pundit.getAllForGame(red, game, blue)
    blue_facts = pundit.getAllForGame(blue, game, red)
    return red_facts + blue_facts


@pundit_api.route('/pundit/json')
def pundit():
    at = request.args.get('at') or ''
    times = parse_times(at)
    if len(times) > 0:
        try:
            punditry = dict([(t, {"facts": getFacts(t, tntfl.get())}) for t in times])
            return json.dumps(punditry)
        except StopIteration:
            abort(404)
    else:
        abort(400)
