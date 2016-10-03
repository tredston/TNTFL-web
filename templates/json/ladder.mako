<%!
import json
from tntfl.ladder import TableFootballLadder
import tntfl.constants as Constants
import tntfl.transforms.transforms as PresetTransforms
from tntfl.template_utils import playersToJson
base = "../"
%>
<%inherit file="json.mako" />
<%
ladder = TableFootballLadder(Constants.ladderFilePath, timeRange=timeRange, transforms=PresetTransforms.transforms_for_ladder())
players = [p for p in ladder.getPlayers() if ladder.isPlayerActive(p) ]
%>
${json.dumps(playersToJson(players, base))}
