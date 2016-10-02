<%!
import json
from tntfl.template_utils import gameToJson
base = ""

def accept(game, fromTime, toTime, includeDeleted):
    return (not fromTime or game.time >= fromTime) and (not toTime or game.time <= toTime) and (includeDeleted or not game.isDeleted())
%>
<%
games = [g for g in ladder.games if accept(g, fromTime, toTime, includeDeleted)]
if limit:
    games = games[-limit:]
%>
<%inherit file="json.mako" />
${json.dumps([gameToJson(game, base) for game in games])}
