<%!
import json
from tntfl.ladder import TableFootballLadder
import tntfl.constants as Constants
import tntfl.transforms.transforms as PresetTransforms
from tntfl.template_utils import ladderToJson
base = "../"
%>
<%inherit file="json.mako" />
<%
ladder = TableFootballLadder(Constants.ladderFilePath, timeRange=timeRange, transforms=PresetTransforms.transforms_for_ladder())
players = ladder.getPlayers() if showInactive else [p for p in ladder.getPlayers() if ladder.isPlayerActive(p)]
%>
${json.dumps(ladderToJson(players, ladder, base, includePlayers))}
