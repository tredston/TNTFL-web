<%!
base = "../"
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
import tntfl.transforms.transforms as PresetTransforms
import json
from tntfl.template_utils import gameToJson
%>
<%inherit file="json.mako" />
<%
  ladder = TableFootballLadder(Constants.ladderFilePath)
  recentGames = [l for l in ladder.games if not l.isDeleted()][-limit:]
  recentGames.reverse()
%>
${json.dumps([gameToJson(game, base) for game in recentGames])}
