<%!
import json
from tntfl.template_utils import ladderToJson, gameToJson
base = "../"
%>
<%inherit file="json.mako" />
<%
players = ladder.getPlayers() if showInactive else [p for p in ladder.getPlayers() if ladder.isPlayerActive(p)]
%>
${json.dumps({
  'entries': ladderToJson(players, ladder, base, includePlayers),
  'games': [gameToJson(game, base) for game in ladder.games[-len(speculativeGames):]],
})}
