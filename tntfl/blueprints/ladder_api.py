import json

from flask import Blueprint, request

import tntfl.constants as Constants
import tntfl.transforms.transforms as PresetTransforms
from tntfl.blueprints.common import tntfl
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import ladderToJson

ladder_api = Blueprint('ladder_api', __name__)


@ladder_api.route('/ladder/json')
def ladder():
    base = "../"
    this_tntfl = tntfl.get()

    show_inactive = request.args.get('showInactive')
    include_players = request.args.get('players')

    games_from = request.args.get('gamesFrom')
    games_to = request.args.get('gamesTo')
    if games_from and games_to:
        time_range = (int(games_from), int(games_to))
        this_tntfl = TableFootballLadder(Constants.ladderFilePath, useCache=True, timeRange=time_range, transforms=PresetTransforms.transforms_for_ladder())

    return json.dumps(ladderToJson(this_tntfl, base, show_inactive, include_players))


@ladder_api.route('/ladder/<int:games_from>/<int:games_to>/json')
def ladderRange(games_from, games_to):
    base = "../../../"

    show_inactive = request.args.get('showInactive')
    include_players = request.args.get('players')

    time_range = (int(games_from), int(games_to))
    this_tntfl = TableFootballLadder(Constants.ladderFilePath, useCache=True, timeRange=time_range, transforms=PresetTransforms.transforms_for_ladder())

    return json.dumps(ladderToJson(this_tntfl, base, show_inactive, include_players))
