<%!
import json
from tntfl.ladder import TableFootballLadder
import tntfl.constants as Constants
import tntfl.transforms.transforms as PresetTransforms
base = "../"


def href(base, name):
    return base + 'player/' + name + '/json'


def toJson(players):
    return [{'rank': i + 1, 'name': p.name, 'skill': p.elo, 'href': href(base, p.name)} for i, p in enumerate(players)]
%>
<%inherit file="json.mako" />
<%
ladder = TableFootballLadder(Constants.ladderFilePath, timeRange=timeRange, transforms=PresetTransforms.transforms_for_ladder())
players = [p for p in ladder.getPlayers() if ladder.isPlayerActive(p) ]
%>
${json.dumps(toJson(players))}
